"use client";

import type { Component } from "@/components/component";
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
import type { GetPostType } from "@/lib/actions/post/post.types";
import { useActiveOrganization } from "@/lib/auth/client";
import type { Organization  } from "@/lib/ba.types";
import { dayJS } from "@/lib/day-js";
import { cn } from "@/lib/utils";
import { Archive, Copy, Edit } from "lucide-react";
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
      {postsPending ? <SkeletonHeader /> : <Header postsData={postsData as GetPostType[]} isRefetching={isRefetching} />}
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

const Header: Component<{ postsData: GetPostType[]; isRefetching: boolean }> = ({ postsData, isRefetching }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold">Posts</h1>
      <p className="text-sm text-muted-foreground">{postsData?.length} post(s) found</p>
    </div>
    <div className="flex flex-row gap-2 sm:gap-1">
      <Input type="search" placeholder="Search posts" className="w-72" />
      {postsData && postsData.length >= 1 && !isRefetching && (
        <Link className={buttonVariants({ variant: "default" })} href="posts/new">
          Create Post
        </Link>
      )}
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

const PostCard: Component<{ post: GetPostType; organization: Organization }> = ({ post, organization }) => (
  <Card className={cn("flex flex-col md:flex-row justify-between")}>
    <div className="flex flex-col md:flex-row">
      <div className="p-5 -mb-6 md:mb-0">
        <ImageWrapper title={post.title} />
      </div>
      <CardHeader className="flex flex-col md:flex-row">
        <PostDetails post={post} organization={organization} />
      </CardHeader>
    </div>
    <CardFooter className="flex justify-between p-5 gap-2 justify-end">
      <PostChart />
      <PostActions postSlug={post.slug} />
    </CardFooter>
  </Card>
);

const ImageWrapper: Component<{ title: string }> = ({ title }) => (
  <div className="relative w-full h-52 md:w-56 md:h-full">
    <Image src="https://placehold.co/600x500/png" alt={title} fill className="rounded-lg object-cover" />
  </div>
);

const PostDetails: Component<{ post: GetPostType; organization: Organization }> = ({ post, organization }) => (
  <div className="flex flex-col justify-between gap-1">
    <div className="flex flex-col gap-1">
      <CardTitle className="line-clamp-1">{post.title}</CardTitle>
      <CardDescription className="line-clamp-1">{post.exerpt}</CardDescription>
      <CardDescription className="text-sm text-muted-foreground">
        Published on {dayJS(post.createdAt).format("DD MMM YYYY")}
        &nbsp;by {organization?.members.find((member) => member.id === post.author.id)?.user.name}
      </CardDescription>
    </div>
    <div className="flex gap-1">
      {post.categories.map((category) => (
        <CategoryTag key={category.id} content={category.name} />
      ))}
      {post.tags.map((tag) => (
        <PostTag key={tag.id} color={tag.color} content={tag.name} />
      ))}
    </div>
  </div>
);

const PostChart = (): ReactElement => (
  <div className="bg-primary/5 rounded-lg w-full h-full hidden md:block">
    <SparkAreaChart
      data={generateChartData()}
      categories={["Performance"]}
      index="month"
      colors={["yellow"]}
      className="md:h-full md:w-36 lg:w-48 xl:w-60 2xl:w-72"
    />
  </div>
);

const PostActions = ({ postSlug }: { postSlug: string }): ReactElement => (
  <div className="flex flex-row md:flex-col gap-1 md:gap-0.5">
    <Link className={buttonVariants({ variant: "outline", size: "icon" })} href={`/app/posts/${postSlug}`} passHref prefetch>
      <Edit size={16} />
    </Link>
    <Button variant="outline" size="icon">
      <Copy size={16} />
    </Button>
    <Button variant="outline" size="icon">
      <Archive size={16} />
    </Button>
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