import mongoose from "mongoose";
import { config } from "../config";
import { Chat, IChat } from "../models/chat";

async function migrateChatPreviews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    console.log("Connected to MongoDB");

    // Get all chats without preview field
    const chats = await Chat.find({ preview: { $exists: false } });
    console.log(`Found ${chats.length} chats to migrate`);

    let migratedCount = 0;
    let errorCount = 0;

    for (const chat of chats) {
      try {
        const messages = chat.messages;
        const lastMessage = messages[messages.length - 1];

        // Create preview data
        const preview = {
          title: chat.metadata?.title || "Untitled Chat",
          lastMessage: lastMessage
            ? {
                content: lastMessage.content.slice(0, 280),
                role: lastMessage.role,
                timestamp: chat.updatedAt,
                displayType: lastMessage.display?.type,
              }
            : undefined,
          messageCount: messages.length,
          category: determineCategory(messages),
        };

        // Update the document
        await Chat.findByIdAndUpdate(chat._id, {
          $set: { preview },
        });

        migratedCount++;
        if (migratedCount % 100 === 0) {
          console.log(`Migrated ${migratedCount} chats`);
        }
      } catch (error) {
        console.error(`Error migrating chat ${chat._id}:`, error);
        errorCount++;
      }
    }

    console.log("\nMigration completed:");
    console.log(`Successfully migrated: ${migratedCount} chats`);
    console.log(`Failed migrations: ${errorCount} chats`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

function determineCategory(messages: IChat["messages"]): string | undefined {
  // Analyze messages to determine a category
  const messageContent = messages
    .map((m) => m.content)
    .join(" ")
    .toLowerCase();

  if (messages.some((m) => m.display?.type === "weather")) {
    return "Weather";
  }
  if (messages.some((m) => m.display?.type === "time")) {
    return "Time";
  }
  if (messages.some((m) => m.display?.type === "compliance")) {
    return "Compliance";
  }

  // Add more category detection logic here
  return undefined;
}

// Add command line argument handling
if (require.main === module) {
  migrateChatPreviews()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}
