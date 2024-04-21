export type KeyData = {
  id: string;
  projectId: string;
  authorId: string;
  status: "ACTIVE" | "INACTIVE";
  lastUsed?: string;
}