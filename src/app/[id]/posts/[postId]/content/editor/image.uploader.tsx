import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Component } from "@/components/utils/component";
import { cn } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import type { ReactElement } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

type ImageUploaderType = {
  isLoading: boolean;
  image: string | null;

  projectId: string;
  postId: string;

  onContentChange: (content: string) => void;
};

const ALLOWED_FORMATS = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export const ImageUploader: Component<ImageUploaderType> = ({
  isLoading,
  image,

  projectId,
  postId,

  onContentChange
}): ReactElement => {
  const supabase = createClient();

  const [uploadedImage, setUploadedImage] = useState<string | null>(image);
  const [uploading, setUploading] = useState<boolean>(false);

  return (
    <>
      <div className={cn("relative", {
        "hidden": uploading
      })}>
        <Image
          alt="Placeholder Image"
          className="w-full max-w-[600px] rounded-lg"
          height="400"
          width="600"
          src={uploadedImage ?? "/_static/no-image.png"}
          style={{
            aspectRatio: "600/300",
            objectFit: "cover"
          }}
        />

        {uploadedImage !== "/_static/no-image.png" && <Badge className="absolute top-2 right-2" variant={"secondary"}>Preview</Badge>}
      </div>

      <Skeleton
        className={cn("w-full rounded-lg", { "hidden": !uploading })}
        style={{ aspectRatio: "600/300" }}
      />

      <div className="my-5" />

      <input
        type="file"
        className="opacity-0 absolute z-[-1]"
        id="file-banner-input"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onChange={(e) => {
          if (isLoading) return;

          console.log("Uploading image... 0");

          if (e.target.files?.[0]?.size && e.target.files?.[0]?.size > 5 * 1024 * 1024) {
            return toast.error("File size must be less than 5MB");
          }

          if (e.target.files?.[0]?.type && !ALLOWED_FORMATS.includes(e.target.files?.[0]?.type)) {
            return toast.error("File must be an image (png, jpeg, jpg, webp)");
          }

          const file = e.target.files?.[0];
          if (!file) return toast.error("No file selected");

          const fileName = file.name.replace(/ /g, "-").toLowerCase();

          const promise = (): Promise<{
            url: string;
            name: string;
          }> => new Promise((resolve, reject) => {
            setUploading(true);

            supabase.storage.from("banners").upload(`${projectId}/${postId}/${fileName}`, file, {
              cacheControl: "3600",
              contentType: file.type
            })
              .then(({ error }) => {
                setUploading(false);
                if (error) return reject(error.message);

                const { data: { publicUrl } } = supabase.storage.from("banners").getPublicUrl(`${projectId}/${postId}/${fileName}`);
                return resolve({
                  url: publicUrl,
                  name: fileName
                });
              })
              .catch(reject);
          });

          toast.promise(promise(), {
            loading: "Uploading image...",
            success: (data) => {
              const schema = z.object({ url: z.string(), name: z.string() }).safeParse(data);
              if (!schema.success) return "Failed to upload image.";

              setUploadedImage(schema.data.url);
              onContentChange(schema.data.url);
              return `Image ${schema.data.name} uploaded successfully.`;
            },
            error: (error: string) => error
          });

          // const { data: { publicUrl } } = supabase.storage.from(`banners/${projectId}`).getPublicUrl(`${postId}/${fileName}`);

          // if (file) {
          //   setUploading(true);
          //   const reader = new FileReader();
          //   reader.onload = () => {
          //     setUploadedImage(reader.result as string);
          //     setUploading(false);
          //   };
          //   reader.readAsDataURL(file);
          // }

          onContentChange("/_static/no-image.png");
        }}
      />

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Button size="sm" className="gap-1 w-full" disabled={isLoading}
            onClick={() => document?.getElementById("file-banner-input")?.click()}>
            <Upload className="h-3.5 w-3.5" />
            Upload Image
          </Button>

          {uploadedImage !== "/_static/no-image.png" && (
            <Button
              onClick={() => setUploadedImage("/_static/no-image.png")}
              size="sm"
              disabled={isLoading}
              className="gap-1 w-full"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove Image
            </Button>
          )}
        </div>

        <p className="text-sm text-gray-400 mt-2">Accepted formats: jpg, jpeg, png, webp</p>
        <p className="text-sm text-gray-400">Max file size: 5MB</p>
      </div>
    </>
  );
};