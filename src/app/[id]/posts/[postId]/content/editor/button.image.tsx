import type { Component } from "@/components/utils/component";
import { useState, type ReactElement, type RefObject } from "react";
import { Image as Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type ButtonImageType = {
  contentRef: RefObject<HTMLTextAreaElement>;
  isDisabled: boolean;
  onContentChange: (content: string) => void;
  handleStackChange?: (stack: string) => void;
};

export const ButtonMarkdownImage: Component<ButtonImageType> = ({ contentRef, isDisabled, onContentChange, handleStackChange }): ReactElement => {
  const [imageAlt, setImageAlt] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);

  return (
    <Dialog>
      <DialogTrigger disabled={isDisabled}>
        <Button variant="inputStyle" disabled={isDisabled}>
          <Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>Upload or insert a link to an image that you want to include in your blog post.</DialogDescription>
        </DialogHeader>

        <Input placeholder="Enter the alt text of the image" value={imageAlt ?? ""} onChange={(e) => setImageAlt(e.target.value)} />
        <Input placeholder="Enter the URL of the image" value={imageURL ?? ""} onChange={(e) => setImageURL(e.target.value)} />
        <Button disabled variant="inputStyle">Upload Image&nbsp;&nbsp;<Badge variant={"outline"}>Soon</Badge></Button>

        <DialogFooter>
          <Button
            disabled={!imageURL || !imageAlt}
            onClick={() => {
              if (contentRef.current) {
                const text = contentRef.current.value;
                const selectionStart = contentRef.current.selectionStart;
                const selectionEnd = contentRef.current.selectionEnd;

                const newText = `${text.slice(0, selectionStart)}![${imageAlt}](${imageURL})${text.slice(selectionEnd)}`;
                setImageURL(null);
                setImageAlt(null);
                onContentChange(newText);
                handleStackChange && handleStackChange(newText);
              }
            }}>Insert Image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};