import type { Lang } from "@/lib/lang";

export type Banner = {
  name: string;
  type: string;
  id: string;

  url: string;
  size: number;

  uploadedAt: Date;
  uploadedBy: string;
};

export type PostInfo = {
  title: string;
  excerpt: string;
  content: string;
  banner?: Banner | null;
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

  toDelete: Lang[];
};

export type EditorBannerProps = {
  activeIndex: number;
  postInfo: PostInfo;
  setBanner: (banner: Banner | null) => void;

  isNew: boolean;
  postId: string;
};