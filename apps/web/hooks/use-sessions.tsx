"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "@workspace/ui/hooks/use-toast";
import { Session } from "better-auth";
import { useState, useEffect } from "react";

type UseSessions = {
  pending: boolean;
  list: Session[];
};

export const useSessions = (): UseSessions => {
  const [sessions, setSessions] = useState<{
    pending: boolean;
    list: Session[];
  }>({ pending: true, list: [] });

  useEffect(() => {
    const fetchSessions = async () => {
      setSessions({ pending: true, list: [] });

      await authClient.listSessions({
        fetchOptions: {
          onError: (error) => {
            toast({
              title: "Error while fetching sessions",
              description: error.error.message || "An error occurred while fetching your sessions.",
              variant: "destructive",
            });

            setSessions({ pending: false, list: [] });
          },
          onSuccess: (data) => {
            setSessions({ pending: false, list: data.data });
          },
        },
      });
    };

    fetchSessions();
  }, []);

  return sessions;
}
