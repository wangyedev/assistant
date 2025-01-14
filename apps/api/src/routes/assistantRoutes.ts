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
      messages: [{ role: "user", content: message }],
      tools: availableFunctions.map(fn => ({ type: "function", function: fn })),
      tool_choice: "auto",
    })

    const responseMessage = completion.choices[0].message

    // Check if the model wants to call a function
    if (responseMessage.tool_calls) {
      const functionCall = responseMessage.tool_calls[0]
      const functionName = functionCall.function.name
      const functionArgs = JSON.parse(functionCall.function.arguments)
      
      const functionResponse = await functions[functionName as keyof typeof functions](
        functionArgs
      )

      const secondResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
          { role: "user", content: message },
          responseMessage,
          {
            role: "tool",
            content: functionResponse,
            tool_call_id: functionCall.id
          },
        ],
      })

      res.json({ message: secondResponse.choices[0].message.content })
    } else {
      res.json({ message: responseMessage.content })
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Failed to process request' })
  }
})

export default router 