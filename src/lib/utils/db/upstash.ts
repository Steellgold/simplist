import { Redis } from "@upstash/redis";
import { env } from "@/env.mjs";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN
});

export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(5, "10 s")
});