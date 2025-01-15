"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatService } from "@/services/chatService";
import { IMessage } from "@/types/chat";
import { MessageList } from "@/components/message-list";
import { ChatInput } from "@/components/chat-input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert } from "@/components/ui/alert";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChat = async () => {
      try {
        const chatId = params.chatId as string;
        const chat = await ChatService.getChat(chatId);
        setMessages(chat.messages);
      } catch (error) {
        if (error instanceof Error && error.message === "Chat not found") {
          // Redirect to home if chat doesn't exist
          router.push("/");
        } else {
          setError("Failed to load chat. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadChat();
  }, [params.chatId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
      </div>
      <div className="p-4 border-t">
        <ChatInput
          onSubmit={async (input: string) => {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/assistant/chat`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    message: input,
                    userId: "default-user", // TODO: Replace with actual user ID
                    chatId: params.chatId,
                  }),
                }
              );

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const reader = response.body?.getReader();
              if (!reader) throw new Error("No reader available");

              let currentAssistantMessage = "";

              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = new TextDecoder().decode(value);
                const lines = chunk.split("\n");

                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    try {
                      const data = JSON.parse(line.slice(5));

                      if (data.error) {
                        throw new Error(data.error.message);
                      }

                      switch (data.event) {
                        case "thinking":
                          setMessages((prev) => [
                            ...prev,
                            {
                              role: "assistant",
                              content: "Thinking...",
                              isLoading: true,
                            },
                          ]);
                          break;

                        case "content":
                          currentAssistantMessage += data.content;
                          setMessages((prev) => [
                            ...prev.slice(0, -1),
                            {
                              role: "assistant",
                              content: currentAssistantMessage,
                            },
                          ]);
                          break;

                        case "function_result":
                          setMessages((prev) => [
                            ...prev,
                            {
                              role: "assistant",
                              content: data.message,
                              display: data.display,
                            },
                          ]);
                          break;
                      }
                    } catch (e) {
                      console.error("Error parsing SSE data:", e);
                    }
                  }
                }
              }
            } catch (error) {
              console.error("Chat error:", error);
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "Sorry, I encountered an error. Please try again.",
                  error: true,
                },
              ]);
            }
          }}
        />
      </div>
    </div>
  );
}
