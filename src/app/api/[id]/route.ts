import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type Request = {
  params: {
    id: string;
  };
};

export const GET = async({ headers }: NextRequest, { params }: Request): Promise<NextResponse> => {
  const slug = params.id;
  const xForwardedFor = headers.get("x-forwarded-for");
  const xApiKey = headers.get("x-api-key");
  if (!xApiKey) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log({ slug, xForwardedFor, xApiKey });

  // const response = await fetch("https://api.tinybird.co/v0/events?name=posts_metrics", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${env.TINYBIRD_BEARER_TOKEN}`
  //   },
  //   body: JSON.stringify({
  //     projectId: "events_example",
  //     postId: slug,
  //     createdAt: new Date().toISOString(),
  //     ip: xForwardedFor,
  //     country: geo?.country
  //   })
  // });

  return NextResponse.json({ message: "Hello, World!" });
};