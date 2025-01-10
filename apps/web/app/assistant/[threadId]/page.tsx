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

      // Create a new message for the assistant's response
      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      const eventSource = new EventSource(
        `http://localhost:3001/api/assistant/message?threadId=${threadId}&assistantId=${assistantId}&message=${encodeURIComponent(content)}`
      );

      eventSource.onmessage = (event) => {
        console.log("Received message:", event);
      };

      eventSource.addEventListener("textCreated", (event) => {
        console.log("Assistant started typing");
      });

      eventSource.addEventListener("textDelta", (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === "assistant") {
            lastMessage.content += data.delta || "";
          }
          return newMessages;
        });
      });

      eventSource.addEventListener("toolCallCreated", (event) => {
        const data = JSON.parse(event.data);
        console.log("Tool call created:", data);
      });

      eventSource.addEventListener("toolCallDelta", (event) => {
        const data = JSON.parse(event.data);
        console.log("Tool call delta:", data);
      });

      eventSource.addEventListener("end", (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        // Just replace the last message with the final version
        setMessages((prev) => {
          const withoutLast = prev.slice(0, -1);
          const lastMessage = data
            .filter((msg: any) => msg.role === "assistant")
            .slice(-1)[0];

          return [
            ...withoutLast,
            {
              role: lastMessage.role,
              content: lastMessage.content[0].text.value,
              timestamp: new Date(lastMessage.created_at * 1000).toISOString(),
            },
          ];
        });
        eventSource.close();
        setIsLoading(false);
      });

      eventSource.addEventListener("error", (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        console.error("Error:", data.error);
        toast({
          title: "Error",
          description: data.error || "Failed to send message",
          variant: "destructive",
        });
        eventSource.close();
        setIsLoading(false);
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
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
