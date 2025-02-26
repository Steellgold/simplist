"use server";

import { ProjectSchema } from "@/schemas/project";
import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import type { Project } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { z } from "zod";

export const createProject = async(values: z.infer<typeof ProjectSchema>): Promise<Project | {
  title: string;
  message: string;
}> => {
  const validatedFields = ProjectSchema.safeParse(values);

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { title: "Error", message: "An error occurred!" };
  if (!validatedFields.success) return { title: "Invalid Fields", message: "Invalid fields provided!" };

  const { name } = validatedFields.data;

  const data = await db.project.create({
    data: {
      name,
      user: {
        connect: { id: user.id }
      }
    }
  });

  revalidatePath("/");

  if (data) return data;
  return { title: "Error", message: "An error occurred!" };
};