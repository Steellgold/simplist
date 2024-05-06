import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const GET = async(): Promise<NextResponse> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized", projects: null }, { status: 401 });

  const projects = await db.project.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      posts: {
        select: {
          projectId: true
        }
      },
      createdAt: true,
      name: true
    }
  });

  return NextResponse.json({ projects });
};