import express from "express";
import { z } from "zod";
import { Chat } from "../models/chat";
import { validateRequest } from "../middleware/validateRequest";

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
      const chat = new Chat({
        userId,
        messages: [],
        metadata: metadata || {},
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

    const chatPreviews = chats.map((chat) => ({
      _id: chat._id,
      lastMessage: chat.messages[chat.messages.length - 1]?.content,
      updatedAt: chat.updatedAt,
      metadata: chat.metadata,
    }));

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

export default router;
