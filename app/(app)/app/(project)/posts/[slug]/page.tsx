/* eslint-disable @typescript-eslint/await-thenable */
import { BreadcrumbUpdater } from "@/components/breadcrumbUpdater";
import type { AsyncComponent } from "@/components/component";
import { Editor } from "@/components/editor";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getPostBySlug } from "@/lib/actions/post/post.action";
import type { GetPostType } from "@/lib/actions/post/post.types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type PageProps = {
  params: {
    slug: string;
  };
};

const Page: AsyncComponent<PageProps> = async({ params }) => {
  const { slug } = await params;

  const post: GetPostType = await getPostBySlug(slug);
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
        posts={[
          {
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            lang: post.lang,
            banner: post.files.find(file => file.isBanner) || null
          },
          ...post.variants.map(variant => ({
            title: variant.title, content: variant.content, excerpt: variant.excerpt, lang: variant.lang, variantId: variant.id
          }))
        ]}
        dbId={post.id}
      />
    </>
  );
};

export default Page;