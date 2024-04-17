import type { Project } from "@prisma/client";
import { create } from "zustand";

type ProjectStoreType = {
  activeProject: Project | null;
  list: Project[];
  setProject: (project: Project) => void;
  setProjects: (projects: Project[]) => void;
}

export const useProjectStore = create<ProjectStoreType>((set) => ({
  activeProject: null,
  list: [],
  setProject: (project) => set({ activeProject: project }),
  setProjects: (projects) => set({ list: projects })
}));