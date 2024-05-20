import type { Component } from "@/components/utils/component";
import { useState, type ReactElement, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";

type ButtonImageType = {
  contentRef: RefObject<HTMLTextAreaElement>;
  isDisabled: boolean;
  selection: string;
  onContentChange: (content: string) => void;
  handleStackChange?: (stack: string) => void;
};

export const ButtonMarkdownLink: Component<ButtonImageType> = ({
  contentRef,
  isDisabled,
  selection,
  onContentChange,
  handleStackChange
}): ReactElement => {
  const [linkURL, setLinkURL] = useState<string | null>(null);

  return (
    <Dialog>
      <DialogTrigger disabled={isDisabled}>
        <Button variant="inputStyle" disabled={isDisabled}>
          <Link className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
          <DialogDescription>Insert a link to a website or another blog post.</DialogDescription>
        </DialogHeader>

        <Input placeholder="Enter the URL of the link" value={linkURL ?? ""} onChange={(e) => setLinkURL(e.target.value)} />

        <DialogFooter>
          <Button variant="outline" onClick={() => {}}>Cancel</Button>
          <Button
            disabled={!linkURL || !selection}
            onClick={() => {
              if (contentRef.current) {
                const text = contentRef.current.value;
                const selectionStart = contentRef.current.selectionStart;
                const selectionEnd = contentRef.current.selectionEnd;

                const newText = `${text.slice(0, selectionStart)}[${selection}](${linkURL})${text.slice(selectionEnd)}`;
                setLinkURL(null);
                onContentChange(newText);
                handleStackChange && handleStackChange(newText);
              }
            }}>Insert Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};