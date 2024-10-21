"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreadcrumbStore } from "@/hooks/use-breadcrumb";
import { useGetPosts } from "@/lib/actions/post/post.hook";
import { useActiveOrganization } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { TagColor } from "@prisma/client";
import { Copy, Hash, Pen, Tag, Trash2 } from "lucide-react";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";

const Page = (): ReactElement => {
  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);
  const { data, isPending } = useActiveOrganization();
  const { data: postsData, isPending: postsPending, refetch, isRefetching } = useGetPosts();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (data) {
      refetch();
    }
  }, [data, refetch]);

  useEffect(() => {
    setBreadcrumb([{ href: "/app", label: "Overview" }], "Posts");
  }, [setBreadcrumb]);

  return (
    <div className="container">
      <div className="flex flex-col gap-1.5 mb-4">
        {isPending || postsPending ? (
          <>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-32" />
            ))}
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Posts</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{postsData?.length} post(s) found</p>
            </div>

            <Input type="search" placeholder="Search posts" className="w-72" />
          </div>
        )}

        {postsData?.map((post) => (
          <Card key={post.id} className="mt-4">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.exerpt}</CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-between gap-1">
              <div className="flex gap-1">
                {post.categories.map((category) => (
                  <span key={category.id} className="flex gap-1 text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    <Hash size={14} />
                    {category.name}
                  </span>
                ))}

                {post.tags.map((tag) => (
                  <span key={tag.id} className={cn("flex gap-1 text-xs px-2 py-1 rounded-full", {
                    "bg-red-500 dark:bg-red-600 text-white": tag.color === TagColor.RED,
                    "bg-blue-500 dark:bg-blue-600 text-white": tag.color === TagColor.BLUE,
                    "bg-green-500 dark:bg-green-600 text-white": tag.color === TagColor.GREEN,
                    "bg-yellow-500 dark:bg-yellow-600 text-white": tag.color === TagColor.YELLOW,
                    "bg-orange-500 dark:bg-orange-600 text-white": tag.color === TagColor.ORANGE,
                    "bg-purple-500 dark:bg-purple-600 text-white": tag.color === TagColor.PURPLE,
                    "bg-pink-500 dark:bg-pink-600 text-white": tag.color === TagColor.PINK,
                    "bg-[#1E1E1E] text-white": tag.color === TagColor.BLACK,
                    "bg-white text-black": tag.color === TagColor.WHITE
                  })}>
                    <Tag size={14} />
                    <span className="hidden sm:block">{tag.name}</span>
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                <Link className={buttonVariants({ variant: "outline", size: "icon" })} href={"/app/posts/" + post.id}>
                  <Pen />
                </Link>

                <Button variant="outline" size="icon">
                  <Trash2 />
                </Button>

                <Button variant="outline" size="icon">
                  <Copy />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Page;