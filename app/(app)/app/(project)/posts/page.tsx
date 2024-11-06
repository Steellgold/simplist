"use client";

import type { Component } from "@/components/component";
import { PostCard } from "@/components/post-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { ClientOnly } from "@/components/ui/client-only";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreadcrumbStore } from "@/hooks/use-breadcrumb";
import { useGetPosts } from "@/lib/actions/post/post.hook";
import type { GetPostType } from "@/lib/actions/post/post.types";
import { useActiveOrganization } from "@/lib/auth/client";
import type { Organization  } from "@/lib/ba.types";
import { dayJS } from "@/lib/day-js";
import Link from "next/link";
import type { ReactElement } from "react";
import { useEffect } from "react";

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

const SkeletonPlaceholder = (): ReactElement => (
  <div className="flex flex-col gap-1.5 mb-4">
    {Array.from({ length: 5 }, (_, index) => (
      <Skeleton key={index} className="h-32" />
    ))}
  </div>
);

const PageSkeleton = (): ReactElement => (
  <div className="flex flex-col gap-1.5 mb-4">
    <SkeletonHeader />
    <SkeletonPlaceholder />
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