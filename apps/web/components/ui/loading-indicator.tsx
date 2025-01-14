import { Icons } from "./icons";
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  message: string;
  className?: string;
}

export function LoadingIndicator({
  message,
  className,
}: LoadingIndicatorProps) {
  return (
    <div
      className={cn("flex items-center gap-3 text-muted-foreground", className)}
    >
      <Icons.spinner className="h-4 w-4 animate-spin" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
