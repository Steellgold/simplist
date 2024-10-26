"use client";

import Image from "next/image";
import type { Component } from "../component";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import { Button } from "../ui/button";
import { ImageOff, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const EditorBanner: Component<{ banner?: string }> = () => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Editor</CardTitle>
        <CardDescription>Write a new post, and publish it to the API endpoint.</CardDescription>
      </CardHeader>

      <div className="p-6 w-full h-52 -mt-6">
        <CardContent className="relative h-full w-full">
          <Image src="https://placehold.co/1000x500/png" alt="Post Editor" fill className="rounded-lg object-cover" />
        </CardContent>
      </div>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" disabled={isUploading}>
          <ImageOff size={16} />
          Delete Image
        </Button>

        <div>
          <input type="file" accept="image/*" onChange={(e) => {
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
          }} hidden />

          <Button
            variant="outline"
            size="sm"
            onClick={() => (document.querySelector("input[type=file]") as HTMLInputElement)?.click()}
            disabled={isUploading}
          >
            {!isUploading ? <ImagePlus size={16} /> : <Loader2 size={16} className="animate-spin" />}
            Upload Image
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};