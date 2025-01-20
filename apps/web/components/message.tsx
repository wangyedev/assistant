import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Icons } from "@/components/ui/icons";
import { WeatherCard, TimeCard, ComplianceCard } from "@/components/ui/cards";
import { RequestComplianceForm } from "@/components/ui/cards/request-compliance-form";
import { ChatService } from "@/services/chatService";

interface MessageProps {
  role: "user" | "assistant" | "function";
  content: string;
  name?: string;
  display?: {
    type: "weather" | "time" | "compliance";
    data: any;
    formStatus?: "submitted" | "pending";
  };
  chatId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function Message({
  role,
  content,
  name,
  display,
  chatId,
}: MessageProps) {
  const [submittedCompliance, setSubmittedCompliance] = useState<any>(null);

  // Initialize form status from props
  useEffect(() => {
    if (display?.type === "compliance" && display.formStatus === "submitted") {
      setSubmittedCompliance(display.data.results[0]);
    }
  }, [display]);

  const handleComplianceRequest = async (data: {
    shortName: string;
    longName: string;
    briefDescription: string;
    region: string;
    industry: string;
  }) => {
    try {
      // Submit compliance request
      const response = await fetch(`${API_URL}/api/compliance/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          status: "pending",
          regions: [data.region],
          industries: [data.industry],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit request");
      }

      const complianceData = {
        id: Date.now().toString(),
        ...data,
        status: "pending",
        regions: [data.region],
        industries: [data.industry],
      };

      // Save chat history with form status
      await ChatService.addMessage(chatId, {
        role: "function",
        content: `Compliance request submitted for ${data.shortName} (${data.longName})`,
        name: "submitComplianceRequest",
        display: {
          type: "compliance",
          data: {
            results: [complianceData],
          },
        },
        formStatus: "submitted",
      });

      setSubmittedCompliance(complianceData);
    } catch (error) {
      console.error("Error submitting compliance request:", error);
      throw error;
    }
  };

  const shouldShowForm =
    display?.type === "compliance" &&
    !submittedCompliance &&
    !display.data.results?.length &&
    display.formStatus !== "submitted";

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
            {display.type === "compliance" && (
              <div className="space-y-4">
                {shouldShowForm ? (
                  <RequestComplianceForm onSubmit={handleComplianceRequest} />
                ) : (
                  <ComplianceCard
                    {...(submittedCompliance || display.data.results[0])}
                  />
                )}
              </div>
            )}
          </>
        )}

        {(name || content) && (
          <Card className={cn("px-4 py-3")}>
            {name && (
              <div className="text-xs text-muted-foreground mb-2">
                Function: {name}
              </div>
            )}
            {content && (
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </Card>
        )}
      </div>

      {role === "user" && (
        <Avatar>
          <Icons.user className="h-5 w-5" />
        </Avatar>
      )}
    </div>
  );
}
