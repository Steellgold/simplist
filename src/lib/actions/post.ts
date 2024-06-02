"use server";

import { env } from "@/env.mjs";
import type { PostSchema } from "@/schemas/post";
import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import type { Meta } from "@prisma/client";
import { type Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const savePost = async(id: string | null, data: z.infer<typeof PostSchema>): Promise<{ success: boolean; message?: string }> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  const response = await fetch(`${env.NEXT_PUBLIC_APP_URL}/auth/is-allowed?projectId=${data.projectId}&userId=${user?.id}`);
  const schema = z.object({ isAllowed: z.boolean() }).safeParse(await response.json());

  if (!schema.success) return { success: false, message: "Failed to check if you are allowed to perform this action" };
  if (!schema.data.isAllowed) return { success: false, message: `You are not allowed to ${id ? "update" : "create"} this post` };

  let postData;
  if (id) {
    const post = await db.$queryRaw<Post | null>`SELECT * FROM "Post" WHERE id = ${id}`;
    if (!post) return { success: false, message: "Post not found" };

    const oldMetadata = await db.$queryRaw<Meta[]>`SELECT * FROM "Meta" WHERE "postId" = ${id}`;

    const metadataToDelete = oldMetadata.filter((meta) => !data.metadata?.find((newMeta) => newMeta.id === meta.id));
    const metadataToCreate = data.metadata?.filter((newMeta) => !oldMetadata.find((meta) => meta.id === newMeta.id));

    if (metadataToDelete.length) {
      await db.$queryRaw`DELETE FROM "Meta" WHERE id = ANY(${metadataToDelete.map((meta) => meta.id)})`;
    }

    if (metadataToCreate?.length) {
      await db.meta.createMany({
        // @ts-ignore: createdAt, updatedAt, and id are not present (normal, as we're creating a new record here)
        data: metadataToCreate.map((meta: Meta) => ({
          ...meta,
          postId: id,
          type: meta.type
        }))
      });
    }

    postData = await db.post.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        status: data.status,
        banner: data.banner
      }
    });
  } else {
    postData = await db.post.create({
      data: {
        content: data.content,
        excerpt: data.excerpt,
        title: data.title,
        status: data.status,
        banner: data.banner,
        slug: data.slug,
        author: { connect: { id: user.id } },
        project: { connect: { id: data.projectId } }
      }
    });

    if (!postData) return { success: false, message: "Failed to create a new post" };
  }

  revalidatePath(`/${postData.projectId}/posts`);
  redirect(`/${postData.projectId}/posts${id ? "" : `/${postData.id}`}`);

  return { success: true };
};

export const deletePost = async(id: string, projectId: string): Promise<{ success: boolean; message?: string }> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  const response = await fetch(`${env.NEXT_PUBLIC_APP_URL}/auth/is-allowed?projectId=${projectId}&userId=${user?.id}`);
  const schema = z.object({ isAllowed: z.boolean() }).safeParse(await response.json());

  if (!schema.success) return { success: false, message: "Failed to check if you are allowed to delete this post" };
  if (!schema.data.isAllowed) return { success: false, message: "You are not allowed to delete this post" };

  const post = await db.$queryRaw<Post | null>`SELECT * FROM "Post" WHERE id = ${id}`;
  if (!post) return { success: false, message: "Post not found" };

  await db.post.delete({ where: { id } });
  await supabase.storage.from("banners").remove([`${post.projectId}/${post.id}`]);

  revalidatePath(`/${projectId}/posts`);
  redirect(`/${projectId}/posts`);
};