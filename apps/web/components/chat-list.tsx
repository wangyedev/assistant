import { Icons } from "@/components/ui/icons";
import { formatDistanceToNow } from "date-fns";
import { ChatPreview } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChatService } from "@/services/chatService";
import { Alert } from "@/components/ui/alert";

interface ChatListProps {
  chats: ChatPreview[];
  onSelect: (chatId: string) => void;
  onDelete?: (chatId: string) => void;
}

export function ChatList({ chats, onSelect, onDelete }: ChatListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    setError(null);
    try {
      setDeletingId(chatId);
      await ChatService.deleteChat(chatId);
      onDelete?.(chatId);
    } catch (error) {
      console.error("Failed to delete chat:", error);
      setError(
        error instanceof Error && error.message === "Failed to fetch"
          ? "Network error: Please check your connection and try again."
          : "Failed to delete chat. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getDisplayIcon = (type?: string) => {
    switch (type) {
      case "weather":
        return <Icons.cloud className="h-4 w-4 text-blue-500" />;
      case "time":
        return <Icons.clock className="h-4 w-4 text-green-500" />;
      case "compliance":
        return <Icons.bot className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => onSelect(chat._id)}
          className={`w-full p-4 text-left bg-white hover:bg-gray-50 rounded-lg border transition-all duration-200 group cursor-pointer ${
            deletingId === chat._id
              ? "opacity-60 scale-[98%] pointer-events-none"
              : ""
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">
                  {chat.preview.title || "Untitled Chat"}
                </h3>
                {chat.preview.lastMessage.displayType && (
                  <div className="flex-shrink-0">
                    {getDisplayIcon(chat.preview.lastMessage.displayType)}
                  </div>
                )}
              </div>

              {chat.preview.lastMessage && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {chat.preview.lastMessage.role === "user"
                      ? "You: "
                      : "AI: "}
                  </span>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.preview.lastMessage.content}
                  </p>
                </div>
              )}

              <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                <span>{formatDistanceToNow(new Date(chat.updatedAt))} ago</span>
                <span>•</span>
                <span>{chat.preview.messageCount} messages</span>
                {chat.preview.category && (
                  <>
                    <span>•</span>
                    <span>{chat.preview.category}</span>
                  </>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleDelete(e, chat._id)}
              className={`transition-all ml-4 ${
                deletingId === chat._id
                  ? "opacity-100 pointer-events-none"
                  : "opacity-0 group-hover:opacity-100"
              }`}
              disabled={deletingId === chat._id}
            >
              {deletingId === chat._id ? (
                <div className="flex items-center gap-2">
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                  <span className="text-gray-600">Deleting...</span>
                </div>
              ) : (
                <span className="text-red-600">Delete</span>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
