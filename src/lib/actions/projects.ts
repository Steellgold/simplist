"use server";

import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import type { Project } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const ProjectSchema = z.object({
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(255, { message: "Name must be at most 255 characters long" })
});

export const createProject = async(values: z.infer<typeof ProjectSchema>): Promise<Project | {
  title: string;
  message: string;
}> => {
  console.log("aaa", values);
  const validatedFields = ProjectSchema.safeParse(values);
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { title: "Error", message: "An error occurred!" };
  if (!validatedFields.success) return { title: "Invalid Fields", message: "Invalid fields provided!" };

  const { name } = validatedFields.data;

  if (name == "aaa") return { title: "Invalid Name", message: "Invalid name provided!" };

  const data = await db.project.create({
    data: {
      name,
      user: {
        connect: { id: user.id }
      }
    }
  });

  console.log(data);

  revalidatePath("/");

  if (data) return data;
  return { title: "Error", message: "An error occurred!" };
};