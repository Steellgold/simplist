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
      slug: slug
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
    }
  });

  console.log(data);

  const postId = data.id;

  if (metadata) {
    // @ts-ignore: createdAt, updatedAt, and id are not present (normal, as we're creating a new record here)
    const metadataData = metadata.map((meta: Meta) => ({
      ...meta,
      postId,
      type: meta.type == "STRING" ? "STRING" : meta.type == "BOOLEAN" ? "BOOLEAN" : "NUMBER"
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