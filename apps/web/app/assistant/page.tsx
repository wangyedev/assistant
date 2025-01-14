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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoadingState("thinking");

    try {
      const response = await fetch("http://localhost:3001/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      // Check headers before reading the body
      if (response.headers.get("X-Function-Call")) {
        setLoadingState("calling_function");
      }

      const data = await response.json();
      setLoadingState("processing_response");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          display: data.display,
        },
      ]);
    } catch (error) {
      console.log("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
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
