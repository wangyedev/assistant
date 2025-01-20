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

// Helper function to handle SSE events
const createEventHandler = (res: express.Response) => {
  return (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };
};

// Helper function to process tool calls
const processToolCall = async (
  toolCall: any,
  currentToolCall: Partial<ToolCall>,
  hasExecutedFunction: boolean,
  sendEvent: (event: string, data: any) => void
): Promise<{ responseMessage: string; display: any } | null> => {
  if (!toolCall || hasExecutedFunction) return null;

  // Accumulate tool call parts
  if (toolCall.id && !currentToolCall.id) {
    currentToolCall.id = toolCall.id;
  }

  if (toolCall.function?.name && !currentToolCall.function) {
    currentToolCall.function = {
      name: toolCall.function.name,
      arguments: "",
    };
  }

  if (toolCall.function?.arguments && currentToolCall.function?.name) {
    currentToolCall.function = {
      name: currentToolCall.function.name,
      arguments:
        (currentToolCall.function.arguments || "") +
        toolCall.function.arguments,
    };
  }

  // Check if tool call is complete
  if (
    !currentToolCall.id ||
    !currentToolCall.function?.name ||
    !currentToolCall.function?.arguments
  ) {
    return null;
  }

  // Validate JSON
  const args = currentToolCall.function.arguments;
  if (!args.endsWith("}")) return null;

  try {
    const functionArgs = JSON.parse(args);
    const functionName = currentToolCall.function.name;

    sendEvent("function_call", { name: functionName });
    await new Promise((resolve) => setTimeout(resolve, 3000));

    sendEvent("function_executing", { name: functionName, args: functionArgs });
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const functionResponse =
      await functions[functionName as keyof typeof functions](functionArgs);
    const displayData = await parseAndFormatResponse(
      functionResponse,
      functionName
    );

    sendEvent("function_result", {
      message: functionResponse,
      display: displayData,
    });

    return {
      responseMessage: functionResponse,
      display: displayData,
    };
  } catch (error) {
    console.error("Function execution error:", error);
    sendEvent("error", { message: "Failed to execute function" });
    return null;
  }
};

// Helper function to parse and format function responses
const parseAndFormatResponse = async (
  functionResponse: string,
  functionName: string
) => {
  const parseResponse = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Parse the following response and return a JSON object.
        For weather responses, include: location, temperature (number), unit (celsius/fahrenheit), description, feelsLike (number), humidity (number).
        For time responses, include: city (string), timezone (string), time (string), date (string).
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
  return {
    type:
      functionName === "getCurrentWeather"
        ? "weather"
        : functionName === "getCurrentTime"
          ? "time"
          : "compliance",
    data: parsedData,
  };
};

// Main chat route handler
router.post("/chat", async (req, res) => {
  const sendEvent = createEventHandler(res);
  const { message, userId, chatId } = req.body;

  try {
    // Set up SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Initialize chat context
    const recentMessages = await ChatService.getRecentContext(userId);
    sendEvent("thinking", { content: "Analyzing your request..." });

    // Create OpenAI completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant specializing in compliance information and general queries...`,
        },
        ...(recentMessages.map((msg) => ({
          role: msg.role === "function" ? "assistant" : msg.role,
          content: msg.content,
          ...(msg.name && msg.role === "function" ? { name: msg.name } : {}),
        })) as OpenAI.Chat.Completions.ChatCompletionMessageParam[]),
        { role: "user", content: message },
      ],
      tools: availableFunctions.map((fn) => ({
        type: "function" as const,
        function: fn,
      })),
      tool_choice: "auto",
      stream: true,
    });

    // Save user message
    await ChatService.addMessage(chatId, { role: "user", content: message });

    // Process the completion stream
    let currentToolCall: Partial<ToolCall> = {};
    let hasExecutedFunction = false;
    let responseMessage = "";
    let display: any;

    for await (const chunk of completion) {
      // Handle content chunks
      if (chunk.choices[0]?.delta?.content) {
        const content = chunk.choices[0].delta.content;
        responseMessage += content;
        sendEvent("content", { content });
      }

      // Handle tool calls
      const toolCall = chunk.choices[0]?.delta?.tool_calls?.[0];
      const result = await processToolCall(
        toolCall,
        currentToolCall,
        hasExecutedFunction,
        sendEvent
      );
      if (result) {
        responseMessage = result.responseMessage;
        display = result.display;
        hasExecutedFunction = true;
      }
    }

    // Save assistant's response
    if (responseMessage) {
      await ChatService.addMessage(chatId, {
        role: "assistant",
        content: responseMessage,
        display,
      });
      await ChatService.summarizeOldMessages(chatId);
    }

    sendEvent("done", {});
    res.end();
  } catch (error) {
    console.error("Error in chat processing:", error);
    if (chatId) {
      await ChatService.addMessage(chatId, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        error: true,
      }).catch((err) => console.error("Failed to save error message:", err));
    }
    sendEvent("error", { message: "Failed to process request" });
    res.end();
  }
});

export default router;
