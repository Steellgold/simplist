import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page.layout";

const Home = (): ReactElement => {
  return (
    <PageLayout title="API Keys">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You have no API keys
        </h3>
        <p className="text-sm text-muted-foreground">You can start generating API keys as soon as you add one.</p>
        <Button className="mt-4">Add API Key</Button>
      </div>
    </PageLayout>
  );
};


export default Home;