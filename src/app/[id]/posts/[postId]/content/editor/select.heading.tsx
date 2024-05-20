import type { Component } from "@/components/utils/component";
import type { ReactElement, RefObject } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ButtonImageType = {
  contentRef: RefObject<HTMLTextAreaElement>;
  isDisabled: boolean;
  selection: string;
  onContentChange: (content: string) => void;
};

export const SelectHeadingMarkdown: Component<ButtonImageType> = ({ contentRef, isDisabled, onContentChange, selection }): ReactElement => {

  return (
    <Select defaultValue="h1" disabled={isDisabled} onValueChange={(value) => {
      if (contentRef.current) {
        const text = contentRef.current.value;
        const selectionStart = contentRef.current.selectionStart;
        const selectionEnd = contentRef.current.selectionEnd;

        const heading = "#".repeat(Number(value[1]));
        const newText = `${text.slice(0, selectionStart)}${heading} ${selection}${text.slice(selectionEnd)}`;
        onContentChange(newText);
      }
    }}>
      <SelectTrigger className="w-[100px]" disabled={isDisabled}>
        <SelectValue>Heading</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="h1">H1</SelectItem>
        <SelectItem value="h2">H2</SelectItem>
        <SelectItem value="h3">H3</SelectItem>
        <SelectItem value="h4">H4</SelectItem>
        <SelectItem value="h5">H5</SelectItem>
        <SelectItem value="h6">H6</SelectItem>
      </SelectContent>
    </Select>
  );
};