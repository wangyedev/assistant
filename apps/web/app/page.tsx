import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChatService } from "@/services/chatService";

export default async function Home() {
  const chatId = await ChatService.createChat("default-user");

  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1>Welcome to the Assistant</h1>
      <Button>
        <Link href={`/assistant/${chatId}`}>Go to Assistant</Link>
      </Button>
    </div>
  );
}
