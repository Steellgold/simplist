"use client";

import type { JSONContent } from "novel";
import { EditorContent, EditorRoot } from "novel";
import type { ReactElement } from "react";
import { useState } from "react";
import { defaultExtensions } from "./editor.extensions";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils";

export const Editor = (): ReactElement => {
  const [initialContent] = useState<null | JSONContent>(null);

  return (
    <>
      <div className="relative w-full max-w-screen-lg">
        <Label htmlFor="content" className="grid gap-3">Content</Label>
        <Label htmlFor="content" className="text-muted-foreground text-sm -mt-2">(Markdown is supported)</Label>

        <EditorRoot>
          <EditorContent
            extensions={defaultExtensions}
            // @ts-ignore
            initialContent={initialContent}
            className="relative w-full max-w-screen-lg border-dashed bg-background sm:rounded-lg sm:border sm:shadow-lg mt-3"
            editorProps={{
              attributes: {
                class: cn(
                  // eslint-disable-next-line max-len
                  "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full overflow-x-auto overflow-y-auto p-4 sm:p-6 sm:rounded-lg sm:shadow-lg w-full"
                )
              }
            }}
          />
        </EditorRoot>
      </div>
    </>
  );
};