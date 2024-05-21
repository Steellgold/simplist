import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Component } from "@/components/utils/component";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import type { ReactElement } from "react";
import { RefObject, useState } from "react";
import { toast } from "sonner";

type ImageUploaderType = {
  isDisabled: boolean;
  isLoading: boolean;
  image: string | null;

  projectId: string;
  postId: string;

  onContentChange: (content: string) => void;
};

const ALLOWED_FORMATS = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export const ImageUploader: Component<ImageUploaderType> = ({
  isDisabled,
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
      <div className="relative">
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

        {image !== uploadedImage && <Badge className="absolute top-2 right-2" variant={"secondary"}>Preview</Badge>}
      </div>

      <div className="my-5" />

      <input
        type="file"
        className="opacity-0 absolute z-[-1]"
        id="file-banner-input"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={(e) => {
          if (isLoading) return;

          if (e.target.files?.[0]?.size && e.target.files?.[0]?.size > 5 * 1024 * 1024) {
            return toast.error("File size must be less than 5MB");
          }

          if (e.target.files?.[0]?.type && !ALLOWED_FORMATS.includes(e.target.files?.[0]?.type)) {
            return toast.error("File must be an image (png, jpeg, jpg, webp)");
          }

          const file = e.target.files?.[0];
          if (file) {
            setUploading(true);
            const reader = new FileReader();
            reader.onload = () => {
              setUploadedImage(reader.result as string);
              setUploading(false);
            };
            reader.readAsDataURL(file);
          }
        }}
      />

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Button size="sm" className="gap-1 w-full" disabled={isLoading}
            onClick={() => document?.getElementById("file-banner-input")?.click()}>
            <Upload className="h-3.5 w-3.5" />
            Upload Image
          </Button>

          {uploadedImage && (
            <Button
              onClick={() => setUploadedImage(null)}
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