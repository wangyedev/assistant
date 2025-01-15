"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/message";
import { Card } from "@/components/ui/card";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

interface Message {
  role: "user" | "assistant" | "function";
  content: string;
  name?: string;
  display?: {
    type: "weather" | "time";
    data: any;
  };
}

type LoadingState =
  | "thinking"
  | "calling_function"
  | "processing_response"
  | null;

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    await processUserInput(input);
  };

  const processUserInput = async (userInput: string) => {
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setInput("");
    setLoadingState("thinking");
    let currentAssistantMessage = "";

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/assistant/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userInput,
            userId: "default-user", // TODO: Replace with actual user ID
            chatId: "default-chat", // TODO: Replace with actual chat ID
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

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
                    ...prev.slice(0, -1),
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
                    { role: "assistant", content: currentAssistantMessage },
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

                case "error":
                  throw new Error(data.message);

                case "done":
                  setLoadingState(null);
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
    } finally {
      setLoadingState(null);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, i) => (
            <Message key={i} {...message} />
          ))}

          {loadingState && (
            <div className="px-4 py-2">
              {loadingState === "thinking" && (
                <LoadingIndicator message="AI is thinking..." />
              )}
              {loadingState === "calling_function" && (
                <LoadingIndicator message="Fetching data from external service..." />
              )}
              {loadingState === "processing_response" && (
                <LoadingIndicator message="Processing response..." />
              )}
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ask about weather or time in any location..."
              disabled={loadingState !== null}
            />
            <Button type="submit" disabled={loadingState !== null}>
              {loadingState ? "Processing..." : "Send"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
