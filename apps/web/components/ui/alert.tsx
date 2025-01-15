import { cn } from "@/lib/utils";

interface AlertProps {
  children: React.ReactNode;
  variant?: "default" | "destructive";
  className?: string;
}

export function Alert({
  children,
  variant = "default",
  className,
}: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        variant === "destructive"
          ? "border-red-200 bg-red-50 text-red-900"
          : "border-gray-200 bg-gray-50 text-gray-900",
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
}
