import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import type { Project } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const GET = async({ nextUrl }: NextRequest): Promise<NextResponse> => {
  const params = new URL(nextUrl).searchParams;
  const projectId = params.get("projectId");
  let userId: string = params.get("userId") || "";

  if (!projectId) return NextResponse.json({ isAllowed: false });
  if (!userId) {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user || error) return NextResponse.json({ isAllowed: false });
    userId = user.id;
  }

  const data = await db.$queryRaw<Project[]>`SELECT "userId" FROM "Project" WHERE id = ${projectId}`;
  if (!data.length) return NextResponse.json({ isAllowed: false });
  if (data.length > 1) throw new Error("More than one project found with the same ID");

  const isAllowed = data[0].userId === userId;

  return NextResponse.json({ isAllowed });
};