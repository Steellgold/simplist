"use client";

import { CategoryTag, PostTag } from "@/components/post-tag";
import { Button, buttonVariants } from "@/components/ui/button";
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
import Link from "next/link";
import type { ReactElement } from "react";
import { useEffect } from "react";

const chartdata = (): Record<string, unknown>[] => {
  return [
    { month: "Jan 21", Performance: Math.floor(Math.random() * 100) },
    { month: "Feb 21", Performance: Math.floor(Math.random() * 100) },
    { month: "Mar 21", Performance: Math.floor(Math.random() * 100) },
    { month: "Sep 21", Performance: Math.floor(Math.random() * 100) },
    { month: "Nov 21", Performance: Math.floor(Math.random() * 100) },
    { month: "Dec 21", Performance: Math.floor(Math.random() * 100) },
    { month: "Jan 22", Performance: Math.floor(Math.random() * 100) },
    { month: "Feb 22", Performance: Math.floor(Math.random() * 100) },
    { month: "Apr 23", Performance: Math.floor(Math.random() * 100) },
    { month: "May 23", Performance: Math.floor(Math.random() * 100) },
    { month: "Jun 23", Performance: Math.floor(Math.random() * 100) },
    { month: "Jul 23", Performance: Math.floor(Math.random() * 100) },
    { month: "Aug 23", Performance: Math.floor(Math.random() * 100) },
    { month: "Sep 23", Performance: Math.floor(Math.random() * 100) },
    { month: "Oct 23", Performance: Math.floor(Math.random() * 100) },
    { month: "Nov 23", Performance: Math.floor(Math.random() * 100) },
    { month: "Dec 23", Performance: Math.floor(Math.random() * 100) }
  ];
};

const Page = (): ReactElement => {
  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);
  const { data: postsData, isPending: postsPending, refetch, isRefetching } = useGetPosts();
  const { data: organization } = useActiveOrganization();

  useEffect(() => {
    if (organization) {
      void refetch();
    }
  }, [organization, refetch]);

  useEffect(() => setBreadcrumb([{ href: "/app", label: "Overview" }], "Posts"), [setBreadcrumb]);

  return (
    <>
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
          <div className="flex flex-col gap-4 mt-4">
            {postsData && postsData.length >= 1 ? postsData.filter(
              (post) => post.organizationId === organization?.id
            ).sort((a, b) => dayJS(b.createdAt).unix() - dayJS(a.createdAt).unix()).map((post) => (
              <Card key={post.id} className={cn("flex flex-col md:flex-row justify-between")}>
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

                      <div className="flex gap-1">
                        {post.categories.map((category) => <CategoryTag key={category.id} content={category.name} />)}
                        {post.tags.map((tag) => <PostTag key={tag.id} color={tag.color} content={tag.name} />)}
                      </div>
                    </div>
                  </CardHeader>
                </div>

                <CardFooter className="flex justify-between p-5 gap-2 justify-end">
                  <div className="bg-primary/5 rounded-lg w-full h-full hidden md:block">
                    <SparkAreaChart
                      data={chartdata()}
                      categories={["Performance"]}
                      index={"month"}
                      colors={["yellow"]}
                      className="md:h-full md:w-36 lg:w-48 xl:w-60 2xl:w-72"
                    />
                  </div>

                  <div className="flex flex-row md:flex-col gap-1 md:gap-0.5">
                    <Link className={buttonVariants({ variant: "outline", size: "icon" })} href={`/app/posts/${post.id}`} passHref prefetch>
                      <Edit size={16} />
                    </Link>

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
          </div>
        </ClientOnly>
      </div>

      <pre>
        {/* {JSON.stringify(organizations, null, 2)} */}
      </pre>
    </>
  );
};

const SkeletonPlaceholder = (): ReactElement => (
  <div className="flex flex-col gap-1.5 mb-4">
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