import express from "express";
import { z } from "zod";
import { Chat } from "../models/chat";
import { validateRequest } from "../middleware/validateRequest";
import { generateTitle } from "../functions/generateTitle";
import { ChatService } from "../services/chatService";

const router = express.Router();

// Validation schema for creating a chat
const createChatSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  metadata: z
    .object({
      title: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
});

// Create a new chat
router.post(
  "/",
  validateRequest({ body: createChatSchema }),
  async (req, res) => {
    try {
      const { userId, metadata } = req.body;
      const welcomeMessage = {
        role: "assistant",
        content: "Hello! How can I help you today?",
      };

      const chat = new Chat({
        userId,
        messages: [welcomeMessage],
        metadata: {
          ...metadata,
          title: "New Chat", // Will be updated after first user message
        },
      });
      await chat.save();
      res.status(201).json({ success: true, chatId: chat._id });
    } catch (error) {
      console.error("Error creating chat:", error);
      res.status(500).json({ success: false, error: "Failed to create chat" });
    }
  }
);

// Get all chats
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find()
      .select("metadata updatedAt messages")
      .sort({ updatedAt: -1 })
      .lean();

    const chatPreviews = chats.map((chat) => {
      const lastMessage = chat.messages[chat.messages.length - 1];
      return {
        _id: chat._id,
        preview: {
          title: chat.metadata?.title || "Untitled Chat",
          lastMessage: {
            content: lastMessage?.content || "",
            role: lastMessage?.role || "assistant",
            timestamp: chat.updatedAt,
            displayType: lastMessage?.display?.type,
          },
          messageCount: chat.messages.length,
          category: chat.metadata?.tags?.[0],
        },
        updatedAt: chat.updatedAt,
      };
    });

    res.json({
      success: true,
      chats: chatPreviews,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch chats",
    });
  }
});

// Get chat by ID
router.get("/:chatId", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }
    res.json({ success: true, chat });
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ success: false, error: "Failed to fetch chat" });
  }
});

// Add message to chat
router.post("/:chatId/messages", async (req, res) => {
  try {
    const message = req.body.message;
    await ChatService.addMessage(req.params.chatId, message);

    const chat = await Chat.findById(req.params.chatId);
    res.json({ success: true, chat });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ success: false, error: "Failed to add message" });
  }
});

// Delete chat
router.delete("/:chatId", async (req, res) => {
  try {
    console.log("Deleting chat:", req.params.chatId);
    const chat = await Chat.findByIdAndDelete(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ success: false, error: "Failed to delete chat" });
  }
});

export default router;
