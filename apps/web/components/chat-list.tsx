import { Icons } from "@/components/ui/icons";
import { formatDistanceToNow } from "date-fns";
import { ChatPreview } from "@/types/chat";

interface ChatListProps {
  chats: ChatPreview[];
  onSelect: (chatId: string) => void;
}

export function ChatList({ chats, onSelect }: ChatListProps) {
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
      {chats.map((chat) => (
        <button
          key={chat._id}
          onClick={() => onSelect(chat._id)}
          className="w-full p-4 text-left bg-white hover:bg-gray-50 rounded-lg border transition-colors duration-200"
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
          </div>
        </button>
      ))}
    </div>
  );
}
