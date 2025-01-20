import { IMessage } from "@/types/chat";
import { Message } from "./message";

interface MessageListProps {
  messages: IMessage[];
  chatId: string;
}

export function MessageList({ messages, chatId }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <Message key={index} {...message} chatId={chatId} />
      ))}
    </div>
  );
}
