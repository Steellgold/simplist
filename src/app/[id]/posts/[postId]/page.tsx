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
    regions: []
  });

  useEffect(() => {
    const fetchData = async(): Promise<void> => {
      const res = await fetch(`/api/user/projects/post?projectId=${id}&postId=${postId}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setPost(data.post);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setAnalytics(data.analytics);
      console.log(data);
      setLoading(false);
    };

    void fetchData();
  }, [id, postId]);

  if (!post || loading) {
    return (
      <PageLayout projectId={id} noFetch>
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-72 h-10 mt-2" />
        <Skeleton className="w-full h-[calc(80vh-4rem)] mt-2" />
      </PageLayout>
    );
  }


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
            cities={analytics.cities}
            countries={analytics.countries}
            regions={analytics.regions}
            postId={postId}
            projectId={id}
          />
        </TabsContent>

        <TabsContent value="edit">
          <div>Edit</div>
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