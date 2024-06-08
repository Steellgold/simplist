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
  // type: "bold" | "italic" | "strike" | "line" | "quote" | "code" | "table";
};

export const markdownProcessor = ({
  contentRef,
  selection,
  isDisabled,
  onContentChange,
  type
}: MarkdownButtonsType): boolean => {
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
    // case "line":
    //   newText = `${text}\n---\n`;
    //   break;
    // case "quote":
    //   newText = `${text}\n> `;
    //   break;
    // case "code":
    //   newText = `${text}\n\`\`\`\n\n\`\`\``;
    //   break;
    // case "table":
    //   newText = `${text}\n| Header 1 | Header 2 |\n|----------|----------|\n| Row 1    | Row 2    |`;
    //   break;
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
      {/* {type === "line" && <Minus className="h-4 w-4" />}
      {type === "quote" && <Quote className="h-4 w-4" />}
      {type === "code" && <Table className="h-4 w-4" />} */}
    </Button>
  );
};