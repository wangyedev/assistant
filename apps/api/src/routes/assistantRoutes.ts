import express from "express";
import OpenAI from "openai";
import { config } from "../config";
import { availableFunctions, functions } from "../functions";

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

  try {
    const { message } = req.body;

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Start thinking
    sendEvent("thinking", { content: "Analyzing your request..." });
    await new Promise((resolve) => setTimeout(resolve, 3000));

    let currentToolCall: Partial<ToolCall> = {};
    let hasExecutedFunction = false;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant specializing in compliance information and general queries.

            For compliance queries:
            - Use the searchCompliance function to find relevant standards
            - Consider industry-specific requirements
            - Match regional regulations
            - Provide clear, structured responses

            For weather and time queries:
            - Use getCurrentWeather for weather information
            - Use getCurrentTime for timezone information
            - Return responses in the appropriate format

            Format all responses in clear markdown with:
            - Bullet points for key information
            - Headers for different sections
            - Brief summaries followed by details
            - Relevant links when available`,
        },
        { role: "user", content: message },
      ],
      tools: [
        ...availableFunctions.map((fn) => ({
          type: "function" as const,
          function: fn,
        })),
      ],
      tool_choice: "auto",
      stream: true,
    });

    for await (const chunk of completion) {
      if (chunk.choices[0]?.delta?.content) {
        sendEvent("content", { content: chunk.choices[0].delta.content });
      }

      const toolCall = chunk.choices[0]?.delta?.tool_calls?.[0];
      if (toolCall && !hasExecutedFunction) {
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
            // Try to parse the arguments to verify they're complete
            const functionArgs = JSON.parse(currentToolCall.function.arguments);
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

              // Parse the response
              const parseResponse = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                  {
                    role: "system",
                    content: `Parse the following response and return a JSON object.
                    For weather responses, include: location, temperature (number), unit (celsius/fahrenheit), description, feelsLike (number), humidity (number).
                    For time responses, include: timezone, time, date.
                    For compliance responses, include: results array with objects containing id, shortName, longName, briefDescription, regions[], industries[], status.
                    Return only the JSON object, no other text.`,
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
              sendEvent("function_result", {
                message: functionResponse,
                display: {
                  type:
                    functionName === "getCurrentWeather"
                      ? "weather"
                      : functionName === "getCurrentTime"
                        ? "time"
                        : "compliance",
                  data: parsedData,
                },
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

    // End the stream
    sendEvent("done", {});
    res.end();
  } catch (error) {
    console.error("Error:", error);
    sendEvent("error", { message: "Failed to process request" });
    res.end();
  }
});

export default router;
