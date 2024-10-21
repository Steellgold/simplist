import { create } from "zustand";

type BreadcrumbState = {
  breadcrumbs: { label: string; href: string }[];
  title: string;
  setBreadcrumb: (breadcrumbs: { label: string; href: string }[], title: string) => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  breadcrumbs: [],
  title: "",
  setBreadcrumb: (breadcrumbs, title) => set(() => ({
    breadcrumbs,
    title
  }))
}));