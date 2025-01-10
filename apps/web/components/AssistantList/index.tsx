"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThreadDialog } from "@/components/ThreadDialog";
import { useRouter } from "next/navigation";

interface Assistant {
  id: string;
  name: string;
  model: string;
  created_at: number;
}

export function AssistantList() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/assistant/list");
      const data = await response.json();
      setAssistants(data);
    } catch (error) {
      console.error("Error fetching assistants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleThreadCreated = (threadId: string) => {
    console.log("New thread created:", threadId);
    router.push(`/assistant/${threadId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assistants</CardTitle>
        </CardHeader>
        <CardContent>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 mb-2" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Assistants</CardTitle>
        <Button variant="outline" onClick={fetchAssistants}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assistants.map((assistant) => (
              <TableRow key={assistant.id}>
                <TableCell>{assistant.id}</TableCell>
                <TableCell>{assistant.name}</TableCell>
                <TableCell>{assistant.model}</TableCell>
                <TableCell>
                  {new Date(assistant.created_at * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <ThreadDialog
                    assistantId={assistant.id}
                    onThreadCreated={handleThreadCreated}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
