"use client";

import type { ReactElement } from "react";
import { PageLayout } from "@/components/page.layout";
import { specialFont } from "@/components/ui/font";
import { cn } from "@/utils";
import { Editor } from "../[postId]/content/editor";

type PageParams = {
  params: {
    id: string;
  };
};

const ProjectPost = ({ params: { id } }: PageParams): ReactElement => {
  return (
    <PageLayout projectId={id}>
      <div className="mb-3 bg-[#1a1a1a] p-3 rounded-md flex flex-col sm:flex-row justify-between">
        <div className="flex flex-col">
          <p className={cn(specialFont.className, "text-2xl")}>New Post</p>
          <p className="text-muted-foreground text-sm">
            You are creating a new post, please fill in the fields below.
          </p>
        </div>
      </div>

      <Editor projectId={id} isNew />
    </PageLayout>
  );
};

export default ProjectPost;