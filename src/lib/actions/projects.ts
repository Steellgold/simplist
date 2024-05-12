"use server";

import { ProjectSchema } from "@/schemas/project";
import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import type { Project } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";

export const createProject = async(values: z.infer<typeof ProjectSchema>): Promise<Project | null> => {
  const validatedFields = ProjectSchema.safeParse(values);

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;
  if (!validatedFields.success) return null;

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
  if (data) redirect(`/${data.id}/posts`);
  else return null;
};