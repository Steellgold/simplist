import { PageLayout } from "@/components/page.layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Component } from "@/components/utils/component";
import { BarChart2 } from "lucide-react";
import { Chart } from "./chart";

type PageProps = {
  params: {
    project: string;
  };
};
const Home: Component<PageProps> = ({ params }) => {
  const { project } = params;

  return (
    <PageLayout title="Dashboard" projectId={project} center={false} bordered={false}>
      <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Chart />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};


export default Home;