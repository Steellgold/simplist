import { env } from "@/env.mjs";

type LogCallProps = {
  key: string;
  projectId: string;
  slug: string;
  postId: string;
  ip: string;
  method: "GET";
  status: number;
};

export const logCall = async({ key, projectId, slug, postId, ip, method, status }: LogCallProps): Promise<void> => {
  await fetch("https://api.tinybird.co/v0/events?name=api_calls", {
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
};