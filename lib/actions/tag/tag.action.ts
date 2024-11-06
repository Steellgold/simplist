"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db/prisma";
import type { GetTagType } from "./tag.types";

export const getTag = async(id: string): Promise<GetTagType | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.tag.findFirst({
    where: { id }
  });
};

export const getTags = async(): Promise<GetTagType[]> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.tag.findMany({
    where: {
      organizationId: session.session.activeOrganizationId
    }
  });
};