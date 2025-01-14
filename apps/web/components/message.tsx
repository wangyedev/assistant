import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Icons } from "@/components/ui/icons";
import { WeatherCard, TimeCard } from "@/components/ui/response-cards";

interface MessageProps {
  role: "user" | "assistant" | "function";
  content: string;
  name?: string;
  display?: {
    type: "weather" | "time";
    data: any;
  };
}

export function Message({ role, content, name, display }: MessageProps) {
  return (
    <div
      className={cn("flex gap-3", {
        "justify-end": role === "user",
      })}
    >
      {role !== "user" && (
        <Avatar>
          <Icons.bot className="h-5 w-5" />
        </Avatar>
      )}

      <div className="flex flex-col gap-3 max-w-[80%]">
        {display && (
          <>
            {display.type === "weather" && <WeatherCard {...display.data} />}
            {display.type === "time" && <TimeCard {...display.data} />}
          </>
        )}

        <Card
          className={cn("px-4 py-3", {
            "bg-primary text-primary-foreground": role === "user",
            "bg-muted": role === "function",
          })}
        >
          {name && (
            <div className="text-xs text-muted-foreground mb-2">
              Function: {name}
            </div>
          )}
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </Card>
      </div>

      {role === "user" && (
        <Avatar>
          <Icons.user className="h-5 w-5" />
        </Avatar>
      )}
    </div>
  );
}
