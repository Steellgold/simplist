// import { create } from "zustand";

type Project = {
  id: string;
  name: string;
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProjectsStore = {
  projects: Project[];
  active: Project | null;
  setProjects: (projects: Project[]) => void;
  setActive: (projectId: string) => void;

  isSwitching: boolean;
  setIsSwitching: (isSwitching: boolean) => void;
  setSwitched: () => void;
};

export const useProjectStore = create(
  persist<ProjectsStore>(
    (set) => ({
      projects: [],
      active: null,
      isSwitching: false,
      setProjects: (projects) => set({ projects }),
      setActive: (active) => set((state) => ({ active: state.projects.find((project) => project.id === active) })),

      setIsSwitching: (isSwitching) => set({ isSwitching }),
      setSwitched: () => set((state) => ({ isSwitching: !state.isSwitching }))
    }),
    { name: "projects-store" }
  ),
);