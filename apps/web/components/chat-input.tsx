"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSubmit: (input: string) => Promise<void>;
}

export function ChatInput({ onSubmit }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(input);
      setInput("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Type your message..."
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
