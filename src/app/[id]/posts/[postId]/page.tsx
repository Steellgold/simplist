"use client";

import { useEffect, useState, type ReactElement } from "react";
import { PageLayout } from "@/components/page.layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { specialFont } from "@/components/ui/font";
import { cn } from "@/utils";
import type { Prisma } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Analytics } from "./content/analytics";
import type { Analytics as AnalyticsType } from "../../../api/user/projects/post/analytics.type";
import { dayJS } from "@/dayjs/day-js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type SelectTime } from "@/utils/analytics";
import { Editor } from "./content/editor";

type PageParams = {
  params: {
    id: string;
    postId: string;
  };
};

type Post = Prisma.PostGetPayload<{
  select: {
    id: true;
    title: true;
    excerpt: true;
    content: true;
    banner: true;
    createdAt: true;
    updatedAt: true;
    lang: true;
    metadata: true;
    status: true;
    comments: {
      select: {
        id: true;
        content: true;
        name: true;
        createdAt: true;
      };
    };
    variants: {
      select: {
        id: true;
        lang: true;
        content: true;
        excerpt: true;
        title: true;
      };
    };
  };
}>;

const ProjectPost = ({ params: { id, postId } }: PageParams): ReactElement => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsType>({
    cities: [],
    countries: [],
    regions: [],
    devices: [],
    browsers: [],
    OSs: []
  });

  const [url, setUrl] = useState(`/api/user/projects/post?projectId=${id}&postId=${postId}&type=hour`);
  const [selectedTime, setSelectedTime] = useState<SelectTime>("today");
  const [graphData, setGraphData] = useState<{ date: string; requests: number }[]>([]);

  useEffect(() => {
    const fetchData = async(): Promise<void> => {
      setLoading(true);
      const res = await fetch(url);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setPost(data.post);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setAnalytics(data.analytics);
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setGraphData(Object.entries(data.requests).map(([date, requests]) => ({ date, requests })));
      setLoading(false);
    };

    void fetchData();
  }, [url]);

  if (!post || loading) {
    return (
      <PageLayout projectId={id} noFetch>
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-72 h-10 mt-2" />
        <Skeleton className="w-full h-[calc(80vh-4rem)] mt-2" />
      </PageLayout>
    );
  }

  const buildUrl = (timeline: "hour" | "day" | "month" | "year", fromDate: string, toDate: string): void => {
    setUrl(`/api/user/projects/post?projectId=${id}&postId=${postId}&fromDate=${fromDate}&toDate=${toDate}&type=${timeline}`);
  };

  return (
    <PageLayout projectId={id}>
      <div className="mb-3 bg-[#1a1a1a] p-3 rounded-md flex flex-col sm:flex-row justify-between">
        <div className="flex flex-col">
          <p className={cn(specialFont.className, "text-2xl")}>{post.title}</p>
          <p className="text-muted-foreground text-sm">
            {post.excerpt}
          </p>
        </div>
      </div>

      <Tabs defaultValue="analytics">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="edit">Editor</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <Analytics
            devices={analytics.devices}
            OSs={analytics.OSs}
            browsers={analytics.browsers}
            cities={analytics.cities}
            countries={analytics.countries}
            regions={analytics.regions}

            selectedTime={selectedTime}
            graphData={graphData}
          >
            <Select onValueChange={(value) => {
              switch (value) {
                case "today":
                  buildUrl("hour", dayJS().format("YYYY-MM-DD"), dayJS().format("YYYY-MM-DD"));
                  break;
                case "yesterday":
                  buildUrl("hour", dayJS().subtract(1, "day").format("YYYY-MM-DD"), dayJS().subtract(1, "day").format("YYYY-MM-DD"));
                  break;
                case "week":
                  buildUrl("day", dayJS().subtract(7, "day").format("YYYY-MM-DD"), dayJS().format("YYYY-MM-DD"));
                  break;
                case "month":
                  buildUrl("day", dayJS().subtract(1, "month").format("YYYY-MM-DD"), dayJS().format("YYYY-MM-DD"));
                  break;
                case "3months":
                  buildUrl("month", dayJS().subtract(3, "month").format("YYYY-MM-DD"), dayJS().format("YYYY-MM-DD"));
                  break;
                case "6months":
                  buildUrl("month", dayJS().subtract(6, "month").format("YYYY-MM-DD"), dayJS().format("YYYY-MM-DD"));
                  break;
                case "year":
                  buildUrl("month", dayJS().subtract(1, "year").format("YYYY-MM-DD"), dayJS().format("YYYY-MM-DD"));
                  break;
                case "all":
                  buildUrl("year", dayJS().subtract(10, "year").format("YYYY-MM-DD"), dayJS().format("YYYY-MM-DD"));
                  break;
              }

              setSelectedTime(value as SelectTime);
            }} defaultValue="today" value={selectedTime}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="What time frame?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time (Years)</SelectItem>
              </SelectContent>
            </Select>
          </Analytics>
        </TabsContent>

        <TabsContent value="edit">
          <Editor title={post.title} />
        </TabsContent>

        <TabsContent value="variants">
          <div>Variants</div>
        </TabsContent>

        <TabsContent value="comments">
          <div>Comments</div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default ProjectPost;