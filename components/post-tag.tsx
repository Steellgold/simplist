import { TagColor } from "@prisma/client";
import { Hash, Tag } from "lucide-react";
import type { Component } from "./component";
import { cn } from "@/lib/utils";

type TagProps = {
  color?: TagColor;
  content: string;
}

const CategoryTag: Component<TagProps> = ({ content }) => {
  return (
    <span className="glow-tag flex gap-1 text-xs px-2 py-1 rounded-full bg-gray-500 dark:bg-gray-600 text-white">
      <Hash size={14} />
      {content}
    </span>
  );
};

const PostTag: Component<TagProps> = ({ color, content }) => {
  return (
    <span className={cn("glow-tag flex gap-1 text-xs px-2 py-1 rounded-full", {
      "bg-primary text-black": color === TagColor.YELLOW,
      "bg-[#FF4500] text-white": color === TagColor.ORANGE,
      "bg-[#8A2BE2] text-white": color === TagColor.PURPLE,
      "bg-[#FF1493] text-white": color === TagColor.PINK,
      "bg-[#1E90FF] text-white": color === TagColor.BLUE,
      "bg-[#008000] text-white": color === TagColor.GREEN,
      "bg-[#FF0000] text-white": color === TagColor.RED,
      "bg-[#000000] text-white": color === TagColor.BLACK,
      "bg-[#FFFFFF] text-black": color === TagColor.WHITE
    })}>
      <Tag size={14} />
      {content}
    </span>
  );
};

export { CategoryTag, PostTag };