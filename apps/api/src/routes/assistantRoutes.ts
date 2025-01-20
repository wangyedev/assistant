import express from "express";
import OpenAI from "openai";
import { config } from "../config";
import { availableFunctions, functions } from "../functions";
import { ChatService } from "../services/chatService";

const router = express.Router();
const openai = new OpenAI({ apiKey: config.openAiApiKey });

interface ToolCall {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

router.post("/chat", async (req, res) => {
  // Helper function to send events
  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const { message, userId, chatId } = req.body;

  try {
    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Get recent chat context
    const recentMessages = await ChatService.getRecentContext(userId);

    // Start thinking
    sendEvent("thinking", { content: "Analyzing your request..." });

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant specializing in compliance information and general queries...`,
        },
        // Include recent context
        ...recentMessages.map((msg) => ({
          role: msg.role as "assistant" | "user" | "system" | "function",
          content: msg.content,
          ...(msg.name && { name: msg.name }),
        })),
        { role: "user", content: message },
      ] as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      tools: [
        ...availableFunctions.map((fn) => ({
          type: "function" as const,
          function: fn,
        })),
      ],
      tool_choice: "auto",
      stream: true,
    });

    // Save user message
    await ChatService.addMessage(chatId, {
      role: "user",
      content: message,
    });

    let currentToolCall: Partial<ToolCall> = {};
    let hasExecutedFunction = false;
    let responseMessage = "";
    let display: any;

    for await (const chunk of completion) {
      if (chunk.choices[0]?.delta?.content) {
        const content = chunk.choices[0].delta.content;
        responseMessage += content;
        console.log("Received content chunk:", content);
        sendEvent("content", { content });
      }

      const toolCall = chunk.choices[0]?.delta?.tool_calls?.[0];
      if (toolCall && !hasExecutedFunction) {
        console.log("Received tool call:", toolCall);
        // Accumulate tool call parts
        if (toolCall.id) {
          if (!currentToolCall.id) {
            currentToolCall.id = toolCall.id;
          }
        }

        // Accumulate function name
        if (toolCall.function?.name) {
          if (!currentToolCall.function) {
            currentToolCall.function = {
              name: toolCall.function.name,
              arguments: "",
            } satisfies ToolCall["function"];
          }
        }

        // Accumulate arguments
        if (toolCall.function?.arguments) {
          if (currentToolCall.function?.name) {
            currentToolCall.function = {
              name: currentToolCall.function.name,
              arguments:
                (currentToolCall.function.arguments || "") +
                toolCall.function.arguments,
            };
          }
        }

        // Check if we have a complete tool call
        if (
          currentToolCall.id &&
          currentToolCall.function?.name &&
          currentToolCall.function?.arguments
        ) {
          try {
            // Wait for complete JSON before parsing
            const args = currentToolCall.function.arguments;
            if (!args.endsWith("}")) {
              continue; // Wait for more chunks if JSON is incomplete
            }

            // Try to parse the arguments
            let functionArgs;
            try {
              functionArgs = JSON.parse(currentToolCall.function.arguments);
            } catch (parseError) {
              console.error("JSON parse error:", parseError);
              console.log(
                "Incomplete JSON:",
                currentToolCall.function.arguments
              );
              continue; // Wait for more chunks if JSON is invalid
            }

            const functionName = currentToolCall.function.name;

            // Only execute if we haven't already
            if (!hasExecutedFunction) {
              hasExecutedFunction = true;
              sendEvent("function_call", {
                name: functionName,
              });

              await new Promise((resolve) => setTimeout(resolve, 3000));

              sendEvent("function_executing", {
                name: functionName,
                args: functionArgs,
              });

              await new Promise((resolve) => setTimeout(resolve, 3000));

              const functionResponse =
                await functions[functionName as keyof typeof functions](
                  functionArgs
                );

              // Add function response to the overall response message
              responseMessage = functionResponse;

              // Parse the response
              const parseResponse = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                  {
                    role: "system",
                    content: `Parse the following response and return a JSON object.
                    For weather responses, include: location, temperature (number), unit (celsius/fahrenheit), description, feelsLike (number), humidity (number).
                    For time responses, include: city (string), timezone (string), time (string), date (string).
                    For compliance responses, include: results array with objects containing id, shortName, longName, briefDescription, regions[], industries[], status.
                    Return only the JSON object, no other text.
                    
                    Example time response:
                    {
                      "city": "New York",
                      "timezone": "America/New_York",
                      "time": "2:30 PM",
                      "date": "Thursday, March 14, 2024"
                    }`,
                  },
                  {
                    role: "user",
                    content: functionResponse,
                  },
                ],
                response_format: { type: "json_object" },
              });

              const parsedData = JSON.parse(
                parseResponse.choices[0].message.content || "{}"
              );
              const displayData = {
                type:
                  functionName === "getCurrentWeather"
                    ? "weather"
                    : functionName === "getCurrentTime"
                      ? "time"
                      : "compliance",
                data: parsedData,
              };
              display = displayData;
              sendEvent("function_result", {
                message: functionResponse,
                display: displayData,
              });
            }
          } catch (error) {
            // Only send error if we haven't executed successfully
            if (!hasExecutedFunction) {
              console.error("Function execution error:", error);
              sendEvent("error", {
                message: "Failed to execute function",
              });
            }
          }
        }
      }
    }

    // After processing, save assistant's response
    try {
      if (responseMessage) {
        console.log("Saving assistant response:", {
          role: "assistant",
          contentLength: responseMessage.length,
          hasDisplay: !!display,
        });

        await ChatService.addMessage(chatId, {
          role: "assistant",
          content: responseMessage,
          display: display,
        });

        // Periodically summarize old messages
        await ChatService.summarizeOldMessages(chatId);
      } else {
        console.warn("No response message to save");
      }
    } catch (error) {
      console.error("Failed to save assistant response:", error);
      sendEvent("error", { message: "Failed to save response" });
    }

    sendEvent("done", {});
    res.end();
  } catch (error) {
    console.error("Error in chat processing:", error);
    if (chatId) {
      try {
        // Try to save error message
        await ChatService.addMessage(chatId, {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          error: true,
        });
      } catch (saveError) {
        console.error("Failed to save error message:", saveError);
      }
    }
    sendEvent("error", { message: "Failed to process request" });
    res.end();
  }
});

export default router;
