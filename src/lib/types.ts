import type { Meta } from "@prisma/client";

export type KeyData = {
  id: string;
  projectId: string;
  authorId: string;
  status: "ACTIVE" | "INACTIVE";
  lastUsed?: string;
}

export type PostData = {
  authorId: string;
  banner: string | null;
  content: string;
  createdAt: string;
  excerpt: string;
  id: string;
  metadata: Meta[];
  projectId: string;
  slug: string;
  status: string;
  title: string;
  updatedAt: string;
  calls: {
    [key: string]: {
      count: number;
      lastCall: string;
    };
  };
}

export type Metadata = {
  key: string;
  type: "string" | "number" | "boolean" | "date" | "time" | "datetime";
  value: string | number | boolean;
  isOld?: boolean;
};