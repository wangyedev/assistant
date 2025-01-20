"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatService } from "@/services/chatService";
import { IMessage } from "@/types/chat";
import { MessageList } from "@/components/message-list";
import { ChatInput } from "@/components/chat-input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let currentEvent = ""; // Track current event type

  useEffect(() => {
    const loadChat = async () => {
      try {
        const chatId = params.chatId as string;
        const { messages: chatMessages } = await ChatService.getChat(chatId);
        setMessages(chatMessages);
      } catch (error) {
        if (error instanceof Error && error.message === "Chat not found") {
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

  const handleSubmit = async (input: string) => {
    try {
      setMessages((prev) => [...prev, { role: "user", content: input }]);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/assistant/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: input,
            userId: "default-user",
            chatId: params.chatId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let buffer = "";
      let hasReceivedContent = false;
      let errorMessages: string[] = [];

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            if (buffer) {
              const lines = buffer.split("\n");
              lines.forEach((line) => {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith("event: ")) {
                  currentEvent = trimmedLine.slice(7);
                } else if (trimmedLine.startsWith("data: ")) {
                  const data = JSON.parse(trimmedLine.slice(6));
                  handleSSEEvent(
                    currentEvent,
                    data,
                    errorMessages,
                    hasReceivedContent
                  );
                }
              });
            }

            // If we've reached the end without receiving any content and have errors
            if (!hasReceivedContent && errorMessages.length > 0) {
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: `Error: ${errorMessages[errorMessages.length - 1]}`,
                  error: true,
                },
              ]);
            }
            break;
          }

          const chunk = new TextDecoder().decode(value, { stream: true });
          buffer += chunk;

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith("event: ")) {
              currentEvent = trimmedLine.slice(7);
            } else if (trimmedLine.startsWith("data: ")) {
              const data = JSON.parse(trimmedLine.slice(6));
              handleSSEEvent(
                currentEvent,
                data,
                errorMessages,
                hasReceivedContent
              );

              // Mark as received content if we get a successful response
              if (["function_result", "content"].includes(currentEvent)) {
                hasReceivedContent = true;
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
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
  };

  const handleSSEEvent = (
    event: string,
    data: any,
    errorMessages: string[],
    hasReceivedContent: boolean
  ) => {
    switch (event) {
      case "thinking":
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.content || "Thinking...",
            isLoading: true,
          },
        ]);
        break;

      case "error":
        // Store error message but don't display it yet
        errorMessages.push(data.message);
        break;

      case "content":
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];

          // If we have a loading message or no message, start fresh
          if (!lastMessage || lastMessage.isLoading) {
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: data.content,
            };
          } else if (lastMessage.role === "assistant" && !lastMessage.display) {
            // Accumulate content for existing assistant message
            newMessages[newMessages.length - 1] = {
              ...lastMessage,
              content: lastMessage.content + data.content,
            };
          } else {
            // Start a new message if last message has display data
            newMessages.push({
              role: "assistant",
              content: data.content,
            });
          }
          return newMessages;
        });
        break;

      case "function_call":
      case "function_executing":
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.isLoading) {
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: `Fetching ${data.name}...`,
              isLoading: true,
            };
          }
          return newMessages;
        });
        break;

      case "function_result":
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.isLoading) {
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: data.message,
              display: data.display,
            };
          } else {
            newMessages.push({
              role: "assistant",
              content: data.message,
              display: data.display,
            });
          }
          return newMessages;
        });
        break;

      case "done":
        // Only clean up if we had successful content
        if (hasReceivedContent) {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage?.isLoading) {
              newMessages.pop();
            }
            return newMessages;
          });
        }
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            ← Back
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <h1 className="text-lg font-medium text-gray-900">Chat Assistant</h1>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-y-auto px-4">
          {error && (
            <Alert variant="destructive" className="my-4">
              {error}
            </Alert>
          )}
          <div className="py-4">
            <MessageList messages={messages} chatId={params.chatId as string} />
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-white">
        <ChatInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
