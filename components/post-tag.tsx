import { TagColor } from "@prisma/client";
import { Hash, Tag } from "lucide-react";
import type { Component } from "./component";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

type TagProps = {
  color?: TagColor;
  content: string;
}

const CategoryTag: Component<TagProps> = ({ content }) => {
  return (
    <Badge className={cn(
      "flex gap-1 text-xs px-2 py-1",
      "border border-white/60 dark:border-black/30",
      "font-medium"
    )}>
      <Hash size={14} />
      {content}
    </Badge>
  );
};

const PostTag: Component<TagProps> = ({ color, content }) => {
  return (
    <Badge className={cn(
      "flex gap-1 text-xs px-2 py-1",
      "font-medium",
      {
      // Light mode
        "bg-[#FFFD8C]/60 text-black border-[#FFFD8C]/60": color === TagColor.YELLOW,
        "bg-[#FFE4B5]/60 text-black border-[#FFE4B5]/60": color === TagColor.ORANGE,
        "bg-[#DDA0DD]/60 text-black border-[#DDA0DD]/60": color === TagColor.PURPLE,
        "bg-[#FFB6C1]/60 text-black border-[#FFB6C1]/60": color === TagColor.PINK,
        "bg-[#87CEFA]/60 text-black border-[#87CEFA]/60": color === TagColor.BLUE,
        "bg-[#98FB98]/60 text-black border-[#98FB98]/60": color === TagColor.GREEN,
        "bg-[#FFA07A]/60 text-black border-[#FFA07A]/60": color === TagColor.RED,
        "bg-[#E0E0E0]/60 text-black border-[#E0E0E0]/60": color === TagColor.BLACK,
        "bg-[#FFFFFF]/60 text-black border-[#FFFFFF]/60": color === TagColor.WHITE,

        // Dark mode
        "dark:bg-[#FFD700]/30 dark:text-black dark:border-[#FFD700]/30": color === TagColor.YELLOW,
        "dark:bg-[#FF7F50]/30 dark:text-white dark:border-[#FF7F50]/30": color === TagColor.ORANGE,
        "dark:bg-[#6A5ACD]/30 dark:text-white dark:border-[#6A5ACD]/30": color === TagColor.PURPLE,
        "dark:bg-[#FF69B4]/30 dark:text-white dark:border-[#FF69B4]/30": color === TagColor.PINK,
        "dark:bg-[#4682B4]/30 dark:text-white dark:border-[#4682B4]/30": color === TagColor.BLUE,
        "dark:bg-[#3CB371]/30 dark:text-white dark:border-[#3CB371]/30": color === TagColor.GREEN,
        "dark:bg-[#DC143C]/30 dark:text-white dark:border-[#DC143C]/30": color === TagColor.RED,
        "dark:bg-[#333333]/30 dark:text-white dark:border-[#333333]/30": color === TagColor.BLACK,
        "dark:bg-[#F5F5F5]/30 dark:text-black dark:border-[#F5F5F5]/30": color === TagColor.WHITE
      }
    )}>
      <Tag size={14} />
      {content}
    </Badge>
  );
};

export { CategoryTag, PostTag };