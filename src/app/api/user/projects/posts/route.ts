import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const GET = async({ nextUrl }: NextRequest): Promise<NextResponse> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized", projects: null }, { status: 401 });

  const params = nextUrl.searchParams;
  const projectId = params.get("projectId");
  if (!projectId) return NextResponse.json({ error: "Project ID is required", projects: null }, { status: 400 });

  const posts = await db.post.findMany({
    where: {
      projectId
    },
    select: {
      id: true,
      title: true,
      excerpt: true,
      banner: true,
      createdAt: true,
      updatedAt: true,
      lang: true,
      metadata: true,
      status: true,
      comments: {
        select: {
          id: true
        }
      },
      variants: {
        select: {
          id: true,
          lang: true
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });

  return NextResponse.json({ posts });
};