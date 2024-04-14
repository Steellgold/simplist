import { create } from "zustand";
import { persist } from "zustand/middleware";

type DataStore = {
  hasVisited: boolean;
  setHasVisited: () => void;
};

export const useVistedStore = create(
  persist<DataStore>(
    (set) => ({
      hasVisited: false,
      setHasVisited: () => set({ hasVisited: true })
    }),
    { name: "visited-storage" },
  ),
);