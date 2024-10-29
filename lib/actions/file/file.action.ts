"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db/prisma";
import { GetFile, type GetFileType } from "./file.types";

export const getFiles = async(): Promise<GetFileType[]> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const data = await prisma.file.findMany({
    where: {
      organizationId: session?.session.activeOrganizationId
    },
    include: GetFile.include
  });

  return data;
};