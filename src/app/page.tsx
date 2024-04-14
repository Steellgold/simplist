import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page.layout";
import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import { NewProjectDialog } from "@/components/new-project.dialog";

const NoProject = (): ReactElement => {
  return (
    <PageLayout title="Projects">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
      You have no projects
        </h3>
        <p className="text-sm text-muted-foreground">You can start creating as soon as you add a project.</p>
        <Button className="mt-4">Add Project</Button>
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

  return (
    <PageLayout title="Projects">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You have no projects
        </h3>
        <p className="text-sm text-muted-foreground">You can start creating as soon as you add a project.</p>
        <NewProjectDialog isFirst={projects.length === 0}>
          <Button className="mt-4">Add Project</Button>
        </NewProjectDialog>
      </div>
    </PageLayout>
  );
};


export default Home;