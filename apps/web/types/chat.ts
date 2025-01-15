export interface IMessage {
  role: "user" | "assistant" | "function";
  content: string;
  name?: string;
  display?: {
    type: "weather" | "time" | "compliance";
    data: any;
  };
  isLoading?: boolean;
  error?: boolean;
}

export interface IChat {
  _id: string;
  userId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    title?: string;
    summary?: string;
    tags?: string[];
  };
}
