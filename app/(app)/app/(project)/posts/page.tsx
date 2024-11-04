"use client";

import type { Component } from "@/components/component";
import { CategoryTag, PostTag } from "@/components/post-tag";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientOnly } from "@/components/ui/client-only";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SparkAreaChart } from "@/components/ui/tremor/spark-chart";
import { useBreadcrumbStore } from "@/hooks/use-breadcrumb";
import { useGetPosts } from "@/lib/actions/post/post.hook";
import type { GetPostType } from "@/lib/actions/post/post.types";
import { useActiveOrganization } from "@/lib/auth/client";
import type { Organization  } from "@/lib/ba.types";
import { dayJS } from "@/lib/day-js";
import { LANGUAGES } from "@/lib/lang";
import { cn } from "@/lib/utils";
import { Archive, Calendar, Copy, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { useEffect } from "react";

const generateChartData = (): { month: string; Performance: number }[] => Array.from({ length: 18 }, (_, index) => ({
  month: dayJS().subtract(17 - index, "months").format("MMM YY"),
  Performance: Math.floor(Math.random() * 100)
}));

const Page = (): ReactElement => {
  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);
  const { data: postsData, isPending: postsPending, refetch, isRefetching } = useGetPosts();
  const { data: organization, isRefetching: isOrgRefetching } = useActiveOrganization();

  useEffect(() => {
    if (organization) void refetch();
  }, [organization, refetch]);

  useEffect(() => {
    setBreadcrumb([{ href: "/app", label: "Overview" }], "Posts");
  }, [setBreadcrumb]);

  if (isOrgRefetching) return <PageSkeleton />;

  return (
    <div className="flex flex-col gap-1.5 mb-4">
      {postsPending ? <SkeletonHeader /> : <Header postsData={postsData as GetPostType[]} />}
      <ClientOnly fallback={<SkeletonPlaceholder />}>
        <PostContent
          postsData={postsData as GetPostType[]}
          postsPending={postsPending}
          organization={organization as unknown as Organization}
          isRefetching={isRefetching}
        />
      </ClientOnly>
    </div>
  );
};

const Header: Component<{ postsData: GetPostType[] }> = ({ postsData }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold">Posts</h1>
      <p className="text-sm text-muted-foreground">{postsData?.length} post(s) found</p>
    </div>
    <div className="flex flex-col md:flex-row gap-2 sm:gap-1 mt-2 md:mt-0">
      <Input type="search" placeholder="Search posts" className="w-full md:w-72" />

      <Button asChild>
        <Link href="/app/posts/new" className={buttonVariants({ variant: "default" })}>
          Create Post
        </Link>
      </Button>
    </div>
  </div>
);

const PostContent: Component<{
  postsData: GetPostType[];
  postsPending: boolean;
  organization: Organization;
  isRefetching: boolean
}> = ({ postsData, postsPending, organization, isRefetching }) => {
  if (!postsData || postsPending || isRefetching) return <SkeletonPlaceholder />;

  if (postsData.length === 0) {
    return (
      <EmptyState
        title="No posts found"
        description="Create a new post to get started"
        actions={[<Button key="create-post" variant="default" size="sm">Create Post</Button>]}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      {postsData
        .filter((post) => post.organizationId === organization?.id)
        .sort((a, b) => dayJS(b.createdAt).unix() - dayJS(a.createdAt).unix())
        .map((post) => (
          <PostCard key={post.id} post={post} organization={organization} />
        ))}
    </div>
  );
};

const PostCard: Component<{ post: GetPostType; organization: Organization }> = ({ post }) => (
  <Card className="relative overflow-hidden">
    <div className="absolute inset-0 z-0 hidden dark:block bg-black/40">
      <Image
        src={post.banner?.url || "/"}
        alt=""
        fill
        className="object-cover scale-110 blur-3xl opacity-40"
      />
    </div>

    <div className="relative z-10">
      <div className="flex flex-col md:flex-row justify-between">
        <CardHeader className="flex flex-col md:flex-row gap-3 md:gap-0">
          <div className="relative w-full h-52 md:w-[300px] md:h-[10rem]">
            <Image src={post.banner?.url || "/_static/placeholder.png"} alt={post.title} fill className="rounded-lg object-cover" />
          </div>

          <PostDetails post={post} />
        </CardHeader>
      </div>

      <CardFooter className="flex gap-1.5 overflow-x-auto">
        <div className="flex flex-row gap-1 md:gap-0.5">
          <Link className={buttonVariants({ variant: "outline", size: "icon" })} href={`/app/posts/${post.slug}`}>
            <Edit size={16} />
          </Link>
          <Button variant="outline" size="icon">
            <Copy size={16} />
          </Button>
          <Button variant="outline" size="icon">
            <Archive size={16} />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {!post.published && <Badge variant={"tag-default"}>Draft</Badge>}

        {post.scheduledAt && !post.published && (
          <Badge variant={"tag-default"}>
            <Calendar size={14} />
            Scheduled for {dayJS(post.scheduledAt).format("MMM DD, YYYY")}
          </Badge>
        )}

        {post.variants.length >= 1 && (
          <Badge variant={"tag-default"}>
            {post.variants.length} Variant{post.variants.length > 1 ? "s" : ""}
          </Badge>
        )}

        {post.categories.map((category) => (
          <CategoryTag key={category.id} content={category.name} />
        ))}

        {post.tags.map((tag) => (
          <PostTag key={tag.id} color={tag.color} content={tag.name} />
        ))}
      </CardFooter>
    </div>
  </Card>
);

const PostDetails: Component<{ post: GetPostType }> = ({ post }) => (
  <div className="flex flex-col gap-3 md:ml-4">
    <div className="flex flex-col gap-1">
      <CardTitle className="line-clamp-1">{post.title}</CardTitle>
      <CardDescription className="line-clamp-1">{post.excerpt}</CardDescription>
    </div>

    <div className={cn("relative w-full h-16 rounded-lg md:w-48 md:h-20", {
      "bg-primary/15 dark:bg-black/15": true,
      "dark:bg-primary/15": !post.banner?.url
    })}>
      <SparkAreaChart
        data={generateChartData()}
        categories={["Performance"]}
        index="month"
        colors={["yellow"]}
        className="w-full h-full"
      />
    </div>
  </div>
);

const SkeletonPlaceholder = (): ReactElement => (
  <div className="flex flex-col gap-1.5 mb-4">
    {Array.from({ length: 5 }, (_, index) => (
      <Skeleton key={index} className="h-32" />
    ))}
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

const PageSkeleton = (): ReactElement => (
  <div className="flex flex-col gap-1.5 mb-4">
    <SkeletonHeader />
    <SkeletonPlaceholder />
  </div>
);

export default Page;