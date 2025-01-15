import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  role: "user" | "assistant" | "function";
  content: string;
  name?: string;
  display?: {
    type: "weather" | "time" | "compliance";
    data: any;
  };
}

export interface IChat extends Document {
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

const MessageSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", "assistant", "function"],
    },
    content: {
      type: String,
      required: true,
    },
    name: String,
    display: {
      type: {
        type: String,
        enum: ["weather", "time", "compliance"],
      },
      data: Schema.Types.Mixed,
    },
  },
  { _id: false }
);

const ChatSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [MessageSchema],
    metadata: {
      title: String,
      summary: String,
      tags: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ChatSchema.index({ createdAt: -1 });
ChatSchema.index({ "metadata.tags": 1 });

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
