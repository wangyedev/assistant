import { Request, Response } from 'express';
import openai from '../config/openai';

interface MessageRequest {
  threadId: string;
  assistantId: string;
  message: string;
}

const assistantController = {
  createAssistant: async (_req: Request, res: Response) => {
    try {
      const assistant = await openai.beta.assistants.create({
        name: "My First Assistant",
        instructions: "You are a helpful assistant.",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4-turbo-preview"
      });

      res.json(assistant);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  listAssistants: async (_req: Request, res: Response) => {
    try {
      const assistants = await openai.beta.assistants.list({
        limit: 10,
        order: 'desc',
      });
      res.json(assistants.data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  createThread: async (_req: Request, res: Response) => {
    try {
      const thread = await openai.beta.threads.create();
      res.json(thread);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  sendMessage: async (req: Request, res: Response) => {
    try {
      const { threadId, message, assistantId } = req.query as { 
        threadId: string; 
        message: string; 
        assistantId: string 
      };

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Add message to thread
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message
      });

      // Run the assistant with streaming
      const run = openai.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId
      })
        .on('textCreated', () => {
          res.write('event: textCreated\ndata: assistant started typing\n\n');
        })
        .on('textDelta', (textDelta, snapshot) => {
          res.write(`event: textDelta\ndata: ${JSON.stringify({ delta: textDelta.value, snapshot })}\n\n`);
        })
        .on('toolCallCreated', (toolCall) => {
          res.write(`event: toolCallCreated\ndata: ${JSON.stringify(toolCall)}\n\n`);
        })
        .on('toolCallDelta', (toolCallDelta, snapshot) => {
          res.write(`event: toolCallDelta\ndata: ${JSON.stringify({ delta: toolCallDelta, snapshot })}\n\n`);
        })
        .on('end', async () => {
          // Get final messages after stream ends
          const messages = await openai.beta.threads.messages.list(threadId);
          res.write(`event: end\ndata: ${JSON.stringify(messages.data)}\n\n`);
          res.end();
        })
        .on('error', (error) => {
          res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
          res.end();
        });

    } catch (error) {
      res.write(`event: error\ndata: ${JSON.stringify({ error: (error as Error).message })}\n\n`);
      res.end();
    }
  },

  getMessages: async (req: Request, res: Response) => {
    try {
      const { threadId } = req.params;
      const messages = await openai.beta.threads.messages.list(threadId, {
        order: "asc",
      });
      res.json(messages.data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
};

export default assistantController; 