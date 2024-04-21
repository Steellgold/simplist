import { ratelimit, redis } from "@/utils/db/upstash";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logCall } from "../../utils";
import { db } from "@/utils/db/prisma";

type KeyData = {
  id: string;
  projectId: string;
  authorId: string;
  status: "ACTIVE" | "INACTIVE";
}

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
    void logCall({
      key: apiKey, projectId, slug: "", postId: "", ip: ipAddress, method: "GET", status: 401
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (keyData.projectId !== projectId) {
    void logCall({
      key: apiKey, projectId, slug: "", postId: "", ip: ipAddress, method: "GET", status: 401
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await db.project.findUnique({
    where: { id: projectId },
    include: { posts: { orderBy: { createdAt: "desc" } } }
  });

  if (!data) {
    void logCall({
      key: apiKey, projectId, slug: "", postId: "", ip: ipAddress, method: "GET", status: 404
    });
    return NextResponse.json({ error: "Project Not Found" }, { status: 404 });
  }

  if (!data.posts.length) {
    void logCall({
      key: apiKey, projectId, slug: "", postId: "", ip: ipAddress, method: "GET", status: 404
    });
    return NextResponse.json({ error: "No Posts Found" }, { status: 404 });
  }

  // get the last post
  const post = data.posts[0];
  void logCall({
    key: apiKey, projectId, slug: post.slug, postId: post.id, ip: ipAddress, method: "GET", status: 200
  });

  return NextResponse.json(post);
};