import { IMessage } from "@/types/chat";

export class ChatService {
  private static readonly API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  static async createChat(userId: string): Promise<string> {
    try {
      const response = await fetch(`${this.API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create chat: ${response.statusText}`);
      }

      const data = await response.json();
      return data.chatId;
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  }

  static async getChat(
    chatId: string
  ): Promise<{ messages: IMessage[]; userId: string }> {
    try {
      const response = await fetch(
        `${this.API_URL}/api/assistant/chats/${chatId}`
      );

      if (response.status === 404) {
        throw new Error("Chat not found");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch chat: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching chat:", error);
      throw error;
    }
  }
}
