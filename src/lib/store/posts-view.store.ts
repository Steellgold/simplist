import { create } from "zustand";
import { persist } from "zustand/middleware";

type DataStore = {
  view: "grid" | "list";
  toggle: () => void;
};

export const usePostsViewStore = create(
  persist<DataStore>(
    (set) => ({
      view: "grid",
      toggle: () => set((state) => ({ view: state.view === "grid" ? "list" : "grid" }))
    }),
    { name: "posts-view-store" },
  ),
);