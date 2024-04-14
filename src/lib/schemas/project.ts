import { z } from "zod";

export const ProjectSchema = z.object({
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(255, { message: "Name must be at most 255 characters long" })
});

export const APIKeySchema = z.object({
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(10, { message: "Name must be at most 10 characters long" }),
  note: z.string()
    .max(30, { message: "Note must be at most 30 characters long" }),
  projectId: z.string().optional().nullable()
});