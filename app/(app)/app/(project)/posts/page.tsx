"use client";

import { CategoryTag, PostTag } from "@/components/post-tag";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientOnly } from "@/components/ui/client-only";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SparkAreaChart } from "@/components/ui/tremor/spark-chart";
import { useBreadcrumbStore } from "@/hooks/use-breadcrumb";
import { useGetPosts } from "@/lib/actions/post/post.hook";
import { useActiveOrganization } from "@/lib/auth/client";
import { dayJS } from "@/lib/day-js";
import { cn } from "@/lib/utils";
import { Archive, Copy, Edit } from "lucide-react";
import Image from "next/image";
import type { ReactElement } from "react";
import { useEffect } from "react";

const chartdata = [
  { month: "Jan 21", Performance: 4000 },
  { month: "Feb 21", Performance: 3000 },
  { month: "Mar 21", Performance: 2000 },
  { month: "Apr 21", Performance: 2780 },
  { month: "May 21", Performance: 1890 },
  { month: "Jun 21", Performance: 2390 },
  { month: "Jul 21", Performance: 3490 },
  { month: "Aug 21", Performance: 3490 },
  { month: "Sep 21", Performance: 3490 },
  { month: "Oct 21", Performance: 5955 },
  { month: "Nov 21", Performance: 3490 },
  { month: "Dec 21", Performance: 3490 },
  { month: "Jan 22", Performance: 6549 },
  { month: "Feb 22", Performance: 3490 },
  { month: "Mar 22", Performance: 3490 },
  { month: "Apr 22", Performance: 2265 },
  { month: "May 22", Performance: 1490 },
  { month: "Jun 22", Performance: 2490 },
  { month: "Jul 22", Performance: 4490 },
  { month: "Aug 22", Performance: 3490 },
  { month: "Sep 22", Performance: 2490 },
  { month: "Oct 22", Performance: 1490 },
  { month: "Nov 22", Performance: 1190 },
  { month: "Dec 22", Performance: 190 }
];

const Page = (): ReactElement => {
  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);
  const { data: postsData, isPending: postsPending, refetch, isRefetching } = useGetPosts();
  const { data: organization } = useActiveOrganization();

  useEffect(() => {
    if (organization) {
      void refetch();
    }
  }, [organization, refetch]);

  useEffect(() => {
    setBreadcrumb([{ href: "/app", label: "Overview" }], "Posts");
  }, [setBreadcrumb]);

  return (
    <div className="container">
      <div className="flex flex-col gap-1.5 mb-4">
        {postsPending ? <SkeletonHeader /> : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Posts</h1>
              <p className="text-sm text-muted-foreground">{postsData?.length} post(s) found</p>
            </div>

            <Input type="search" placeholder="Search posts" className="w-72" />
          </div>
        )}

        <ClientOnly fallback={<SkeletonPlaceholder />}>
          {postsData && postsData.length >= 1 ? postsData.map((post) => (
            <Card
              key={post.id}
              className={cn(
                "mt-4 flex flex-col md:flex-row justify-between",
                "hover:shadow-lg hover:bg-primary/5 hover:border-primary transition-all duration-200"
              )}
            >
              <div className="flex flex-col md:flex-row">
                <div className="p-5 -mb-6 md:mb-0">
                  <div className="relative w-full h-52 md:w-56 md:h-full">
                    <Image src={"https://placehold.co/600x500/png"} alt={post.title} fill className="rounded-lg object-cover" />
                  </div>
                </div>

                <CardHeader className="flex flex-col md:flex-row">
                  <div className="flex flex-col justify-between gap-1">
                    <div className="flex flex-col gap-1">

                      <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-1">{post.exerpt}</CardDescription>

                      <CardDescription className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">
                          Published on {dayJS(post.createdAt).format("DD MMM YYYY")}
                          &nbsp;by {organization?.members.find((member) => member.id === post.author.id)?.user.name}
                        </span>
                      </CardDescription>
                    </div>

                    <div className="flex gap-1 glow-container">
                      {post.categories.map((category) => <CategoryTag key={category.id} content={category.name} />)}
                      {post.tags.map((tag) => <PostTag key={tag.id} color={tag.color} content={tag.name} />)}
                    </div>
                  </div>
                </CardHeader>
              </div>

              <CardFooter className="flex justify-between p-5 gap-2 justify-end">
                <div className="bg-primary/5 rounded-lg w-full h-full hidden md:block">
                  <SparkAreaChart
                    data={chartdata}
                    categories={["Performance"]}
                    index={"month"}
                    colors={["yellow"]}
                    className="md:h-full md:w-36 lg:w-48 xl:w-60"
                  />
                </div>

                <div className="flex flex-row md:flex-col gap-1 md:gap-0.5">
                  <Button variant={"outline"} size={"icon"}>
                    <Edit size={16} />
                  </Button>

                  <Button variant={"outline"} size={"icon"}>
                    <Copy size={16} />
                  </Button>

                  <Button variant={"outline"} size={"icon"}>
                    <Archive size={16} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )) : isRefetching || postsPending ? (
            <SkeletonPlaceholder />
          ) : (
            <EmptyState
              title="No posts found"
              description="Create a new post to get started"
              actions={[
                <Button key="create-post" variant="default" size="sm">Create Post</Button>
              ]}
            />
          )}
        </ClientOnly>
      </div>
    </div>
  );
};

const SkeletonPlaceholder = (): ReactElement => (
  <div className="container flex flex-col gap-1.5 mb-4">
    <Skeleton className="h-32" />
    <Skeleton className="h-32" />
    <Skeleton className="h-32" />
    <Skeleton className="h-32" />
    <Skeleton className="h-32" />
  </div>
);

const SkeletonHeader = (): ReactElement => (
  <div className="flex justify-between">
    <div className="flex flex-col gap-1">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-32" />
    </div>

    <Skeleton className="w-72" />
  </div>
);

export default Page;