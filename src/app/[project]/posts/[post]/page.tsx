import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page.layout";
import type { AsyncComponent } from "@/components/utils/component";
import { db } from "@/utils/db/prisma";
import { NotebookPen } from "lucide-react";
import { NotFound } from "@/components/errors";

type PageProps = {
  params: {
    project: string;
    post: string;
  };
};

const Post: AsyncComponent<PageProps> = async({ params }) => {
  const { project, post: postId } = params;

  const post = await db.post.findUnique({ where: { projectId: project, id: postId } });
  if (!post) return <PageLayout title="" error>
    <NotFound replacePageTo="post" />
  </PageLayout>;

  return (
    <PageLayout
      title={post ? post.title : "Post"}
      description={post ? post.content.slice(0, 100) : "Review your post and make changes by clicking on the button below."}
      projectId={project}
      actions={post ? (
        <Button>
          <NotebookPen size={16} className="mr-2" />
          Edit Post
        </Button>
      ) : <></>}
    >
      {post ? (<p>{post.content}</p>) : <NotFound replacePageTo="post" />}
    </PageLayout>
  );
};

export default Post;