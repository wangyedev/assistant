import { IMessage } from "@/types/chat";
import { Message } from "./message";

interface MessageListProps {
  messages: IMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
    </div>
  );
}
