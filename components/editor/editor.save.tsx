"use client";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useUpdatePost } from "@/lib/actions/post/post.hook";
import type { Component } from "../component";
import type { EditorSaveProps } from "./editor.types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { BookDashed, FilePen, FilePenLine, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const EditorSave: Component<EditorSaveProps> = ({ isNew, postInfo, postId }) => {
  const update = useUpdatePost();
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Save Post</CardTitle>
        <CardDescription>Save the post to the API endpoint.</CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-end gap-2">
        {isNew && (
          <Button variant="outline" size={"sm"}>
            <BookDashed size={16} />
            Save as Draft
          </Button>
        )}

        <Button
          variant="default"
          size={"sm"}
          onClick={() => {
            if (isNew) {
              toast.success("Post published successfully.");
              return;
            }

            setIsSaving(true);
            update.mutate({
              id: postId,
              data: {
                title: postInfo[0].title,
                excerpt: postInfo[0].excerpt,
                content: postInfo[0].content,
                lang: postInfo[0].lang,
                variants: {
                  updateMany: postInfo.slice(1).map(variant => ({
                    where: { id: variant.variantId },
                    data: {
                      title: variant.title,
                      excerpt: variant.excerpt,
                      content: variant.content,
                      lang: variant.lang
                    }
                  }))
                }
              }
            }, {
              onSuccess: () => {
                setIsSaving(false);
                router.push("/app/posts");
                toast.success("Post updated successfully.");
              },
              onError: () => {
                toast.error("Failed to update post.");
                setIsSaving(false);
              }
            });
          }}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : (
            <>
              {isNew ? <FilePenLine size={16} /> : <FilePen size={16} />}
            </>
          )}
          {isNew ? "Publish Post" : "Update Post"}
        </Button>
      </CardFooter>
    </Card>
  );
};