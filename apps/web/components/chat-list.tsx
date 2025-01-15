interface ChatPreview {
  _id: string;
  lastMessage?: string;
  updatedAt: string;
  metadata?: {
    title?: string;
  };
}

interface ChatListProps {
  chats: ChatPreview[];
  onSelect: (chatId: string) => void;
}

export function ChatList({ chats, onSelect }: ChatListProps) {
  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <button
          key={chat._id}
          onClick={() => onSelect(chat._id)}
          className="w-full p-4 text-left bg-white hover:bg-gray-50 rounded-lg border transition-colors duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {chat.metadata?.title || "Untitled Chat"}
              </h3>
              {chat.lastMessage && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {chat.lastMessage}
                </p>
              )}
            </div>
            <time className="text-xs text-gray-400">
              {new Date(chat.updatedAt).toLocaleDateString()}
            </time>
          </div>
        </button>
      ))}
    </div>
  );
}
