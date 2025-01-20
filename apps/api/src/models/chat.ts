import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  role: "user" | "assistant" | "function";
  content: string;
  name?: string;
  display?: {
    type: "weather" | "time" | "compliance";
    data: any;
    formStatus: "submitted" | "pending";
  };
  error?: boolean;
  isLoading?: boolean;
}

export interface IChat extends Document {
  userId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
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
      formStatus: {
        type: String,
        enum: ["submitted", "pending"],
      },
    },
    error: Boolean,
    isLoading: Boolean,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const PreviewSchema = new Schema({
  title: {
    type: String,
    default: "Untitled Chat",
  },
  lastMessage: {
    content: {
      type: String,
      maxlength: 280, // Twitter-like preview length
    },
    role: {
      type: String,
      enum: ["user", "assistant", "function"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    displayType: {
      type: String,
      enum: ["weather", "time", "compliance"],
    },
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  category: String,
});

const ChatSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [MessageSchema],
    preview: {
      type: PreviewSchema,
      default: () => ({}),
    },
    metadata: {
      title: String,
      summary: String,
      tags: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
ChatSchema.index({ createdAt: -1 });
ChatSchema.index({ updatedAt: -1 });
ChatSchema.index({ "preview.category": 1 });
ChatSchema.index({ "metadata.tags": 1 });

// Pre-save middleware to update preview
ChatSchema.pre("save", function (next) {
  if (this.isModified("messages")) {
    const messages = this.messages;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage) {
      this.preview = {
        ...this.preview,
        lastMessage: {
          content: lastMessage.content.slice(0, 280),
          role: lastMessage.role,
          timestamp: new Date(),
          displayType: lastMessage.display?.type,
        },
        messageCount: messages.length,
      };

      // Set title from first assistant message if not set
      if (!this.preview.title || this.preview.title === "Untitled Chat") {
        const firstAssistantMessage = messages.find(
          (m) => m.role === "assistant"
        );
        if (firstAssistantMessage) {
          this.preview.title = firstAssistantMessage.content
            .split("\n")[0]
            .slice(0, 50);
        }
      }
    }
  }
  this.updatedAt = new Date();
  next();
});

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
