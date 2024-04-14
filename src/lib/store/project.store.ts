import type { Project } from "@prisma/client";
import { create } from "zustand";

type ProjectStoreType = {
  project: Project | null;
  setProject: (project: Project) => void;
}

export const useProjectStore = create<ProjectStoreType>((set) => ({
  project: null,
  setProject: (project) => set({ project })
}));