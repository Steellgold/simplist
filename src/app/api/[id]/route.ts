import { ratelimit, redis } from "@/utils/db/upstash";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { dayJS } from "@/dayjs/day-js";
import type { KeyData, PostData } from "@/types";
import type { Comment } from "@prisma/client";
import { db } from "@/utils/db/prisma";

type Request = {
  params: {
    id: string;
  };
};

export const GET = async({ headers, url }: NextRequest, { params }: Request): Promise<NextResponse> => {
  const slug = params.id;

  let ipAddress = headers.get("x-real-ip") as string;

  const { success } = await ratelimit.limit(ipAddress);
  if (!success) return NextResponse.json({ error: "Rate Limit Exceeded" }, { status: 429 });

  const forwardedFor = headers.get("x-forwarded-for") as string;
  if (!ipAddress && forwardedFor) ipAddress = forwardedFor?.split(",").at(0) ?? "Unknown";

  const apiKey = headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!slug) return NextResponse.json({ error: "Not Found" }, { status: 404 });

  const keyData = await redis.get(`api_key:${apiKey}`) as KeyData;
  if (!keyData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (keyData.status === "INACTIVE") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let postData: PostData | null = await redis.get(`project:${keyData.projectId}:post:${slug}`) as PostData;
  if (!postData) {
    postData = await redis.get(`post:${slug}`) as PostData;
    if (!postData) return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  if (postData.projectId !== keyData.projectId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!postData.calls) postData.calls = {};
  if (postData.calls && postData.calls[dayJS().format("YYYY-MM-DD")]) {
    postData.calls[dayJS().format("YYYY-MM-DD")].count += 1;
    postData.calls[dayJS().format("YYYY-MM-DD")].lastCall = dayJS().toISOString();
  } else {
    postData.calls[dayJS().format("YYYY-MM-DD")] = {
      count: 1,
      lastCall: dayJS().toISOString()
    };
  }

  let comments: Comment[] = [];
  const urlParams = new URL(url);
  const includeComments = urlParams.searchParams.get("comments") ?? true;

  if (includeComments) {
    comments = await db.comment.findMany({
      where: { postId: postData.id },
      orderBy: { createdAt: "desc" }
    });
  }

  await redis.set(`post:${slug}`, postData);
  return NextResponse.json({ ...postData, calls: undefined, comments });
};