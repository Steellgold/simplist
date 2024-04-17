import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page.layout";
import type { AsyncComponent, Component } from "@/components/utils/component";
import { db } from "@/utils/db/prisma";
import { NotebookPen } from "lucide-react";
import Link from "next/link";

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
      actions={(
        <Button asChild>
          <Link href={`/${project}/posts/new`}>
            <NotebookPen size={16} className="mr-2" />
            Create Post
          </Link>
        </Button>
      )}
    >
    </PageLayout>
  );
};

const NoPosts: Component<PageProps> = ({ params }) => {
  return (
    <PageLayout title="Posts" projectId={params.project}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You have no posts
        </h3>
        <p className="text-sm text-muted-foreground">You can start writing as soon as you add a post.</p>
        <Button className="mt-4">Add Post</Button>
      </div>
    </PageLayout>
  );
};

export default Posts;