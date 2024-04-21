"use client";

/* eslint-disable max-len */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Component } from "@/components/utils/component";
import { Loader2, PlusCircle, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import type { Lang as LANG } from "@prisma/client";
import { type PostStatus } from "@prisma/client";
import { PostSchema } from "@/schemas/post";
import { updatePost, deletePost } from "@/actions/post";
import { Alert } from "@/components/ui/alert";
import usePreloadImage from "../../new/preload";
import { LangSelector, type Lang } from "../../new/lang-selector";
import { LANGUAGES } from "@/utils/lang";
import { Checkbox } from "@/components/ui/checkbox";
import { slugify } from "@/slugify";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type EditPostProps = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  metadata: {
    key: string;
    type: "string" | "number" | "boolean";
    value: string | number | boolean;
    old: boolean;
  }[] | [];
  banner: string | null;
  lang: LANG;
  projectId: string;
  postId: string;
};

export const UpdatePost: Component<EditPostProps> = ({
  banner: postBanner,
  content: postContent,
  excerpt: postExcerpt,
  lang: postLang,
  metadata: postMetadatas,
  status: postStatus,
  title: postTitle,
  slug: postSlug,
  projectId: postProjectID,
  postId: postID
}) => {
  const [bannerUrl, setBannerUrl] = useState<string | null>(postBanner);
  const [fileDownloader, setFileDownloader] = useState<boolean>(false);
  const supabase = createClient();

  const [title, setTitle] = useState<string>(postTitle);
  const [excerpt, setExcerpt] = useState<string>(postExcerpt);
  const [content, setContent] = useState<string>(postContent);
  const [status, setStatus] = useState<PostStatus>(postStatus);
  const [rewriteSlug, setRewriteSlug] = useState<boolean>(false);

  const [metadata, setMetadata] = useState<{
    key: string;
    type: "string" | "number" | "boolean";
    value: string | number | boolean;
    old: boolean;
  }[]>(postMetadatas);

  const [lang, setLang] = useState<Lang>({ value: postLang, label: LANGUAGES[postLang] });

  const _ = usePreloadImage(bannerUrl || "/_static/no-image.png");

  const [isPending, startTransition] = useTransition();

  const [timer, setTimer] = useState<number | null>(null);
  const [deletion, setDeletion] = useState<boolean>(false);

  const savePost = (): void => {
    if (isPending) return;
    const post = PostSchema.safeParse({ title, excerpt, content, status, metadata, banner: bannerUrl || null, postProjectID, lang: lang.value, rewriteSlug });

    if (post.success) {
      startTransition(() => {
        void updatePost(postID, {
          title,
          excerpt,
          content,
          status,
          metadata,
          banner: bannerUrl || null,
          projectId: postProjectID,
          lang: lang.value,
          rewriteSlug
        })
          .then(() => {
            toast.success("Post saved successfully.");
          })
          .catch((error) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            toast.error(error.message);
          });
      });
    } else {
      toast.error(post.error.errors[0].message);
    }
  };

  const delPost = (): void => {
    if (isPending) return;

    startTransition(() => {
      void deletePost(postID)
        .then(() => {
          toast.success("Post deleted successfully.");
        })
        .catch((error) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          toast.error(error.message);
        });
    });
  };

  const startDeletionTimer = (): void => {
    if (timer) return;

    setTimer(5);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === null) return null;

        if (prev === 0) {
          toast.error("You did not cancel the deletion in time, the post will be deleted.");
          clearInterval(interval);
          setTimer(null);
          setDeletion(true);
          delPost();
          return null;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const stopDeletionTimer = (): void => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  return (
    <>
      <main className="grid items-start gap-4 mt-3 px-2">
        <div className="mx-auto max-w-full">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Post</CardTitle>
                  <CardDescription>This is the main information of the post.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Title</Label>
                      <Input
                        id="title"
                        placeholder={postTitle}
                        type="text"
                        className="w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />

                      <Alert className="items-top flex p-5 w-full flex flex-col">
                        <div className="flex justify-between">
                          <div className="grid gap-3">
                            <Label htmlFor="rewriteSlug">Re-write Slug</Label>
                            <Label htmlFor="rewriteSlug" className="text-muted-foreground text-sm -mt-2">
                              If enabled, the slug will be re-written based on the title.
                            </Label>

                            <Label htmlFor="rewriteSlug" className="text-muted-foreground text-sm -mt-2">
                              Current slug: <code className="p-1">{postSlug}</code>
                            </Label>

                            {rewriteSlug && (
                              <Label htmlFor="rewriteSlug" className="text-muted-foreground text-sm -mt-2">
                                New slug: <code className="p-1">{slugify(title, false)}</code>
                              </Label>
                            )}
                          </div>

                          <Checkbox
                            id="rewriteSlug"
                            checked={rewriteSlug}
                            onClick={() => setRewriteSlug(!rewriteSlug)}
                          />
                        </div>
                      </Alert>
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="description">Excerpt</Label>
                      <Label htmlFor="description" className="text-muted-foreground text-sm -mt-2">A brief description of the post.</Label>
                      <Textarea
                        id="excerpt"
                        value={excerpt}
                        className="min-h-24 resize-none"
                        placeholder={postExcerpt === "" ? "A brief description of the post." : postExcerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="content" className="grid gap-3">Content</Label>
                      <Textarea
                        id="content"
                        className="h-32"
                        placeholder={postContent === "" ? "Write your post here." : postContent}
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                      />
                    </div>

                    <Alert className="items-top flex p-5 w-full flex flex-col">
                      <div className="flex justify-between">
                        <div className="grid gap-3">
                          <Label htmlFor="lang">Language</Label>
                          <Label htmlFor="lang" className="text-muted-foreground text-sm -mt-2">Select the language of the post.</Label>
                        </div>
                        <LangSelector setLang={(value) => {
                          console.log("Lang changed", value);
                          setLang(value);
                        }} defaultLang={{
                          value: postLang,
                          label: LANGUAGES[postLang]
                        }} />
                      </div>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Metadata</CardTitle>
                  <CardDescription>Add custom metadata to this post will be returned on the response API.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Key</TableHead>
                        <TableHead className="w-[100px]">Type</TableHead>
                        <TableHead className="w-[100px]">Value</TableHead>
                        <TableHead className="w-[100px]">Action(s)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metadata.map(({ key, type, value, old }, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Label htmlFor={`key-${index}`} className="sr-only">Key</Label>
                            <Input
                              id={`key-${index}`}
                              type="text"
                              value={key}
                              placeholder={"some-key"}
                              disabled={old}
                              onChange={(e) => {
                                const newMetadata = metadata.slice();
                                newMetadata[index].key = e.target.value;
                                setMetadata(newMetadata);
                              }} />
                          </TableCell>

                          <TableCell>
                            <Label htmlFor={`type-${index}`} className="sr-only">Type</Label>
                            <Select defaultValue={type.toLowerCase()} onValueChange={(value) => {
                              const newMetadata = metadata.slice();
                              newMetadata[index].type = (value as "string");
                              setMetadata(newMetadata);
                            }} disabled={old}>
                              <SelectTrigger id={`type-${index}`} aria-label="Select type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="string">String</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>

                          {type === "boolean" ? (
                            <TableCell>
                              <Label htmlFor={`value-${index}`} className="sr-only">Value</Label>
                              <Select defaultValue={
                                value === "boolean" ? (value ? "true" : "false") : "true"
                              } onValueChange={(value) => {
                                const newMetadata = metadata.slice();
                                newMetadata[index].value = value === "true" ? true : false;
                                setMetadata(newMetadata);
                              }} disabled={old}>
                                <SelectTrigger id={`value-${index}`} aria-label="Select value">
                                  <SelectValue placeholder="Select value" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">True</SelectItem>
                                  <SelectItem value="false">False</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          ) : (
                            <TableCell>
                              <Label htmlFor={`value-${index}`} className="sr-only">Value</Label>
                              <Input
                                id={`value-${index}`}
                                type={type === "number" ? "number" : "text"}
                                placeholder={type === "number" ? "0" : "Value"}
                                // @ts-ignore
                                value={type === "string" ? value.toString() : value}
                                disabled={old}
                                onChange={(e) => {
                                  const newMetadata = metadata.slice();
                                  newMetadata[index].value = e.target.value;
                                  setMetadata(newMetadata);
                                }} />
                            </TableCell>
                          )}

                          <TableCell>
                            <Button size="default" variant="outline" className="gap-1" onClick={() => {
                              const newMetadata = metadata.slice();
                              newMetadata.splice(index, 1);
                              setMetadata(newMetadata);
                            }}>
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                      {metadata.length === 0 && (
                        <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No metadata added.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="justify-center border-t p-4">
                  <Button size="sm" variant="ghost" className="gap-1"
                    onClick={() => setMetadata(
                      [...metadata, { key: "", type: "string", value: "", old: false }]
                    )}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Metadata
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visibility</CardTitle>
                  <CardDescription>Do you want to publish or draft this post?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="status">Status</Label>
                      <Select defaultValue={postStatus} onValueChange={(value) => setStatus(value as PostStatus)} disabled={isPending}>
                        <SelectTrigger id="status" aria-label="Select status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="PUBLISHED">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4 justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button size="sm" variant="ghost" className="gap-1" disabled={isPending}>
                        <Trash2 className="h-3.5 w-3.5" />
                    Delete Post
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Please confirm</AlertDialogTitle>
                      <AlertDialogDescription>Are you sure you want to delete this post? This action cannot be undone.</AlertDialogDescription>

                      <div className="flex gap-2 justify-end">
                        {(timer !== null || deletion) ? (
                          <Button
                            variant="ghost"
                            onClick={timer ? stopDeletionTimer : () => setTimer(null)}
                            disabled={isPending || deletion}
                          >
                            {timer ? `Cancel before ${timer}s` : "Cancel"}
                          </Button>
                        ) : (
                          <AlertDialogCancel disabled={isPending || deletion}>Cancel</AlertDialogCancel>
                        )}
                        <Button
                          variant="destructive"
                          onClick={startDeletionTimer}
                          disabled={isPending || timer !== null || deletion}
                        >
                            Delete
                        </Button>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button size="sm" className="gap-1" onClick={savePost} disabled={
                    title === ""
                    || !title.match(/[\w\d]/)
                    || excerpt === ""
                    || !excerpt.match(/[\w\d]/)
                    || content === ""
                    || !content.match(/[\w\d]/)
                    || isPending
                  }>
                    {status == "PUBLISHED" ? "Publish" : "Save as Draft"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Post Banner</CardTitle>
                  <CardDescription>
                  On the response API it will return the URL of the image.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {fileDownloader ? (
                      <div className="flex items-center justify-center w-full h-32">
                        <Loader2 className="animate-spin h-5 w-5" />
                      </div>
                    ) : (
                      <Image
                        alt="Product image"
                        className="aspect-video w-full rounded-md object-cover"
                        height="300"
                        width="300"
                        src={bannerUrl || "/_static/no-image.png"}
                      />
                    )}
                  </div>
                </CardContent>

                <CardFooter className="border-t p-4 justify-between">
                  <Button size="sm" variant="ghost" className="gap-1" onClick={() => setBannerUrl(null)} disabled={!bannerUrl}>
                    <Trash2 className="h-3.5 w-3.5" />
                      Remove Image
                  </Button>

                  {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                  <input type="file" className="opacity-0 absolute z-[-1]" id="file-banner-input" onChange={async(e) => {
                    const file = e.target.files?.[0];
                    if (!file) {
                      toast.error("No file selected.");
                      return;
                    }

                    if (file.size > 5242880) {
                      toast.error("File is too large. Max size is 5MB.");
                      return;
                    }

                    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                      toast.error("Invalid file type. Only JPEG, PNG, and WEBP are allowed.");
                      return;
                    }

                    setFileDownloader(true);

                    const bannerId = `post-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

                    const { data, error } = await supabase.storage.from("banners").upload(bannerId, file, {
                      cacheControl: "3600",
                      contentType: file.type
                    });

                    if (error) {
                      toast.error("An error occurred while uploading the file.");
                      setFileDownloader(false);
                      return;
                    }

                    const { data: { publicUrl } } = supabase.storage.from("banners").getPublicUrl(data.path);
                    if (publicUrl) {
                      toast.success("File uploaded successfully.");
                      setBannerUrl(publicUrl);
                      setFileDownloader(false);
                    }
                  }} accept="image/jpeg, image/png, image/webp" />
                  {/* @ts-ignore */}
                  <Button size="sm" variant="ghost" className="gap-1" onClick={() => document?.getElementById("file-banner-input").click()}>
                    <Upload className="h-3.5 w-3.5" />
                      Upload Image
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};