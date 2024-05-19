import { Button } from "@/components/ui/button";
import type { Component } from "@/components/utils/component";
import { Italic } from "lucide-react";
import type { RefObject } from "react";

type ButtonBold = {
  contentRef: RefObject<HTMLTextAreaElement>;
  selection: string;
  isDisabled: boolean;
  onContentChange: (content: string) => void;
};

export const ButtonItalic: Component<ButtonBold> = ({
  contentRef,
  selection,
  isDisabled,
  onContentChange
}) => {
  return (
    <Button variant="inputStyle" disabled={isDisabled} onClick={() => {
      if (isDisabled) return;
      if (!contentRef.current) return;
      if (!selection) return;

      const text = contentRef.current.value;
      const selectionStart = contentRef.current.selectionStart;
      const selectionEnd = contentRef.current.selectionEnd;

      const newText = `${text.slice(0, selectionStart)}*${selection}*${text.slice(selectionEnd)}`;
      onContentChange(newText);
    }}>
      <Italic className="h-4 w-4" />
    </Button>
  );
};