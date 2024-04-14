import type { Workspace } from "@prisma/client";
import { create } from "zustand";

type WorkspaceStoreType = {
  workspace: Workspace | null;
  setWorkspace: (workspace: Workspace) => void;
}

export const useWorkspaceStore = create<WorkspaceStoreType>((set) => ({
  workspace: null,
  setWorkspace: (workspace) => set({ workspace })
}));