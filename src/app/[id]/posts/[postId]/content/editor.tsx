"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomCard } from "@/components/ui/custom-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALargeSmall, Braces, Pen, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MDB } from "./editor/button.markdown";
import { ButtonMarkdownImage as BMI } from "./editor/button.image";
import { ButtonMarkdownLink as BML } from "./editor/button.link";
import { savePost } from "@/actions/post";
import { toast } from "sonner";
import { SelectHeadingMarkdown as SHM } from "./editor/select.heading";
import { IMAGE_PLACEHOLDER, ImageUploader } from "./editor/image.uploader";
import { DialogDeletePost } from "./editor/dialog.delete";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type EditorProps = {
  id?: string;
  projectId: string;

  ogTitle?: string;
  ogExcerpt?: string;
  ogContent?: string;
  ogVisibility?: "PUBLISHED" | "DRAFT";
  ogBannerImage?: string;

  isNew?: boolean;
};

export const Editor = ({
  id, projectId,
  ogTitle = "", ogExcerpt = "", ogContent = "", ogVisibility = "DRAFT", ogBannerImage = IMAGE_PLACEHOLDER,
  isNew
}: EditorProps): ReactElement => {
  const [title, setTitle] = useState<string>(ogTitle);
  const [excerpt, setExcerpt] = useState<string>(ogExcerpt);
  const [content, setContent] = useState<string>(ogContent);
  const [visibility, setVisibility] = useState<"PUBLISHED" | "DRAFT">(ogVisibility);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [selection, setSelection] = useState<string | null>(null);

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

              <CardContent className="flex flex-col">
                <div className="flex items-center flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Enter the title of your blog post"
                    value={title}
                    disabled={isLoading}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <Button className="w-full sm:w-auto" variant={"ai"}>Assistant <Sparkles className="h-4 w-4 ml-1.5" strokeWidth={1} /></Button>
                </div>

                {title && (
                  <Alert className="mt-2">
                    <Braces className="h-4 w-4" />
                    <AlertTitle>API</AlertTitle>
                    <AlertDescription>
                      <kbd>GET /api/posts/{buildSlug(title)}</kbd>
                    </AlertDescription>
                  </Alert>
                )}
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

            <CustomCard noHover>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
                <CardDescription>Add custom metadata to this post will be returned on the response API.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Alert className="justify-between items-center flex flex-row gap-2.5 p-3 rounded-md">
                  <div className="flex items-center gap-1.5">
                    Salut
                    <Badge variant="default">
                      <ALargeSmall className="h-4 w-4" />&nbsp;String
                    </Badge>
                  </div>

                  <Button variant="outline" size={"sm"} className="text-xs">
                    <Pen className="h-3.5 w-3.5" />&nbsp;
                    Edit
                  </Button>
                </Alert>
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
                <ImageUploader
                  isDisabled={isLoading}
                  isLoading={isLoading}
                  image={uploadedImage}
                  projectId={projectId}
                  onContentChange={setUploadedImage}
                />
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
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  toast.promise(savePost(id ?? "", {
                    title,
                    excerpt,
                    content,
                    status: visibility,
                    lang: "EN",
                    banner: uploadedImage,
                    projectId,
                    slug: title.toLowerCase().replace(/\s/g, "-")
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
                    {visibility === "PUBLISHED" ? "Publish Post" : "Draft Post"}&nbsp;
                    {hasChanges && "(Unsaved changes)"}
                  </Button>
                </form>
              </CardFooter>
            </CustomCard>

            {!isNew && (
              <CustomCard noHover isDanger>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>Delete this blog post. This action cannot be undone.</CardDescription>
                </CardHeader>

                <CardContent>
                  {id && <DialogDeletePost projectId={projectId} postId={id} />}
                </CardContent>
              </CustomCard>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const buildSlug = (title: string): string => title.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");