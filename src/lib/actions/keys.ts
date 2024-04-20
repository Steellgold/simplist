"use server";

import { dayJS } from "@/dayjs/day-js";
import { APIKeySchema } from "@/schemas/project";
import { db } from "@/utils/db/prisma";
import { redis } from "@/utils/db/upstash";
import { createClient } from "@/utils/supabase/server";
import type { APIKey } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { z } from "zod";

export const generateKey = async(values: z.infer<typeof APIKeySchema>): Promise<APIKey | { title: string; message: string }> => {
  const validatedFields = APIKeySchema.safeParse(values);

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { title: "Error", message: "An error occurred!" };
  if (!validatedFields.success) return { title: "Invalid Fields", message: "Invalid fields provided!" };

  const { name } = validatedFields.data;

  const data = await db.aPIKey.create({
    data: {
      name,
      status: "ACTIVE",
      note: values.note || "",
      key: generateSecret(),
      project: { connect: { id: values.projectId! } },
      author: { connect: { id: user.id } }
    }
  });

  await redis.set(`api_key:${data.key}`, {
    id: data.id,
    projectId: data.projectId,
    authorId: data.authorId,
    status: data.status
  });

  revalidatePath(`/${values.projectId}/keys`);

  if (data) return data;
  return { title: "Error", message: "An error occurred!" };
};

export const deactivateKey = async(keyId: string, projectId: string): Promise<boolean | { title: string; message: string }> => {
  const data = await db.aPIKey.update({
    where: { id: keyId, projectId: projectId },
    data: { status: "INACTIVE", disabledAt: dayJS().toDate() }
  });

  // TODO: Disable key in Redis

  revalidatePath(`/${projectId}/keys`);

  if (data) return true;
  return { title: "Error", message: "An error occurred!" };
};

const generateSecret = (): string => {
  let d = dayJS().valueOf();
  return "xxxxxxxxxxxx".replace(/[x]/g, () => {
    const r: number = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return r.toString(16);
  });
};