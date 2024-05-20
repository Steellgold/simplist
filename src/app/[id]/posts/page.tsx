"use client";

import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/page.layout";
import { usePostsViewStore } from "@/store/posts-view.store";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flag, Grid3X3, MessagesSquare, PenBox, Rows3, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/utils";
import { CustomCard } from "@/components/ui/custom-card";
import Image from "next/image";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

type PageParams = {
  params: {
    id: string;
  };
};

type Post = Prisma.PostGetPayload<{
  select: {
    id: true;
    title: true;
    excerpt: true;
    banner: true;
    createdAt: true;
    updatedAt: true;
    lang: true;
    metadata: true;
    status: true;
    comments: {
      select: {
        id: true;
      };
    };
    variants: {
      select: {
        id: true;
        lang: true;
      };
    };
  };
}>;

const ProjectPosts = ({ params: { id } }: PageParams): ReactElement => {
  const { toggle, view } = usePostsViewStore();

  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchPosts = async(): Promise<void> => {
      const response = await fetch(`/api/user/projects/posts?projectId=${id}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setPosts(data?.posts ?? []);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setFilteredPosts(data?.posts ?? []);
      setIsLoading(false);
    };

    void fetchPosts();
  }, [id]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value.toLowerCase();
    const filtered = posts.filter((post) => post.title.toLowerCase().includes(value));
    setFilteredPosts(filtered);
  };

  return (
    <PageLayout projectId={id}>
      <div className="flex justify-between mb-4 gap-3">
        <Input placeholder="Search a post" type="search" disabled={isLoading || !posts.length} onChange={handleSearch} />

        <Tabs defaultValue={view} onValueChange={toggle} className="hidden sm:flex gap-3">
          <TabsList>
            <TabsTrigger value="grid" disabled={isLoading || !posts.length}>
              <Grid3X3 className="w-5" />
            </TabsTrigger>
            <TabsTrigger value="list" disabled={isLoading || !posts.length}>
              <Rows3 className="w-5" />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button className="flex gap-1" variant="default">
          <PenBox className="w-4" />
          New Post
        </Button>
      </div>
      <div className={cn("w-full gap-3", {
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3": view === "grid",
        "grid grid-cols-1": view === "list"
      })}>
        {isLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="p-4 rounded shadow h-48" />
            ))}
          </>
        ) : (
          <>
            {filteredPosts.map((post, index) => (
              <Link href={`/${id}/posts/${post.id}`} key={index}>
                <CustomCard className="p-4 rounded shadow">
                  {view === "grid" && (
                    <>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription className="mb-1.5">
                        {post.excerpt.slice(0, 100)}
                        {post.excerpt.length > 100 && "..."}
                      </CardDescription>
                      {post.banner ? (
                        <Image
                          src={post.banner}
                          alt={post.title}
                          className="w-full h-40 object-cover rounded-md"
                          width={400}
                          height={200}
                        />
                      ) : (
                        <div className="w-full h-40 bg-[#131313] rounded-md flex items-center justify-center select-none">
                          <p className="text-white text-center">
                            No banner found
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {view === "list" && (
                    <div className="flex gap-3 flex flex-col sm:flex-row">
                      {post.banner ? (
                        <div>
                          <Image
                            src={post.banner}
                            alt={post.title}
                            className="w-full sm:w-40 h-30 object-cover rounded-md"
                            width={200}
                            height={200} />
                        </div>
                      ) : (
                        <div className="w-40 h-30 bg-[#131313] rounded-md flex items-center justify-center select-none">
                          <p className="text-white text-center">
                            No banner found
                          </p>
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription>{post.excerpt.slice(0, 250)}{post.excerpt.length > 250 && "..."}</CardDescription>
                      </div>
                    </div>
                  )}

                  <div className={cn("flex gap-2 text-muted-foreground mt-3", {
                    "justify-between": view === "grid",
                    "justify-start gap-5": view === "list"
                  })}>
                    <div className="flex gap-1 items-center">
                      <ThumbsUp className="w-4" />
                      {/* <span>{post.likes * 3}</span> */}
                    </div>
                    <div className="flex gap-1 items-center">
                      <ThumbsDown className="w-4" />
                      {/* <span>{post.likes}</span> */}
                    </div>
                    {post.variants.length >= 1 && (
                      <div className="flex gap-1 items-center">
                        <Flag className="w-4" />
                        <span>{post.variants.length}</span>
                      </div>
                    )}
                    <div className="flex gap-1 items-center">
                      <MessagesSquare className="w-4" />
                      <span>{post.comments.length ?? 0}</span>
                    </div>
                  </div>
                </CustomCard>
              </Link>
            ))}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ProjectPosts;