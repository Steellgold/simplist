/* eslint-disable camelcase */
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { supabase } from "@/lib/db/supabase";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async(request: Request): Promise<NextResponse> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.session.activeOrganizationId) return NextResponse.json({ error: "No active organization" }, { status: 400 });

  const { searchParams } = new URL(request.url);

  const base64Filename = searchParams.get("filename");
  let filename = base64Filename ? Buffer.from(base64Filename, "base64").toString() : nanoid();
  const organization = searchParams.get("organization") || session.session.activeOrganizationId;
  const postId = searchParams.get("post");

  const file = await request.blob();
  const fileData = await file.arrayBuffer();
  const buffer = Buffer.from(fileData);

  filename = organization + "/" + postId + "/" + nanoid(5);

  const { data, error } = await supabase.storage.from("banners").upload(filename, buffer, {
    cacheControl: "3600",
    contentType: file.type
  });

  if (error) return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Failed to retrieve image" }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from("banners").getPublicUrl(data.path);
  if (!publicUrl) return NextResponse.json({ error: "Failed to get public URL." }, { status: 500 });

  const member = await prisma.member.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: organization
      }
    }
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found for user in this organization." }, { status: 404 });
  }

  const id = nanoid();

  await prisma.file.create({
    data: {
      id,
      name: searchParams.get("filename") || nanoid(),
      size: file.size,
      url: publicUrl,
      mimeType: file.type,
      organization: {
        connect: {
          id: organization
        }
      },
      member: {
        connect: {
          id: member.id
        }
      }
    }
  });

  return NextResponse.json({
    url: publicUrl,
    id
  });
};