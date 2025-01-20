import openai from "../config/openai";
import { IMessage } from "../models/chat";
import { ChatCompletionMessageParam } from "openai/resources/chat";

export async function generateTitle(messages: IMessage[]): Promise<string> {
  try {
    const formattedMessages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "Generate a concise, descriptive title (max 6 words) for this chat conversation. Focus on the main topic or question being discussed.",
      },
      ...messages.map((msg) => ({
        role: msg.role === "function" ? "assistant" : msg.role,
        content: msg.content,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: formattedMessages,
      max_tokens: 20,
      temperature: 0.7,
    });

    const title = response.choices[0]?.message?.content?.trim() || "New Chat";
    return title;
  } catch (error) {
    console.error("Error generating title:", error);
    return "New Chat";
  }
}
