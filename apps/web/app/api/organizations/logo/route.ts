import { NextRequest, NextResponse } from "next/server";
import R2 from "@/lib/r2";

export const POST = async (req: NextRequest) => {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const organizationId = formData.get("organizationId") as string;
    let fileKey = formData.get("fileKey") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!organizationId) {
      return NextResponse.json({ error: "Missing organization ID" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File must not exceed 2MB" }, { status: 400 });
    }

    if (!fileKey) {
      const fileExtension = file.name.split(".").pop() || "png";
      fileKey = `organizations/${organizationId}/logo-${Date.now()}.${fileExtension}`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileUrl = await R2.uploadFile(buffer, fileKey, file.type);

    return NextResponse.json({ success: true, url: fileUrl });

  } catch (error) {
    console.error("Error uploading logo:", error);
    return NextResponse.json({ error: "Server error while uploading file" }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json({ error: "Missing organization ID" }, { status: 400 });
    }

    const logoKey = `organizations/${organizationId}/logo.png`;
    
    try {
      const fileUrl = await R2.getFileUrl(logoKey);
      return NextResponse.json({ success: true, url: fileUrl });
    } catch (error) {
      return NextResponse.json({ success: false, error: "Logo not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error retrieving logo:", error);
    return NextResponse.json({ error: "Server error while retrieving file" }, { status: 500 });
  }
};