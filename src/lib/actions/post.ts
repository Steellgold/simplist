"use server";

import { PostSchema } from "@/schemas/post";
import { db } from "@/utils/db/prisma";
import { redis } from "@/utils/db/upstash";
import { createClient } from "@/utils/supabase/server";
import type { Lang } from "@prisma/client";
import { type Meta, type Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import type { PostData } from "../../app/api/[id]/route";
import { slugify } from "@/slugify";

export const createPost = async(values: z.infer<typeof PostSchema>): Promise<Post | {
  title: string;
  message: string;
}> => {
  const validatedFields = PostSchema.safeParse(values);

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { title: "Error", message: "An error occurred!" };
  if (!validatedFields.success) return { title: "Invalid Fields", message: "Invalid fields provided!" };

  const { content, excerpt, title, status, banner, metadata, projectId, lang } = validatedFields.data;
  const slug = title + "-" + Math.random().toString(36).substring(7);

  if (!projectId) return { title: "Invalid Data", message: "Invalid project ID provided. Refresh the page and try again." };
  const project = await db.project.findFirst({ where: { id: projectId } });
  if (!project) return { title: "Invalid Data", message: "Invalid project ID provided. Refresh the page and try again." };

  const data = await db.post.create({
    data: {
      content,
      excerpt,
      status,
      title,
      banner,
      project: { connect: { id: projectId } },
      author: { connect: { id: user.id } },
      lang: lang.toUpperCase() as Lang,
      slug: slugify(slug)
    }
  });

  const postId = data.id;

  if (metadata) {
    // @ts-ignore: createdAt, updatedAt, and id are not present (normal, as we're creating a new record here)
    const metadataData = metadata.map((meta: Meta) => ({
      ...meta,
      postId,
      type: meta.type == "string" ? "string" : meta.type == "boolean" ? "BOOLEAN" : "NUMBER"
    }));
    // @ts-ignore
    await db.meta.createMany({ data: metadataData });
  }

  await redis.set(`post:${data.slug}`, {
    ...data,
    metadata: metadata || []
  });

  revalidatePath(`/${project.id}/posts`);
  throw redirect(`/${project.id}/posts`);
};

export const updatePost = async(id: string, values: z.infer<typeof PostSchema>): Promise<Post | {
  title: string;
  message: string;
}> => {
  const validatedFields = PostSchema.safeParse(values);

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { title: "Error", message: "An error occurred!" };
  if (!validatedFields.success) return { title: "Invalid Fields", message: "Invalid fields provided!" };

  const { content, excerpt, title, status, banner, metadata, lang, rewriteSlug } = validatedFields.data;

  const post = await db.post.findFirst({ where: { id } });
  if (!post) return { title: "Invalid Data", message: "Invalid post ID provided. Refresh the page and try again." };

  const potentialNewSlug = rewriteSlug ? slugify(title) : post.slug;

  const data = await db.post.update({
    where: { id },
    data: {
      slug: potentialNewSlug,
      content,
      excerpt,
      status,
      title,
      banner,
      lang: lang.toUpperCase() as Lang
    }
  });

  const oldMetadata = await db.meta.findMany({ where: { postId: id } });

  const metadataToDelete = oldMetadata.filter((meta) => !metadata?.some((m) => m.key == meta.key));
  const metadataToAdd = metadata?.filter((meta) => !oldMetadata.some((m) => m.key == meta.key));

  if (metadataToDelete.length) {
    await db.meta.deleteMany({ where: { id: { in: metadataToDelete.map((meta) => meta.id) } } });
  }

  if (metadataToAdd?.length) {
    // @ts-ignore: createdAt, updatedAt, and id are not present (normal, as we're creating a new record here)
    const metadataData = metadataToAdd.map((meta: Meta) => ({
      ...meta,
      postId: id,
      type: meta.type == "string" ? "string" : meta.type == "boolean" ? "boolean" : "number"
    }));
    // @ts-ignore
    await db.meta.createMany({ data: metadataData });
  }

  const calls = await redis.get(`post:${post.slug}`) as PostData;

  await redis.set(`post:${post.slug}`, {
    ...data,
    metadata: metadata || [],
    calls: calls.calls
  });

  if (rewriteSlug) await redis.rename(`post:${post.slug}`, `post:${potentialNewSlug}`);

  revalidatePath(`/${post.projectId}/posts`);
  throw redirect(`/${post.projectId}/posts`);
};

export const deletePost = async(id: string): Promise<void> => {
  const post = await db.post.findFirst({ where: { id } });
  if (!post) return;

  await db.post.delete({ where: { id } });
  await redis.del(`post:${post.slug}`);

  revalidatePath(`/${post.projectId}/posts`);
  throw redirect(`/${post.projectId}/posts`);
};