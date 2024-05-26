"use server";

import { env } from "@/env.mjs";
import type { PostSchema } from "@/schemas/post";
import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import type { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const updatePost = async(id: string, data: z.infer<typeof PostSchema>): Promise<{ success: boolean; message?: string }> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  const response = await fetch(`${env.NEXT_PUBLIC_APP_URL}/auth/is-allowed?projectId=${data.projectId}&userId=${user?.id}`);
  const schema = z.object({ isAllowed: z.boolean() }).safeParse(await response.json());

  if (!schema.success) return { success: false, message: "Failed to check if you are allowed to update this project" };
  if (!schema.data.isAllowed) return { success: false, message: "You are not allowed to update this project" };

  const post = await db.$queryRaw<Post | null>`SELECT * FROM "Post" WHERE id = ${id}`;
  if (!post) return { success: false, message: "Post not found" };

  const postData = await db.post.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      status: data.status,
      banner: data.banner
    }
  });

  revalidatePath(`/${postData.projectId}/posts`);
  redirect(`/${postData.projectId}/posts`);
};