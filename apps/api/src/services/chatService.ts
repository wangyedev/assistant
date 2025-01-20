import { Chat, IMessage } from "../models/chat";
import { generateTitle } from "../functions/generateTitle";

export class ChatService {
  private static readonly MAX_CONTEXT_MESSAGES = 10;

  static async createChat(userId: string): Promise<string> {
    const chat = new Chat({
      userId,
      messages: [],
    });
    await chat.save();
    return chat._id as string;
  }

  static async addMessage(chatId: string, message: IMessage): Promise<void> {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    chat.messages.push(message);

    // Generate title only if it's the first user message and no title exists
    if (
      message.role === "user" &&
      chat.messages.length === 2 &&
      (!chat.metadata?.title || chat.metadata.title === "New Chat")
    ) {
      const title = await generateTitle(chat.messages);
      chat.metadata = {
        ...chat.metadata,
        title,
      };
    }

    await chat.save();
  }

  static async getRecentContext(userId: string): Promise<IMessage[]> {
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 }).limit(1);

    if (!chats.length) return [];

    const messages = chats[0].messages;
    return messages.slice(-this.MAX_CONTEXT_MESSAGES);
  }

  static async summarizeOldMessages(chatId: string): Promise<void> {
    const chat = await Chat.findById(chatId);
    if (!chat || chat.messages.length <= this.MAX_CONTEXT_MESSAGES) return;

    // Get messages to summarize
    const messagesToSummarize = chat.messages.slice(
      0,
      -this.MAX_CONTEXT_MESSAGES
    );

    // Create a summary using OpenAI
    const summary = await this.generateSummary(messagesToSummarize);

    // Update chat with summary and truncated messages
    await Chat.findByIdAndUpdate(chatId, {
      $set: {
        "metadata.summary": summary,
        messages: chat.messages.slice(-this.MAX_CONTEXT_MESSAGES),
      },
    });
  }

  private static async generateSummary(messages: IMessage[]): Promise<string> {
    // Implementation of OpenAI summary generation
    // This would be similar to your existing OpenAI calls
    return "Summary of previous conversation...";
  }
}
