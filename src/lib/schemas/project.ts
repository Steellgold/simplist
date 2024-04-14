import { z } from "zod";

export const ProjectSchema = z.object({
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(255, { message: "Name must be at most 255 characters long" })
});