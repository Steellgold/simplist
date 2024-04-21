import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page.layout";
import type { AsyncComponent, Component } from "@/components/utils/component";
import { db } from "@/utils/db/prisma";
import { NotebookPen, Pen } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { dayJS } from "@/dayjs/day-js";
import { Chart } from "../chart";
import { redis } from "@/utils/db/upstash";
import type { PostData } from "../../api/[id]/route";
import { Suspense } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { MobileAlert } from "./alert.mobile";
import { ButtonCopySlug } from "./button.slug";

type PageProps = {
  params: {
    project: string;
  };
};

const Posts: AsyncComponent<PageProps> = async({ params }) => {
  const { project } = params;

  const posts = await db.post.findMany({
    where: { projectId: project },
    orderBy: { createdAt: "desc" }
  });
  if (posts.length === 0) return <NoPosts params={params} />;

  const getAnalytics = async(slug: string): Promise<Array<{ date: string; "R/D": number } | undefined> | []> => {
    const pData = await redis.get(`post:${slug}`) as PostData;
    if (!pData.calls || Object.keys(pData.calls).length < 2) return [];

    const limitedAnalytics = Object.entries(pData.calls)
      .slice(-30)
      .map(([date, { count }]) => ({ date, "R/D": count }));

    return limitedAnalytics;
  };

  return (
    <PageLayout
      title="Posts"
      description="Manage your posts and create new ones."
      projectId={project}
      bordered={false}
      center={false}
      actions={(
        <Button asChild>
          <Link href={`/${project}/posts/new`}>
            <NotebookPen size={16} className="mr-2" />
            Create Post
          </Link>
        </Button>
      )}
    >
      <div className="mt-2">
        <MobileAlert />

        <Card>
          <div className="mt-3"></div>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] hidden md:table-cell">Banner</TableHead>
                  <TableHead className="w-[200px]">Title</TableHead>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center">
                          Analytics <InfoCircledIcon className="w-4 h-4 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          This chart shows the number of requests made to this post on the last 7 days.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="hidden md:table-cell">
                      <Image
                        alt="Product image"
                        className="aspect-video rounded-md object-cover"
                        src={post.banner ?? "/_static/no-image.png"}
                        width="320"
                        height="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {post.title.length >= 20 ? post.title.slice(0, 20) + "..." : post.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={post.status === "DRAFT" ? "outline" : "default"}>
                        {post.status === "DRAFT" ? "Draft" : "Published"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {(async() => {
                        const analytics = await getAnalytics(post.slug);
                        return (
                          <Suspense fallback={<div>Loading...</div>}>
                            {/* @ts-ignore */}
                            <Chart data={analytics} />
                          </Suspense>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      {dayJS(post.createdAt).format("MMM D, YYYY")}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size={"default"} asChild>
                        <Link href={`/${project}/posts/${post.slug}/edit`}>
                          <Pen size={14} />
                          &nbsp;Edit
                        </Link>
                      </Button>

                      <ButtonCopySlug slug={post.slug} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

const NoPosts: Component<PageProps> = ({ params }) => {
  const { project } = params;

  return (
    <PageLayout title="Posts" projectId={project}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You have no posts
        </h3>
        <p className="text-sm text-muted-foreground">You can start writing as soon as you add a post.</p>
        <Button className="mt-4" asChild>
          <Link href={`/${project}/posts/new`}>
            <NotebookPen size={16} className="mr-2" />
            Create Post
          </Link>
        </Button>
      </div>
    </PageLayout>
  );
};

export default Posts;