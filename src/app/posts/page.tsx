import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page.layout";

const Home = (): ReactElement => {
  return (
    <PageLayout title="Posts">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You have no posts
        </h3>
        <p className="text-sm text-muted-foreground">You can start writing as soon as you add a post.</p>
        <Button className="mt-4">Add Post</Button>
      </div>
    </PageLayout>
  );
};


export default Home;