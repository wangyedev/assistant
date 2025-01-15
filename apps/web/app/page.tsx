"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChatService } from "@/services/chatService";
import { ChatList } from "@/components/chat-list";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert } from "@/components/ui/alert";

interface ChatPreview {
  _id: string;
  lastMessage?: string;
  updatedAt: string;
  metadata?: {
    title?: string;
  };
}

export default function HomePage() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const chats = await ChatService.getChats();
      setChats(chats);
    } catch (error) {
      setError("Failed to load chats. Please try again later.");
      console.error("Error loading chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    setIsCreatingChat(true);
    try {
      const chatId = await ChatService.createChat("default-user");
      router.push(`/assistant/${chatId}`);
    } catch (error) {
      setError("Failed to create new chat. Please try again.");
      console.error("Error creating chat:", error);
      setIsCreatingChat(false);
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
    <div className="min-h-screen p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Chats</h1>
        <Button onClick={handleNewChat} disabled={isCreatingChat}>
          {isCreatingChat ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Creating...</span>
            </>
          ) : (
            "New Chat"
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="my-4">
          {error}
        </Alert>
      )}

      {chats.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No chats yet. Start a new conversation!
          </p>
        </div>
      ) : (
        <ChatList
          chats={chats}
          onSelect={(chatId) => router.push(`/assistant/${chatId}`)}
        />
      )}
    </div>
  );
}
