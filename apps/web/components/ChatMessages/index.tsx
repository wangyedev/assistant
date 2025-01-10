import { Message } from "@/types/chat";
import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[70%] p-4 rounded-xl relative
              ${
                message.role === "user"
                  ? "bg-blue-500 text-white rounded-tr-none"
                  : "bg-gray-200 dark:bg-gray-700 rounded-tl-none"
              }`}
          >
            <span
              className={`absolute -top-5 text-sm text-gray-500 dark:text-gray-400
                ${message.role === "user" ? "left-0" : "right-0"}`}
            >
              {message.role}
            </span>
            <p className="break-words">{message.content || "Thinking..."}</p>
            <span className="block text-xs mt-2 opacity-70">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}
