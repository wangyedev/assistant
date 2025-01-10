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

  sendMessage: async (req: Request<{}, {}, MessageRequest>, res: Response) => {
    try {
      const { threadId, message } = req.body;

      // Add message to thread
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: req.body.assistantId
      });

      // Wait for the run to complete
      let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      
      while (runStatus.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      }

      // Get messages
      const messages = await openai.beta.threads.messages.list(threadId);
      
      res.json(messages.data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getMessages: async (req: Request, res: Response) => {
    try {
      const { threadId } = req.params;
      const messages = await openai.beta.threads.messages.list(threadId);
      res.json(messages.data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
};

export default assistantController; 