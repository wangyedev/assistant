"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ThreadDialogProps {
  assistantId: string;
  onThreadCreated: (threadId: string) => void;
}

export function ThreadDialog({
  assistantId,
  onThreadCreated,
}: ThreadDialogProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateThread = async () => {
    try {
      setIsLoading(true);

      // Create thread
      const threadResponse = await fetch(
        "http://localhost:3001/api/assistant/thread",
        {
          method: "POST",
        }
      );
      const threadData = await threadResponse.json();

      // Store assistantId in localStorage
      localStorage.setItem(`thread_${threadData.id}_assistant`, assistantId);

      // Send initial message
      const messageResponse = await fetch(
        "http://localhost:3001/api/assistant/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            threadId: threadData.id,
            assistantId,
            message,
          }),
        }
      );

      if (!messageResponse.ok) throw new Error("Failed to send message");

      toast({
        title: "Thread created",
        description: "New conversation started successfully",
      });

      onThreadCreated(threadData.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create thread",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Chat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Type your first message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            onClick={handleCreateThread}
            disabled={!message.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? "Creating..." : "Start Chat"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
