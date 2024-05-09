"use client";

import { useEffect, type ReactElement } from "react";
import { useProjectStore } from "@/store/project.store";
import { CardHeader } from "@/components/ui/card";
import { CustomCard } from "@/components/ui/custom-card";
import { ProjectMetrics } from "./lib/metrics-daily";
import { PageLayout } from "@/components/page.layout";

type PageParams = {
  params: {
    id: string;
  };
};

const ProjectHome = ({ params }: PageParams): ReactElement => {
  const { setActive } = useProjectStore();

  const { id } = params;

  useEffect(() => {
    setActive(id);
    console.log(id);
  }, [id, setActive]);

  return (
    <PageLayout projectId={id}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <CustomCard noHover>
          <CardHeader className="flex">
            <div className="flex space-x-2">
              <div>
                <p>Most requested post</p>
                <p className="text-sm text-muted-foreground">Post title</p>
              </div>
            </div>
          </CardHeader>
        </CustomCard>

        <CustomCard noHover>
          <CardHeader className="flex">
            <div className="flex space-x-2">
              <div>
                <p>Most requested post</p>
                <p className="text-sm text-muted-foreground">Post title</p>
              </div>
            </div>
          </CardHeader>
        </CustomCard>

        <ProjectMetrics />
      </div>
    </PageLayout>
  );
};


export default ProjectHome;