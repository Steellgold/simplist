"use client";
import { Button } from "@/components/ui/button";
import type { Component } from "@/components/utils/component";
import { Copy, CopyCheck } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";


type ButtonCopySlugProps = {
  slug: string;
};

export const ButtonCopySlug: Component<ButtonCopySlugProps> = ({ slug }) => {
  const [copied, setCopied] = useCopyToClipboard();

  return (
    <Button size={"icon"} variant={"outline"} onClick={() => {
      void setCopied(slug);
      toast.success("Slug successfully copied to clipboard.");
    }}>
      {copied ? <CopyCheck size={16} /> : <Copy size={16} />}
    </Button>
  );
};