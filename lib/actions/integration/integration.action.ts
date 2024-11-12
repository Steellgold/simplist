"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { type GetIntegrationType, GetIntegration } from "./integration.types";
import prisma from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

export const getIntegration = async(id: string): Promise<GetIntegrationType | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.integration.findFirst({
    where: { id, organizationId: session?.session.activeOrganizationId },
    select: GetIntegration.select
  });
};

export const getIntegrations = async(): Promise<GetIntegrationType[]> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.integration.findMany({
    where: {
      organizationId: session?.session.activeOrganizationId
    },
    select: GetIntegration.select
  });
};

export const createIntegration = async(data: Prisma.IntegrationCreateInput): Promise<GetIntegrationType> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.integration.create({
    data: { ...data },
    select: GetIntegration.select
  });
};

export const deleteIntegration = async(id: string): Promise<GetIntegrationType> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return prisma.integration.delete({
    where: { id },
    select: GetIntegration.select
  });
};