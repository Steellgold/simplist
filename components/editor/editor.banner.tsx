"use client";

import Image from "next/image";
import type { Component } from "../component";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import { Button } from "../ui/button";
import { ImageOff, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { EditorBannerProps } from "./editor.types";
import { useActiveOrganization, useSession } from "@/lib/auth/client";
import { Skeleton } from "../ui/skeleton";
import { nanoid } from "nanoid";
import { z } from "zod";

export const EditorBanner: Component<EditorBannerProps> = ({ postInfo, setBanner, postId, activeIndex }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { data: organization, isPending } = useActiveOrganization();
  const { data: session, isPending: isSessionPending } = useSession();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Editor</CardTitle>
        <CardDescription>Write a new post, and publish it to the API endpoint.</CardDescription>
      </CardHeader>

      <div className="p-6 w-full h-52 -mt-6">
        <CardContent className="relative h-full w-full">
          {postInfo[activeIndex].banner ? (
            <Image
              src={postInfo[activeIndex].banner?.url + "?" + new Date().getTime()}
              alt="Post Editor"
              fill
              className="rounded-lg object-cover"
            />
          ) : (
            <Image
              src="/_static/placeholder.png"
              alt="Post Editor"
              fill
              className="rounded-lg object-cover"
            />
          )}
        </CardContent>
      </div>

      <CardFooter className="flex justify-between">
        {postInfo[activeIndex].banner ? (
          <Button variant="outline" size="sm" disabled={isUploading} onClick={() => {
            toast.promise(
              fetch("/api/banner/delete?file=" + postInfo[activeIndex].banner?.id + "&post=" + postId, {
                method: "DELETE"
              }), {
                loading: "Deleting image...",
                success: () => {
                  setBanner(null);
                  return "Image deleted successfully.";
                },
                error: "Failed to delete image."
              }
            );
          }}>
            <ImageOff size={16} />
            Delete Image
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ImageOff size={16} />
            Delete Image
          </Button>
        )}

        <div>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <input type="file" accept="image/*" onChange={async(e) => {
            setIsUploading(true);

            const file = e.target.files?.[0];
            if (!file) {
              toast.error("No file selected.");
              setIsUploading(false);
              return;
            }

            if (file.size > 5 * 1024 * 1024) {
              toast.error("Image size must be less than 5MB.");
              setIsUploading(false);
              return;
            }

            if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
              toast.error("Invalid file type. Only JPEG, PNG, and WEBP are allowed.");
              setIsUploading(false);
              return;
            }

            const fileId = nanoid(20);
            let callApiUrl = "/api/banner/upload?filename=" + fileId;
            callApiUrl += organization ? "&organization=" + organization.id : "";
            callApiUrl += "&post=" + postId;

            const response = await fetch(callApiUrl, {
              method: "POST",
              body: file
            });

            const schema = z.object({ url: z.string() }).safeParse(await response.json());
            if (!schema.success) {
              toast.error("Failed to upload image.");
              setIsUploading(false);
              return;
            }

            setBanner({
              url: schema.data.url,
              size: file.size,
              name: file.name,
              type: file.type,
              id: fileId,
              uploadedAt: new Date(),
              uploadedBy: session?.user?.id ?? ""
            });

            setIsUploading(false);
            setTimeout(() => toast.success("Image uploaded successfully."), 500);
          }} hidden />

          {organization && session && !isPending && !isSessionPending ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => (document.querySelector("input[type=file]") as HTMLInputElement)?.click()}
              disabled={isUploading}
            >
              {!isUploading ? <ImagePlus size={16} /> : <Loader2 size={16} className="animate-spin" />}
              Upload Image
            </Button>
          ) : (
            <Skeleton className="w-24 h-8" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};