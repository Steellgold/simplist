/* eslint-disable camelcase */
import { env } from "@/env.mjs";
import { createClient } from "@/utils/supabase/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { RequestsSchema } from "../analytics.type";
import { tinybirdRequest } from "../../../../tinybird.utils";


export const GET = async({ nextUrl }: NextRequest): Promise<NextResponse> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized", projects: null }, { status: 401 });

  const params = nextUrl.searchParams;
  const projectId = params.get("projectId");
  const postId = params.get("postId");
  const fromDate = params.get("fromDate");
  const toDate = params.get("toDate");
  if (!projectId) return NextResponse.json({ error: "Project ID is required", projects: null }, { status: 400 });
  if (!postId) return NextResponse.json({ error: "Post ID is required", projects: null }, { status: 400 });
  if (!fromDate) return NextResponse.json({ error: "From date is required", projects: null }, { status: 400 });
  if (!toDate) return NextResponse.json({ error: "To date is required", projects: null }, { status: 400 });

  const data = RequestsSchema.safeParse(await tinybirdRequest("post_calls", { projectId, postId, fromDate, toDate }, env.TINYBIRD_BEARER_TOKEN));
  if (!data.success) return NextResponse.json({ error: data.error.errors }, { status: 500 });

  return NextResponse.json({ error: null, data: data.data.data }, { status: 200 });
};