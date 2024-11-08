"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import type { CreateKeyType, GetKeyType } from "./key.types";
import { redis } from "@/lib/db/redis";
import { apiKey } from "@/lib/utils";
import { getActiveMember } from "@/lib/auth/helper";
import { nanoid } from "nanoid";

export const getKeys = async(): Promise<GetKeyType[]> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const keys = await redis.get(`organization:${session.session.activeOrganizationId}:keys`) as string[];
  if (!keys) return [];

  const keyData = await Promise.all(keys.map(async(key) => {
    const keyData = await redis.get(`key:${key}`) as GetKeyType;
    keyData.key = keyData.key.slice(0, 8) + "...." + keyData.key.slice(-2);
    return keyData;
  }));

  return keyData;
};

export const createKey = async(data: CreateKeyType): Promise<GetKeyType> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const keyData = {
    organizationId: session.session.activeOrganizationId!,
    memberId: (await getActiveMember())!.id || "",

    key: apiKey(32),

    createdAt: new Date().toISOString(),
    lastUsedAt: "",

    active: true,

    name: data.name,
    note: data.note,
    expiresAt: data.expiresAt,

    LinkingKey: nanoid(16)
  };

  const keys = await redis.get(`organization:${keyData.organizationId}:keys`) as string[];
  if (!keys) await redis.set(`organization:${keyData.organizationId}:keys`, [keyData.key]);
  else await redis.set(`organization:${keyData.organizationId}:keys`, [...keys, keyData.key]);

  await redis.set(`key:${keyData.key}`, JSON.stringify(keyData));
  return keyData;
};

export const deleteKey = async(key: string): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const keyData = await redis.get(`key:${key}`) as GetKeyType;
  if (keyData.organizationId !== session.session.activeOrganizationId) throw new Error("Unauthorized");

  const keys = await redis.get(`organization:${keyData.organizationId}:keys`) as string[];
  await redis.set(`organization:${keyData.organizationId}:keys`, keys.filter(k => k !== key));
  await redis.del(`key:${key}`);
};

export const invalidateKey = async(key: string, secuValue: string): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const keys = await redis.keys(`key:${key.slice(0, 8)}*`);
  if (!keys.length) throw new Error("Invalid key");

  const keyData = await redis.get(keys[0]) as GetKeyType;
  if (keyData.LinkingKey !== secuValue) throw new Error("Invalid key");

  keyData.active = false;
  await redis.set(`key:${keyData.key}`, JSON.stringify(keyData));
};

// This function is called when a key is used (Only on the server side - API)
export const keyUse = async(key: string): Promise<void> => {
  const keyData = await redis.get(`key:${key}`) as GetKeyType;
  keyData.lastUsedAt = new Date().toISOString();
  await redis.set(`key:${key}`, JSON.stringify(keyData));
};