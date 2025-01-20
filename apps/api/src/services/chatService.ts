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
    console.log("Adding message to chat:", chatId, message);
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
    return this.filterMessages(messages.slice(-this.MAX_CONTEXT_MESSAGES));
  }

  private static filterMessages(messages: IMessage[]): IMessage[] {
    return messages.filter((message, index) => {
      // Keep the message if it's not a compliance type
      if (!message.display || message.display.type !== "compliance") {
        return true;
      }

      // Check if the next message is a compliance submission
      const nextMessage = messages[index + 1];
      console.log("Next message:", nextMessage);
      return !(
        nextMessage?.display?.type === "compliance" &&
        nextMessage?.name === "submitComplianceRequest"
      );
    });
  }

  static async getChat(
    chatId: string
  ): Promise<{ messages: IMessage[]; userId: string }> {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    return {
      userId: chat.userId,
      messages: this.filterMessages(chat.messages),
    };
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
