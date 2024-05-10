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

  updateActive: (project: Project) => void;
  deleteActive: () => void;
  deleteProject: (projectId: string) => void;
};

type Project = {
  id: string;
  name: string;
}

export const useProjectStore = create(
  persist<ProjectsStore>(
    (set) => ({
      projects: [],
      active: null,
      isSwitching: false,
      setProjects: (projects) => set({ projects }),
      setActive: (active) => set((state) => ({ active: state.projects.find((project) => project.id === active) })),

      setIsSwitching: (isSwitching) => set({ isSwitching }),
      setSwitched: () => set((state) => ({ isSwitching: !state.isSwitching })),

      updateActive: (project) => set((state) => {
        const projects = state.projects.map((p) => p.id === project.id ? project : p);
        return { projects, active: project };
      }),

      deleteActive: () => set((state) => {
        const projects = state.projects.filter((project) => project.id !== state.active?.id);
        return { projects, active: null };
      }),

      deleteProject: (projectId) => set((state) => {
        const projects = state.projects.filter((project) => project.id !== projectId);
        return { projects, active: null };
      })
    }),
    { name: "projects-store" }
  ),
);