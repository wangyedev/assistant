import express from 'express'
import OpenAI from 'openai'
import { config } from '../config'
import { availableFunctions, functions } from '../functions'

const router = express.Router()
const openai = new OpenAI({ apiKey: config.openAiApiKey })

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that provides information with specialized UI components when appropriate.
          For weather information, return a JSON response with type: "weather" and include location, temperature, unit, and description.
          For time information, return a JSON response with type: "time" and include timezone, time, and date.
          For other responses, provide clear markdown-formatted text.`
        },
        { role: "user", content: message }
      ],
      tools: availableFunctions.map(fn => ({ type: "function", function: fn })),
      tool_choice: "auto",
    })

    const responseMessage = completion.choices[0].message

    if (responseMessage.tool_calls) {
      const functionCall = responseMessage.tool_calls[0]
      const functionName = functionCall.function.name
      const functionArgs = JSON.parse(functionCall.function.arguments)
      
      const functionResponse = await functions[functionName as keyof typeof functions](
        functionArgs
      )

      // Parse function response to create appropriate display object
      let display
      if (functionName === "getCurrentWeather") {
        const match = functionResponse.match(/(\d+)°([CF])/);
        if (!match) throw new Error("Invalid weather response format");
        const [_, temp, unit] = match;
        display = {
          type: "weather",
          data: {
            location: functionArgs.location,
            temperature: parseInt(temp),
            unit: unit === "C" ? "celsius" : "fahrenheit",
            description: functionResponse
          }
        };
      } else if (functionName === "getCurrentTime") {
        const time = new Date();
        display = {
          type: "time",
          data: {
            timezone: functionArgs.timezone,
            time: time.toLocaleTimeString("en-US", { timeZone: functionArgs.timezone }),
            date: time.toLocaleDateString("en-US", { timeZone: functionArgs.timezone })
          }
        };
      }

      res.json({ 
        message: functionResponse,
        display 
      });
    } else {
      res.json({ 
        message: responseMessage.content,
        display: null
      });
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Failed to process request' })
  }
})

export default router 