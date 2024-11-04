"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import type { GetPostType } from "./post.types";
import { GetPost } from "./post.types";
import prisma from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

export const getPost = async(id: string): Promise<GetPostType | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.post.findFirst({
    where: { id },
    include: GetPost.include
  });
};

export const getPostBySlug = async(slug: string): Promise<GetPostType | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.post.findFirst({
    where: {
      slug,
      organizationId: session?.session.activeOrganizationId
    },
    include: GetPost.include
  });
};

export const getPosts = async(): Promise<GetPostType[]> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.post.findMany({
    where: {
      organizationId: session?.session.activeOrganizationId
    },
    include: GetPost.include
  });
};

export const updatePost = async(id: string, data: Prisma.PostUpdateInput): Promise<GetPostType> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.post.update({
    where: { id },
    data: { ...data },
    include: GetPost.include
  });
};

export const createPost = async(data: Prisma.PostCreateInput): Promise<GetPostType> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.post.create({
    data: { ...data },
    include: GetPost.include
  });
};

export const deletePost = async(id: string): Promise<GetPostType> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // TODO: Delete Redis cache, analytics, etc.

  return prisma.post.delete({
    where: { id },
    include: GetPost.include
  });
};