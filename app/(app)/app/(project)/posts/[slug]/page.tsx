/* eslint-disable @typescript-eslint/await-thenable */
import { BreadcrumbUpdater } from "@/components/breadcrumbUpdater";
import type { AsyncComponent } from "@/components/component";
import { Editor } from "@/components/editor/editor";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getPostBySlug } from "@/lib/actions/post/post.action";
import type { GetPostType } from "@/lib/actions/post/post.types";
import { dayJS } from "@/lib/day-js";
import type { Lang } from "@/lib/lang";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type PageProps = {
  params: {
    slug: string;
  };
};

const Page: AsyncComponent<PageProps> = async({ params }) => {
  const { slug } = await params;

  const post: GetPostType | null = await getPostBySlug(slug);
  if (!post) return (
    <>
      <BreadcrumbUpdater links={[{ href: "/app", label: "Overview" }, { href: "/app/posts", label: "Posts" }]} title={slug} />

      <EmptyState
        title="Post not found"
        description="The post you are looking for does not exist."
        actions={[
          <Link className={buttonVariants({ variant: "outline" })} href="/app/posts" key="back">
            <ArrowLeft size={16} />
            Back to posts
          </Link>
        ]}
      />
    </>
  );

  return (
    <>
      <BreadcrumbUpdater links={[
        { href: "/app", label: "Overview" },
        { href: "/app/posts", label: "Posts" }
      ]} title={slug} />

      <Editor
        isNew={false}
        // Idk why TypeScript is angry about this, but it works :/
        posts={[
          {
            title: post.title,
            content: post.content,
            banner: post.files && post.files[0] ? {
              id: post.files[0].id as string,
              url: post.files[0].url as string,
              name: post.files[0].name as string,
              size: post.files[0].size as number,
              type: post.files[0].mimeType as string,
              uploadedAt: dayJS(post.files[0].createdAt).toDate(),
              uploadedBy: post.files[0].authorId ? post.files[0].authorId : ""
            } : null,
            excerpt: post.excerpt as string,
            lang: post.lang as Lang
          },
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          ...post.variants.map(variant => ({
            // eslint-disable-next-line @typescript-eslint  /no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            title: variant.title,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            content: variant.content,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            excerpt: variant.excerpt as string,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            lang: variant.lang as Lang,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            variantId: variant.id,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            banner: variant.files && variant.files[0] ? {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              id: variant.files[0].id as string,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              url: variant.files[0].url as string,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              name: variant.files[0].name as string,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              size: variant.files[0].size as number,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              type: variant.files[0].mimeType as string,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              uploadedAt: dayJS(variant.files[0].createdAt).toDate(),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              uploadedBy: variant.files[0].authorId ? variant.files[0].authorId : ""
            } : null
          }))
        ]}
        dbId={post.id}
      />
    </>
  );
};

export default Page;