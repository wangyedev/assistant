import express from "express";
import OpenAI from "openai";
import { config } from "../config";
import { availableFunctions, functions } from "../functions";

const router = express.Router();
const openai = new OpenAI({ apiKey: config.openAiApiKey });

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Set headers for SSE
    res.setHeader("Content-Type", "application/json");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that provides information with specialized UI components when appropriate.
          For weather information, return a JSON response with type: "weather" and include location, temperature, unit, and description.
          For time information, return a JSON response with type: "time" and include timezone, time, and date.
          For other responses, provide clear markdown-formatted text.`,
        },
        { role: "user", content: message },
      ],
      tools: availableFunctions.map((fn) => ({
        type: "function",
        function: fn,
      })),
      tool_choice: "auto",
    });

    const responseMessage = completion.choices[0].message;

    if (responseMessage.tool_calls) {
      // Signal that we're making a function call
      res.setHeader("X-Function-Call", "true");

      const functionCall = responseMessage.tool_calls[0];
      const functionName = functionCall.function.name;
      const functionArgs = JSON.parse(functionCall.function.arguments);

      const functionResponse =
        await functions[functionName as keyof typeof functions](functionArgs);

      // Use LLM to parse the function response
      const parseResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: `Parse the following weather/time information and return a JSON object.
            For weather responses, include: location, temperature (number), unit (celsius/fahrenheit), description, feelsLike (number), humidity (number).
            For time responses, include: timezone, time, date.
            Return only the JSON object, no other text.`,
          },
          {
            role: "user",
            content: functionResponse,
          },
        ],
        response_format: { type: "json_object" },
      });

      try {
        const parsedData = JSON.parse(
          parseResponse.choices[0].message.content || "{}"
        );
        const display = {
          type: functionName === "getCurrentWeather" ? "weather" : "time",
          data: parsedData,
        };

        res.json({
          message: functionResponse,
          display,
        });
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        res.json({
          message: functionResponse,
          display: null,
        });
      }
    } else {
      res.json({
        message: responseMessage.content,
        display: null,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

export default router;
