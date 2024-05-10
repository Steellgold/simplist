"use client";

import type { ReactElement } from "react";
import { PageLayout } from "@/components/page.layout";

type PageParams = {
  params: {
    id: string;
  };
};

const ProjectSettings = ({ params }: PageParams): ReactElement => {
  const { id } = params;

  return (
    <PageLayout projectId={id}>
      <div className="sm:p-4 p-0 gap-4 flex flex-col">
        <p className="text-2xl font-bold">Project posts</p>
      </div>
    </PageLayout>
  );
};


export default ProjectSettings;