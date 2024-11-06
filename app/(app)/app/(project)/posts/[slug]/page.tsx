/* eslint-disable @typescript-eslint/await-thenable */
import { BreadcrumbUpdater } from "@/components/breadcrumbUpdater";
import type { AsyncComponent } from "@/components/component";
import { Editor } from "@/components/editor/editor";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getPostBySlug } from "@/lib/actions/post/post.action";
import type { GetPostType } from "@/lib/actions/post/post.types";
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
    <div className="p-5">
      <BreadcrumbUpdater links={[
        { href: "/app", label: "Overview" },
        { href: "/app/posts", label: "Posts" }
      ]} title={slug} />

      <Editor
        isNew={false}
        posts={[
          {
            title: post.title,
            content: post.content,
            banner: post.banner ? {
              id: post.banner.id,
              url: post.banner.url,
              name: post.banner.name,
              size: post.banner.size,
              type: post.banner.mimeType,
              uploadedAt: post.banner.createdAt,
              uploadedBy: post.banner.memberId
            } : null,
            excerpt: post.excerpt,
            lang: post.lang as Lang,
            tags: post.tags.map(tag => tag.id),
            metadatas: post.meta.map(metadata => ({
              id: metadata.id,
              key: metadata.key,
              value: metadata.value,
              type: metadata.type
            })),

            isScheduled: post.scheduledAt ? true : false,
            scheduledAt: post.scheduledAt ? post.scheduledAt : null
          },
          ...post.variants.map(variant => ({
            title: variant.title,
            content: variant.content,
            excerpt: variant.excerpt,
            lang: variant.lang as Lang,
            variantId: variant.id,
            tags: [],
            banner: variant.banner ? {
              id: variant.banner.id,
              url: variant.banner.url,
              name: variant.banner.name,
              size: variant.banner.size,
              type: variant.banner.mimeType,
              uploadedAt: variant.banner.createdAt,
              uploadedBy: variant.banner.memberId
            } : null,
            metadatas: []
          }))
        ]}
        dbId={post.id}
      />
    </div>
  );
};

export default Page;