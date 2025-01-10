"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessages } from "@/components/ChatMessages";
import { Message } from "@/types/chat";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ChatPageProps {
  params: Promise<{
    threadId: string;
  }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { threadId } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assistantId, setAssistantId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Get assistantId from localStorage when component mounts
    const storedAssistantId = localStorage.getItem(
      `thread_${threadId}_assistant`
    );
    if (storedAssistantId) {
      setAssistantId(storedAssistantId);
    }
    fetchMessages();
  }, [threadId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/assistant/messages/${threadId}`
      );
      const data = await response.json();
      setMessages(
        data.map((msg: any) => ({
          role: msg.role,
          content: msg.content[0].text.value,
          timestamp: new Date(msg.created_at * 1000).toISOString(),
        }))
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);

      const userMessage: Message = {
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      const response = await fetch(
        "http://localhost:3001/api/assistant/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            threadId,
            assistantId,
            message: content,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      const assistantMessages = data.map((msg: any) => ({
        role: msg.role,
        content: msg.content[0].text.value,
        timestamp: new Date(msg.created_at * 1000).toISOString(),
      }));

      setMessages((prev) => [
        ...prev,
        ...assistantMessages.filter((msg: Message) => msg.role === "assistant"),
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <Card className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col">
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </Card>
    </div>
  );
}
