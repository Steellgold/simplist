import { CircleDotDashed } from "lucide-react";
import type { Component } from "../component";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { EditorHeaderProps } from "./editor.types";
import type { Lang } from "@/lib/lang";
import { LANGUAGES } from "@/lib/lang";
import { cn } from "@/lib/utils";

export const EditorHeader: Component<EditorHeaderProps> = ({ activeIndex, postInfo, onLanguageChange }) => {
  return (
    <Card>
      <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>Post Editor</CardTitle>
          <CardDescription>Write a new post, and publish it to the API endpoint.</CardDescription>
        </div>

        <Select
          value={postInfo[activeIndex].lang}
          onValueChange={(value) => onLanguageChange(value as Lang)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(LANGUAGES)
              .sort(([keyA], [keyB]) => {
                const existsA = postInfo.some(post => post.lang === keyA as Lang);
                const existsB = postInfo.some(post => post.lang === keyB as Lang);
                return existsA === existsB ? 0 : existsA ? -1 : 1;
              })
              .map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-1.5">
                    {postInfo.some(post => post.lang === key as Lang) ? (
                      <CircleDotDashed size={16} className={cn("text-muted-foreground", {
                        "animate-pulse text-blue-500": postInfo[activeIndex].lang === key as Lang
                      })} />
                    ) : null}

                    {value}
                  </span>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </CardHeader>
    </Card>
  );
};