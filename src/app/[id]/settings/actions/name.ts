"use server";

import { env } from "@/env.mjs";
import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import type { Project } from "@prisma/client";
import { z } from "zod";

export const updateName = async(id: string, name: string): Promise<{
  success: boolean;
  message?: string;
}> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "You are not logged in" };
  if (!id) return { success: false, message: "Project ID is required" };

  const response = await fetch(`${env.NEXT_PUBLIC_APP_URL}/auth/is-allowed?projectId=${id}&userId=${user?.id}`);
  const schema = z.object({ isAllowed: z.boolean() }).safeParse(await response.json());

  if (!schema.success) return { success: false, message: "Failed to check if you are allowed to update this project" };
  if (!schema.data.isAllowed) return { success: false, message: "You are not allowed to update this project" };

  if (name === "") return { success: false, message: "Name cannot be empty" };
  if (name.length > 15) return { success: false, message: "Name cannot be longer than 15 characters" };
  if (name.length < 3) return { success: false, message: "Name cannot be shorter than 3 characters" };

  const data = await db.$executeRaw<Project>`UPDATE "Project" SET name = ${name} WHERE id = ${id}`;
  if (!data) return { success: false, message: "Failed to update name" };

  return { success: true, message: "Name updated successfully" };
};