import { Message } from '@/types/chat';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === 'assistant' ? '' : 'justify-end'}`}
        >
          <div
            className={`max-w-[70%] p-4 rounded-xl relative
              ${message.role === 'assistant' 
                ? 'bg-gray-200 dark:bg-gray-700 rounded-tl-none' 
                : 'bg-blue-500 text-white rounded-tr-none'
              }`}
          >
            <span 
              className={`absolute -top-5 text-sm text-gray-500 dark:text-gray-400
                ${message.role === 'assistant' ? 'left-0' : 'right-0'}`}
            >
              {message.role}
            </span>
            <p className="break-words">{message.content}</p>
            <span className="block text-xs mt-2 opacity-70">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex">
          <div className="max-w-[70%] p-4 rounded-xl rounded-tl-none bg-gray-200 dark:bg-gray-700 relative">
            <span className="absolute -top-5 left-0 text-sm text-gray-500 dark:text-gray-400">
              assistant
            </span>
            <p>Thinking...</p>
          </div>
        </div>
      )}
    </div>
  );
} 