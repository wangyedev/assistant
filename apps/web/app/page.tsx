import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1>Welcome to the Assistant</h1>
      <Button>
        <Link href="/assistant">Go to Assistant</Link>
      </Button>
    </div>
  );
}
