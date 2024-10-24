"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import type { GetPostType } from "./post.types";
import { GetPost } from "./post.types";
import prisma from "@/lib/db";

export const getPost = async(id: string): Promise<GetPostType> => {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.post.findFirstOrThrow({
    where: { id },
    include: GetPost.include
  });
};

export const getPosts = async(): Promise<GetPostType[]> => {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.post.findMany({
    where: {
      organizationId: session?.session.activeOrganizationId
    },
    include: GetPost.include
  });
};