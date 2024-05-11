"use client";

import type { PropsWithChildren, ReactElement } from "react";
import { useEffect, useState } from "react";
import type { Component } from "./utils/component";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useProjectStore } from "@/store/project.store";

type PageLayoutProps = {
  projectId?: string;
} & PropsWithChildren;

export const PageLayout: Component<PageLayoutProps> = ({ projectId, children }): ReactElement => {
  const [isLogged, setIsLogged] = useState(true);
  const [isAllowed, setIsAllowed] = useState(true);
  const [loading, setLoading] = useState(true);
  const { active, setActive } = useProjectStore();

  useEffect(() => {
    setLoading(true);
    if (projectId) {
      if (active?.id !== projectId) setActive(projectId);
    }

    const fetchIsLogged = async(): Promise<void> => {
      const response = await fetch("/auth/is-logged");
      const schema = z.object({ isLogged: z.boolean() }).safeParse(await response.json());

      if (!schema.success) {
        console.error(schema.error);
        setIsLogged(false);
        return;
      }

      setIsLogged(schema.data.isLogged);
      if (!projectId) setLoading(false);
    };

    const fetchIsAllowed = async(): Promise<void> => {
      const response = await fetch(`/auth/is-allowed?projectId=${projectId}`);
      const schema = z.object({ isAllowed: z.boolean() }).safeParse(await response.json());

      if (!schema.success) {
        console.error(schema.error);
        setIsAllowed(false);
        return;
      }

      setIsAllowed(schema.data.isAllowed);
      setLoading(false);
    };

    void fetchIsLogged();
    if (projectId) void fetchIsAllowed();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 size={48} className="text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!isLogged) return <div>Not logged in</div>;
  if (!isAllowed) return <div>This page or project does not exist</div>;

  return (
    <div className="p-3">
      <div className="sm:p-4 p-0">
        {children}
      </div>
    </div>
  );
};