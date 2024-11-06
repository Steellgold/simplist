"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useGetTags } from "@/lib/actions/tag/tag.hook";
import { Skeleton } from "./ui/skeleton";
import type { Component } from "./component";

type TagSelectorProps = {
  selectedTags?: string[];
  onSelect: (tagIds: string[]) => void;
};

export const TagSelector: Component<TagSelectorProps> = ({ onSelect, selectedTags: alreadySelectedTags }) => {
  const { data, isPending } = useGetTags();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (isPending) return;
    if (alreadySelectedTags) setSelectedTags(alreadySelectedTags);
  }, [isPending, alreadySelectedTags]);

  const toggleTag = (tagId: string): void => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
      onSelect(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
      onSelect([...selectedTags, tagId]);
    }
  };

  if (isPending) return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="w-20 h-8" />
      ))}
    </div>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {data && data.map(tag => (
        <Button
          key={tag.id}
          variant={selectedTags.includes(tag.id) ? "default" : "outline"}
          size="sm"
          onClick={() => toggleTag(tag.id)}
          aria-pressed={selectedTags.includes(tag.id)}
          className="transition-all duration-200 ease-in-out"
        >
          {selectedTags.includes(tag.id) ? <Check className="w-4 h-4" /> : null}
          {tag.name}
          {selectedTags.includes(tag.id) && (
            <span className="sr-only">(selected)</span>
          )}
        </Button>
      ))}
    </div>
  );
};