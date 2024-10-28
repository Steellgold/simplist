import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { supabase } from "@/lib/db/supabase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const DELETE = async(request: Request): Promise<NextResponse> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.session.activeOrganizationId) return NextResponse.json({ error: "No active organization" }, { status: 400 });

  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("file");
  const organization = session.session.activeOrganizationId;
  const postId = searchParams.get("post");

  if (!fileId) return NextResponse.json({ error: "No file ID provided" }, { status: 400 });

  const { data, error } = await supabase.storage.from("banners").remove([organization + "/" + postId + "/" + fileId]);

  const prismaData = await prisma.file.findFirst({
    where: {
      id: fileId
    }
  });

  if (prismaData) {
    await prisma.file.delete({
      where: {
        id: fileId
      }
    });
  }

  if (error) return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Failed to retrieve image" }, { status: 500 });

  return NextResponse.json({ success: true }, { status: 200 });
};