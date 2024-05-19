import type { Component } from "@/components/utils/component";
import type { ReactElement, RefObject } from "react";
import { Bold, Italic, Strikethrough } from "lucide-react";
import { Button } from "@/components/ui/button";

type MarkdownButtonsType = {
  contentRef: RefObject<HTMLTextAreaElement>;
  selection: string;
  isDisabled: boolean;
  onContentChange: (content: string) => void;
  type: "bold" | "italic" | "strike";
};

export const markdownProcessor = ({ contentRef, selection, isDisabled, onContentChange, type }: MarkdownButtonsType): boolean => {
  if (isDisabled) return false;
  if (!contentRef.current) return false;
  if (!selection) return false;

  const text = contentRef.current.value;
  const selectionStart = contentRef.current.selectionStart;
  const selectionEnd = contentRef.current.selectionEnd;

  let newText = text;
  switch (type) {
    case "bold":
      newText = `${text.slice(0, selectionStart)}**${selection}**${text.slice(selectionEnd)}`;
      break;
    case "italic":
      newText = `${text.slice(0, selectionStart)}*${selection}*${text.slice(selectionEnd)}`;
      break;
    case "strike":
      newText = `${text.slice(0, selectionStart)}~~${selection}~~${text.slice(selectionEnd)}`;
      break;
  }

  onContentChange(newText);
  return true;
};

export const MDB: Component<MarkdownButtonsType> = ({ contentRef, selection, isDisabled, onContentChange, type }): ReactElement => {
  return (
    <Button
      variant="inputStyle"
      disabled={isDisabled}
      onClick={() => markdownProcessor({ contentRef, selection, isDisabled, onContentChange, type })}>
      {type === "bold" && <Bold className="h-4 w-4" />}
      {type === "italic" && <Italic className="h-4 w-4" />}
      {type === "strike" && <Strikethrough className="h-4 w-4" />}
    </Button>
  );
};