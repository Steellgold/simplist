import { z } from "zod";

export const PostSchema = z.object({
  slug: z.string().optional().nullable(),
  rewriteSlug: z.boolean().optional().nullable(),
  title: z.string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(255, { message: "Title must be at most 255 characters long" }),
  excerpt: z.string()
    .min(3, { message: "Excerpt must be at least 3 characters long" })
    .max(255, { message: "Excerpt must be at most 255 characters long" }),
  content: z.string()
    .min(3, { message: "Content must be at least 3 characters long" })
    .max(100000, { message: "Content must be at most 100000 characters long" }),
  metadata: z.array(z.object({
    id: z.string().optional().nullable(),
    key: z.string()
      .min(3, { message: "Key must be at least 3 characters long" })
      .max(255, { message: "Key must be at most 255 characters long" }),
    type: z.string()
      .min(3, { message: "Type must be at least 3 characters long" })
      .max(255, { message: "Type must be at most 255 characters long" }),
    value: z.union([
      z.boolean(),
      z.number(),
      z.string()
    ]),
    postId: z.string().optional().nullable()
  })).optional().nullable(),
  banner: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  projectId: z.string().optional().nullable(),
  lang: z.string().default("EN")
});
