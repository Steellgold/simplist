import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page.layout";
import type { AsyncComponent, Component } from "@/components/utils/component";
import { db } from "@/utils/db/prisma";
import { BarChart2, NotebookPen, Pen } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { dayJS } from "@/dayjs/day-js";

type PageProps = {
  params: {
    project: string;
  };
};

const Posts: AsyncComponent<PageProps> = async({ params }) => {
  const { project } = params;

  const posts = await db.post.findMany({ where: { projectId: project } });
  if (posts.length === 0) return <NoPosts params={params} />;

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
        <Card>
          <div className="mt-3"></div>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Total Views</TableHead>
                  <TableHead className="hidden md:table-cell">Created at</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Product image"
                        className="aspect-video rounded-md object-cover"
                        src={post.banner ?? "/_static/no-image.png"}
                        width="320"
                        height="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {post.title.length > 50 ? post.title.slice(0, 50) + "..." : post.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={post.status === "DRAFT" ? "outline" : "default"}>
                        {post.status === "DRAFT" ? "Draft" : "Published"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        1.2k views
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {dayJS(post.createdAt).format("MMM D, YYYY")}
                    </TableCell>
                    <TableCell className="flex gap-2 mt-1">
                      <Button variant="outline" size={"icon"} asChild>
                        <Link href={`/${project}/posts/${post.id}/edit`}>
                          <Pen size={16} />
                        </Link>
                      </Button>

                      <Button variant="outline" size={"icon"} asChild>
                        <Link href={`/${project}/posts/${post.id}/stats`}>
                          <BarChart2 size={16} />
                        </Link>
                      </Button>
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