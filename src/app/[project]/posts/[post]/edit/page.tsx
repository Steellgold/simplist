import type { AsyncComponent } from "@/components/utils/component";
import { db } from "@/utils/db/prisma";
import { UpdatePost } from "./editor";

type PageProps = {
  params: {
    project: string;
    post: string;
  };
};

const EditPost: AsyncComponent<PageProps> = async({ params }) => {
  const { project, post } = params;

  const posts = await db.post.findFirst({
    where: { slug: post, projectId: project },
    include: { metadata: true }
  });
  if (!posts) return <div>Post not found</div>;

  return (
    <UpdatePost
      banner={posts.banner}
      content={posts.content}
      lang={posts.lang}
      projectId={project}
      excerpt={posts.excerpt}
      metadata={posts.metadata.map((meta) => ({
        key: meta.key,
        type: meta.type.toLowerCase() as "string" | "number" | "boolean",
        value: meta.value as string | number | boolean,
        old: true
      }))}
      postId={posts.id}
      status={posts.status}
      title={posts.title}
    />
  );
};

export default EditPost;