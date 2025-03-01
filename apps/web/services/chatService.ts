import { IMessage, ChatPreview } from "@/types/chat";

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

  static async getChats(): Promise<ChatPreview[]> {
    try {
      const response = await fetch(`${this.API_URL}/api/chat`);

      if (!response.ok) {
        throw new Error(`Failed to fetch chats: ${response.statusText}`);
      }

      const data = await response.json();
      return data.chats;
    } catch (error) {
      console.error("Error fetching chats:", error);
      throw error;
    }
  }

  static async getChat(
    chatId: string
  ): Promise<{ messages: IMessage[]; userId: string }> {
    try {
      const response = await fetch(`${this.API_URL}/api/chat/${chatId}`);

      if (response.status === 404) {
        throw new Error("Chat not found");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch chat: ${response.statusText}`);
      }

      const data = await response.json();
      return data.chat;
    } catch (error) {
      console.error("Error fetching chat:", error);
      throw error;
    }
  }

  static async addMessage(
    chatId: string,
    message: IMessage
  ): Promise<{ messages: IMessage[]; userId: string }> {
    try {
      const response = await fetch(
        `${this.API_URL}/api/chat/${chatId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add message: ${response.statusText}`);
      }

      const data = await response.json();
      return data.chat;
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  }

  static async deleteChat(chatId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/api/chat/${chatId}`, {
        method: "DELETE",
      }).catch((error) => {
        if (!window.navigator.onLine) {
          throw new Error(
            "You are offline. Please check your internet connection."
          );
        }
        throw error;
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Chat not found");
        }
        throw new Error(`Failed to delete chat: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      throw error;
    }
  }
}
