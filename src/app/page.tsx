import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page.layout";
import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import { NewProjectDialog } from "@/components/new-project.dialog";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dayJS } from "@/dayjs/day-js";
import type { Component } from "@/components/utils/component";
import Link from "next/link";
import { Plus } from "lucide-react";

type NoProjectProps = {
  isFirst?: boolean;
};

const NoProject: Component<NoProjectProps> = ({ isFirst = true }) => {
  return (
    <PageLayout title="Projects">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You have no projects
        </h3>
        <p className="text-sm text-muted-foreground">You can start creating as soon as you add a project.</p>
        <NewProjectDialog isFirst={isFirst}>
          <Button>Create your first project</Button>
        </NewProjectDialog>
      </div>
    </PageLayout>
  );
};

const Home = async(): Promise<ReactElement> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if  (!user) return <NoProject />;

  const projects = await db.project.findMany({
    where: { userId: user.id }
  });

  if (!projects) return <NoProject isFirst />;
  if (projects.length === 0) return <NoProject isFirst />;

  return (
    <PageLayout title="Projects" center={false} actions={(
      <NewProjectDialog isFirst={projects.length === 0}>
        <Button>
          <Plus className="h-4 w-4" />&nbsp;
          Project
        </Button>
      </NewProjectDialog>
    )}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {projects.map((project) => (
          <Card key={project.id} className="w-full border-2 hover:cursor-pointer hover:border-primary/40 transition-colors">
            <Link href={`/${project.id}/posts`}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>Created on {dayJS(project.createdAt).format("MMMM DD, YYYY")}</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};


export default Home;