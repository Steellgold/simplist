"use client";

import type { Component } from "@/components/utils/component";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { deletePost } from "@/actions/post";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type DeletePostDialog = {
  projectId: string;
  postId: string;
};

export const DialogDeletePost: Component<DeletePostDialog> = ({ projectId, postId }) => {
  const [deleteText, setDeleteText] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AlertDialog onOpenChange={(open) => !open && setDeleteText("")}>
      <AlertDialogTrigger className="w-full">
        <Button variant="destructive" className="w-full">Delete Post</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <p>Are you sure you want to delete this post?</p>
        <Input placeholder="Type DELETE to confirm" className="w-full mt-2" value={deleteText} onChange={(e) => setDeleteText(e.target.value)} />
        <p className="text-xs text-gray-400">This action cannot be undone.</p>
        <div className="flex items-center gap-2 mt-4 justify-between">
          <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>

          <form onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            toast.promise(deletePost(postId, projectId), {
              loading: "Deleting post...",
              success: "Post deleted successfully",
              error: "Failed to delete post"
            });
          }}>
            <Button
              className="w-full"
              variant="destructive"
              disabled={deleteText !== "DELETE" || loading}
            >
              {loading && <Loader2 className="animate-spin" size="24" />}
              Delete
            </Button>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};