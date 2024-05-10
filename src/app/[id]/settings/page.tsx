"use client";

import type { ReactElement } from "react";
import { PageLayout } from "@/components/page.layout";
import { ProjectNameSettingsCard } from "./lib/project-name-card";
import { ProjectDeleteSettingsCard } from "./lib/project-delete-card";

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
        <ProjectNameSettingsCard />
        <ProjectDeleteSettingsCard />
      </div>
    </PageLayout>
  );
};


export default ProjectSettings;