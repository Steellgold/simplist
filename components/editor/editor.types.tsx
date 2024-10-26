import type { Lang } from "@/lib/lang";

export type PostInfo = {
  title: string;
  excerpt: string;
  content: string;
  banner?: string | null;
  lang: Lang;
  variantId?: string;
}[];

export type EditorProps = {
  isNew?: boolean;
  posts?: PostInfo;
  files?: File[];
  dbId?: string;
};

export type EditorElementProps = {
  activeIndex: number;
  postInfo: PostInfo;

  setValue: (value: string) => void;
};

export type EditorHeaderProps = {
  activeIndex: number;
  postInfo: PostInfo;

  setActiveIndex: (index: number) => void;
  onLanguageChange: (lang: Lang) => void
};

export type EditorSaveProps = {
  isNew: boolean;
  postInfo: PostInfo;
  postId: string;
};