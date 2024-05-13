"use client";

import type { PropsWithChildren, ReactElement } from "react";
import { useEffect, useState } from "react";
import type { Component } from "./utils/component";
import { z } from "zod";
import { useProjectStore } from "@/store/project.store";

type PageLayoutProps = {
  projectId?: string;
  noFetch?: boolean;
} & PropsWithChildren;

export const PageLayout: Component<PageLayoutProps> = ({ projectId, children, noFetch = false }): ReactElement => {
  const [isLogged, setIsLogged] = useState(true);
  const [isAllowed, setIsAllowed] = useState(true);
  const { active, setActive } = useProjectStore();

  useEffect(() => {
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
    };

    void fetchIsLogged();
    if (projectId) void fetchIsAllowed();
  }, [projectId]);

  if (noFetch == false) {
    if (!isLogged) return <div>Not logged in</div>;
    if (!isAllowed) return <div>This page or project does not exist</div>;
  }

  return (
    <div className="p-3">
      <div className="sm:p-4 p-0">
        {children}
      </div>
    </div>
  );
};