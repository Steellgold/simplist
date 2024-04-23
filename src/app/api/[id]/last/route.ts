import { ratelimit, redis } from "@/utils/db/upstash";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/utils/db/prisma";
import type { KeyData } from "@/types";

export const GET = async({ headers, url }: NextRequest): Promise<NextResponse> => {
  let ipAddress = headers.get("x-real-ip") as string;

  const { success } = await ratelimit.limit(ipAddress);
  if (!success) return NextResponse.json({ error: "Rate Limit Exceeded" }, { status: 429 });

  const forwardedFor = headers.get("x-forwarded-for") as string;
  if (!ipAddress && forwardedFor) ipAddress = forwardedFor?.split(",").at(0) ?? "Unknown";

  const projectId = new URL(url).pathname.split("/")[2];
  if (!projectId) return NextResponse.json({ error: "Project Not Found" }, { status: 404 });

  const apiKey = headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keyData = await redis.get(`api_key:${apiKey}`) as KeyData;
  if (!keyData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (keyData.status === "INACTIVE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (keyData.projectId !== projectId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await db.project.findUnique({
    where: { id: projectId },
    include: { posts: { orderBy: { createdAt: "desc" }, include: { metadata: {
      select: {
        id: false, key: true, value: true, createdAt: false, updatedAt: false, post: false, postId: false, type: true
      }
    } } } }
  });

  if (!data) {
    return NextResponse.json({ error: "Project Not Found" }, { status: 404 });
  }

  if (!data.posts.length) {
    return NextResponse.json({ error: "No Posts Found" }, { status: 404 });
  }

  const post = data.posts[0];
  return NextResponse.json(post);
};