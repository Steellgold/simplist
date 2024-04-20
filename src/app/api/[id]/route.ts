import { redis } from "@/utils/db/upstash";
import type { Meta } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logCall } from "../utils";

type KeyData = {
  id: string;
  projectId: string;
  authorId: string;
  status: "ACTIVE" | "INACTIVE";
}

type PostData = {
  authorId: string;
  banner: string | null;
  content: string;
  createdAt: string;
  excerpt: string;
  id: string;
  metadata: Meta[];
  projectId: string;
  slug: string;
  status: string;
  title: string;
  updatedAt: string;
}

export const GET = async({ headers, url  }: NextRequest): Promise<NextResponse> => {
  const slug = new URL(url).pathname.split("/")[2];

  let ipAddress = headers.get("x-real-ip") as string;

  const forwardedFor = headers.get("x-forwarded-for") as string;
  if (!ipAddress && forwardedFor) ipAddress = forwardedFor?.split(",").at(0) ?? "Unknown";

  const apiKey = headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!slug) {
    await logCall({ key: apiKey, projectId: "", slug: "", postId: "", ip: ipAddress, method: "GET", status: 404 });
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const keyData = await redis.get(`api_key:${apiKey}`) as KeyData;
  if (!keyData) {
    await logCall({ key: apiKey, projectId: "", slug: "", postId: "", ip: ipAddress, method: "GET", status: 401 });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (keyData.status === "INACTIVE") {
    await logCall({ key: apiKey, projectId: "", slug: "", postId: "", ip: ipAddress, method: "GET", status: 401 });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postData = await redis.get(`post:${slug}`) as PostData;
  if (!postData) {
    await logCall({
      key: apiKey, projectId: keyData.projectId, slug, postId: "", ip: ipAddress, method: "GET", status: 404 });
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  if (postData.projectId !== keyData.projectId) {
    await logCall({
      key: apiKey, projectId: keyData.projectId, slug, postId: "", ip: ipAddress, method: "GET", status: 401 });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await logCall({
    key: apiKey,
    projectId: keyData.projectId,
    slug,
    postId: postData.id,
    ip: ipAddress,
    method: "GET",
    status: 200
  });
  return NextResponse.json(postData);
};