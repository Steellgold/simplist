"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import type { GetKeyType } from "./key.types";
import { redis } from "@/lib/db/redis";
import { apiKey } from "@/lib/utils";

export const getKeys = async(): Promise<GetKeyType[]> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return (await redis.keys(`key:${session.session.activeOrganizationId}:*`)).map((key: string) => {
    return {
      key: key,
      createdAt: "",
      lastUsedAt: "",
      memberId: ""
    };
  });
};

export const createKey = async(): Promise<GetKeyType> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const keyData = {
    organizationId: session.session.activeOrganizationId,
    key: apiKey(32),
    createdAt: new Date().toISOString(),
    lastUsedAt: "",
    memberId: session.session.userId
  };

  await redis.set(`key:${keyData.key}`, JSON.stringify(keyData));
  return keyData;
};