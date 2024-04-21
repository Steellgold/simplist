import type { AsyncComponent } from "@/components/utils/component";
import { db } from "@/utils/db/prisma";
import { UpdatePost } from "./editor";
import { PageLayout } from "@/components/page.layout";

type PageProps = {
  params: {
    project: string;
    post: string;
  };
};

const EditPost: AsyncComponent<PageProps> = async({ params }) => {
  const { project, post: postSlug } = params;

  const post = await db.post.findFirst({
    where: { slug: postSlug, projectId: project },
    include: { metadata: true }
  });
  if (!post) return <div>Post not found</div>;

  console.log(post);

  return (
    <PageLayout center={false} bordered={false}>
      <UpdatePost
        slug={post.slug}
        banner={post.banner}
        content={post.content}
        lang={post.lang}
        projectId={project}
        excerpt={post.excerpt}
        metadata={post.metadata.map((meta) => ({
          key: meta.key,
          type: meta.type.toLowerCase() as "string" | "number" | "boolean",
          value: meta.value as string | number | boolean,
          old: true
        }))}
        postId={post.id}
        status={post.status}
        title={post.title}
      />
    </PageLayout>
  );
};

export default EditPost;