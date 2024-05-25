"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomCard } from "@/components/ui/custom-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MDB } from "./editor/button.markdown";
import { ButtonMarkdownImage as BMI } from "./editor/button.image";
import { ButtonMarkdownLink as BML } from "./editor/button.link";
import { updatePost } from "@/actions/post";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { SelectHeadingMarkdown as SHM } from "./editor/select.heading";

type EditorProps = {
  id: string;
  projectId: string;

  ogTitle: string;
  ogExcerpt: string;
  ogContent: string;
  ogVisibility: "PUBLISHED" | "DRAFT";
  ogBannerImage: string;

  isNew?: boolean;
};

export const Editor = ({ id, projectId, ogTitle, ogExcerpt, ogContent, ogVisibility, ogBannerImage, isNew }: EditorProps): ReactElement => {
  const [title, setTitle] = useState<string>(ogTitle);
  const [excerpt, setExcerpt] = useState<string>(ogExcerpt);
  const [content, setContent] = useState<string>(ogContent);
  const [visibility, setVisibility] = useState<"PUBLISHED" | "DRAFT">(ogVisibility);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [selection, setSelection] = useState<string | null>(null);

  const [_, setUploading] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(ogBannerImage);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleSelection = (): void => {
      if (contentRef.current) {
        const selection = window.getSelection()?.toString();
        if (selection) setSelection(selection);
        else setSelection(null);
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener("mouseup", handleSelection);
      content.addEventListener("keyup", handleSelection);
      content.addEventListener("touchend", handleSelection);
    }

    return () => {
      if (content) {
        content.removeEventListener("mouseup", handleSelection);
        content.removeEventListener("keyup", handleSelection);
        content.removeEventListener("touchend", handleSelection);

        setSelection(null);
      }
    };
  }, []);

  const isSelectionEmpty = !selection || selection.length === 0;

  const hasChanges = (
    title !== ogTitle
    || excerpt !== ogExcerpt
    || content !== ogContent
    || visibility !== ogVisibility
    || uploadedImage !== ogBannerImage
  );

  return (
    <main className="grid items-start gap-4 mt-3">
      <div className="max-w-full">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2">
            <CustomCard noHover>
              <CardHeader>
                <CardTitle>Title</CardTitle>
                <CardDescription>Enter the title of your blog post. It should be catchy and reflect the content of your post.</CardDescription>
              </CardHeader>

              <CardContent className="flex items-center flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Enter the title of your blog post"
                  value={title}
                  disabled={isLoading}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <Button className="w-full sm:w-auto" variant={"ai"}>Assistant <Sparkles className="h-4 w-4 ml-1.5" strokeWidth={1} /></Button>
              </CardContent>
            </CustomCard>

            <CustomCard noHover>
              <CardHeader>
                <CardTitle>Excerpt</CardTitle>
                <CardDescription>Write a brief description that grabs attention and makes readers want to read the entire article.</CardDescription>
              </CardHeader>

              <CardContent>
                <Textarea
                  placeholder="Enter the excerpt of your blog post here"
                  className="w-full h-24 p-3 resize-none text-white rounded-md"
                  value={excerpt}
                  disabled={isLoading}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </CardContent>
            </CustomCard>

            <CustomCard noHover>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>Enter the content of your blog post. You can use markdown to format your text.</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-1.5 mb-2">
                  <MDB
                    contentRef={contentRef}
                    selection={selection ?? ""} isDisabled={isSelectionEmpty || isLoading} onContentChange={setContent} type="bold" />
                  <MDB
                    contentRef={contentRef}
                    selection={selection ?? ""} isDisabled={isSelectionEmpty || isLoading} onContentChange={setContent} type="italic" />
                  <MDB
                    contentRef={contentRef}
                    selection={selection ?? ""} isDisabled={isSelectionEmpty || isLoading} onContentChange={setContent} type="strike" />
                  <BMI contentRef={contentRef} isDisabled={isLoading} onContentChange={setContent} />
                  <BML contentRef={contentRef} isDisabled={isSelectionEmpty || isLoading} selection={selection ?? ""} onContentChange={setContent} />

                  <Separator orientation="vertical" className="h-4" />

                  <SHM contentRef={contentRef} isDisabled={isSelectionEmpty || isLoading} onContentChange={setContent} selection={selection ?? ""} />
                </div>

                <div className="relative w-full">
                  <Textarea
                    ref={contentRef}
                    className="h-96 p-3"
                    placeholder="Enter the content of your blog post"
                    value={content}
                    disabled={isLoading}
                    onChange={(e) => setContent(e.target.value)}
                  />

                  {!content.replace(/\s/g, "").length && (
                    <p className="absolute bottom-3 right-3 text-gray-400">You haven&apos;t written anything yet, start writing!</p>
                  )}
                </div>
              </CardContent>
            </CustomCard>
          </div>

          <div className="grid auto-rows-max gap-4">
            <CustomCard noHover>
              <CardHeader>
                <CardTitle>Banner Image</CardTitle>
                <CardDescription>Upload a banner image for your blog post. It will be displayed at the top of your post.</CardDescription>
              </CardHeader>

              <CardContent>
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

                  {ogBannerImage !== uploadedImage && (
                    <Badge className="absolute top-2 right-2" variant={"secondary"}>
                      Preview
                    </Badge>
                  )}
                </div>

                <div className="my-5" />

                <input
                  type="file"
                  className="opacity-0 absolute z-[-1]"
                  id="file-banner-input"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={(e) => {
                    if (isLoading) return;
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
                        onClick={() => setUploadedImage(
                          ogBannerImage
                            ? ogBannerImage
                            : null
                        )}
                        size="sm"
                        disabled={isLoading}
                        className="gap-1 w-full">
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove Image
                      </Button>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mt-2">Accepted formats: jpg, jpeg, png, webp</p>
                  <p className="text-sm text-gray-400">Max file size: 5MB</p>
                </div>
              </CardContent>
            </CustomCard>

            <CustomCard noHover>
              <CardHeader>
                <CardTitle>Visibility</CardTitle>
                <CardDescription>Choose the visibility of your blog post. You can choose to make it published or drafted.</CardDescription>
              </CardHeader>

              <CardContent>
                <Select defaultValue={visibility} onValueChange={(value) => setVisibility(value as "PUBLISHED" | "DRAFT")} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the visibility of your blog post" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="DRAFT">Drafted</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>

              <CardFooter>
                {!isNew && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    toast.promise(updatePost(id, {
                      title,
                      excerpt,
                      content,
                      status: visibility,
                      lang: "EN",
                      banner: uploadedImage,
                      projectId
                    }), {
                      loading: "Saving post...",
                      success: "Post saved successfully!",
                      error: "Failed to save post."
                    });
                  }} className="w-full">
                    <Button
                      variant="default"
                      className="w-full"
                      disabled={
                        !hasChanges
                        || isLoading
                        || !content.replace(/\s/g, "").length
                      }>
                      Save Post
                    </Button>
                  </form>
                )}
              </CardFooter>
            </CustomCard>
          </div>
        </div>
      </div>
    </main>
  );
};