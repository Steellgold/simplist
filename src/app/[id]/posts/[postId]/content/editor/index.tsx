import type { Component } from "@/components/utils/component";
import { ButtonBold } from "./button.bold";
import { ButtonItalic } from "./button.italic";
import { ButtonStrikethrough } from "./button.strikethrough";

type MarkdownButtonsType = {
  contentRef: React.RefObject<HTMLTextAreaElement>;
  selection: string;
  isDisabled: boolean;
  onContentChange: (content: string) => void;
};

export const MarkdownButtons: Component<MarkdownButtonsType> = ({ contentRef, selection, isDisabled, onContentChange }) => {
  return (
    <>
      <ButtonBold contentRef={contentRef} selection={selection} isDisabled={isDisabled} onContentChange={onContentChange} />
      <ButtonItalic contentRef={contentRef} selection={selection} isDisabled={isDisabled} onContentChange={onContentChange} />
      <ButtonStrikethrough contentRef={contentRef} selection={selection} isDisabled={isDisabled} onContentChange={onContentChange} />
    </>
  );
};