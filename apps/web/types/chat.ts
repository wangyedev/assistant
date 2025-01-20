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
  formStatus?: "submitted" | "pending";
}

export interface ChatPreview {
  _id: string;
  preview: {
    title: string;
    lastMessage: {
      content: string;
      role: "user" | "assistant" | "function";
      timestamp: Date;
      displayType?: "weather" | "time" | "compliance";
    };
    messageCount: number;
    category?: string;
  };
  updatedAt: string;
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
