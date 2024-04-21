import { dayJS } from "@/dayjs/day-js";
import { env } from "@/env.mjs";
import type { KeyData } from "@/types";
import { redis } from "@/utils/db/upstash";

type LogCallProps = {
  key: string;
  projectId: string;
  slug: string;
  postId: string;
  ip: string;
  method: "GET";
  status: number;
};

export const logCall = ({ key, projectId, slug, postId, ip, method, status }: LogCallProps): void => {
  void fetch("https://api.tinybird.co/v0/events?name=api_calls", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${env.TINYBIRD_BEARER_TOKEN}`
    },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      key,
      projectId,
      slug,
      postId,
      ip,
      method,
      status
    })
  });

  if (key) void setKeyLU(key);
};

export const setKeyLU = async(key: string): Promise<void> => {
  const keyData = await redis.get(`api_key:${key}`) as KeyData;
  await redis.set(`api_key:${key}`, { ...keyData, lastUsed: new Date().toISOString() });
};

export const getKeyLU = async(key: string): Promise<string> => {
  const keyData = await redis.get(`api_key:${key}`) as KeyData;
  if (!keyData.lastUsed) return "Never";
  return dayJS(keyData.lastUsed).format("YYYY-MM-DD HH:mm");
};