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
          className={`w-full p-4 text-left bg-white hover:bg-gray-50 rounded-lg border transition-all duration-200 group cursor-pointer hover:shadow-sm ${
            deletingId === chat._id
              ? "opacity-60 scale-[98%] pointer-events-none"
              : ""
          }`}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {chat.preview.lastMessage.displayType && (
                  <div
                    className={`p-2 rounded-lg bg-gray-50 flex-shrink-0 ${
                      chat.preview.lastMessage.displayType === "weather"
                        ? "bg-blue-50"
                        : chat.preview.lastMessage.displayType === "time"
                          ? "bg-green-50"
                          : chat.preview.lastMessage.displayType ===
                              "compliance"
                            ? "bg-purple-50"
                            : ""
                    }`}
                  >
                    {getDisplayIcon(chat.preview.lastMessage.displayType)}
                  </div>
                )}
                <h3 className="font-medium truncate text-lg group-hover:text-blue-600 transition-colors">
                  {chat.preview.title || "Untitled Chat"}
                </h3>
              </div>

              {chat.preview.lastMessage && (
                <div className="flex items-start gap-3 mb-3">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-xs font-medium text-gray-600 flex-shrink-0">
                    {chat.preview.lastMessage.role === "user" ? "Y" : "AI"}
                  </span>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {chat.preview.lastMessage.content}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {formatDistanceToNow(new Date(chat.updatedAt))} ago
                </span>
                <span className="text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                  {chat.preview.messageCount} messages
                </span>
                {chat.preview.category && (
                  <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    {chat.preview.category}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleDelete(e, chat._id)}
                className={`transition-all ${
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
        </div>
      ))}
    </div>
  );
}
