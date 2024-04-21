/* eslint-disable max-len */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Component } from "@/components/utils/component";
import { Loader2, PlusCircle, Trash2, Undo2, Upload, WandSparkles, Zap } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { type PostStatus } from "@prisma/client";
import { PostSchema } from "@/schemas/post";
import { useWindowSize } from "usehooks-ts";
import ReactConfetti from "react-confetti";
import { littleEasterEggSupabase } from "./supabase";
import usePreloadImage from "./preload";
import Link from "next/link";
import { createPost } from "@/actions/post";
import type { Lang } from "./lang-selector";
import { LangSelector } from "./lang-selector";
import { Alert } from "@/components/ui/alert";

type PageProps = {
  params: {
    project: string;
  };
};

const superSecretPhraseToUnlockConfetti = "Build in a weekend";
const superSecretImageBannerURL = "https://github.com/supabase/supabase/blob/master/apps/www/public/images/blog/oss-hackathon/thumbnail.png?raw=true";

const defaultContent = `# Hello, world!
> This is a post content example.`;

const Post: Component<PageProps> = ({ params }) => {
  const { project: projectId } = params;

  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [fileDownloader, setFileDownloader] = useState<boolean>(false);

  const supabase = createClient();

  const [title, setTitle] = useState<string>("");
  const [excerpt, setExcerpt] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<PostStatus>("DRAFT");
  const [metadata, setMetadata] = useState<{
    key: string;
    type: "string" | "number" | "boolean";
    value: string | number | boolean;
  }[]>([]);

  const [imported, setImported] = useState<boolean>(false);
  const [importedFileName, setImportedFileName] = useState<string | null>(null);

  const [lang, setLang] = useState<Lang>({ value: "EN", label: "English" });

  const _ = usePreloadImage(superSecretImageBannerURL);
  const { height, width } = useWindowSize();

  const [isPending, startTransition] = useTransition();

  const savePost = (): void => {
    if (isPending) return;
    const post = PostSchema.safeParse({ title, excerpt, content, status, metadata, banner: bannerUrl || null, projectId, lang: lang.value });

    if (post.success) {
      startTransition(() => {
        void createPost({ title, excerpt, content, status, metadata, banner: bannerUrl || null, projectId, lang: lang.value })
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

  return (
    <>
      {title == superSecretPhraseToUnlockConfetti && (
        <ReactConfetti
          width={width - 20}
          height={height}
          recycle={false}
          numberOfPieces={1000}
          colors={["#40cf8d", "#289e69", "#283730", "#7ed4ae*", "#37996b"]}
        />
      )}

      <main className="grid items-start gap-4 mt-3">
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
                        placeholder={superSecretPhraseToUnlockConfetti}
                        type="text"
                        className="w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="description">Excerpt</Label>
                      <Label htmlFor="description" className="text-muted-foreground text-sm -mt-2">A brief description of the post.</Label>
                      <Textarea
                        id="excerpt"
                        value={excerpt}
                        className="min-h-24 resize-none"
                        placeholder={
                          title == superSecretPhraseToUnlockConfetti ? "Build an Open Source Project over 10 days. 5 prize categories."
                            : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, vestibulum mi nec, ultricies nunc. Nulla facilisi. Nullam nec nunc nec libero ultricies ultricies."
                        }
                        onChange={(e) => setExcerpt(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="content" className="grid gap-3">Content</Label>
                      {title == superSecretPhraseToUnlockConfetti ? (
                        <Textarea
                          id="content"
                          className="h-96"
                          placeholder={defaultContent}
                          readOnly
                          value={littleEasterEggSupabase}
                        />
                      ) : (
                        <Textarea
                          id="content"
                          className="h-32"
                          placeholder={defaultContent}
                          onChange={(e) => setContent(e.target.value)}
                          value={content}
                        />
                      )}
                    </div>

                    <Alert className="items-top flex p-5 w-full flex flex-col">
                      <div className="flex justify-between">
                        <div className="grid gap-3">
                          <Label htmlFor="lang">Language</Label>
                          <Label htmlFor="lang" className="text-muted-foreground text-sm -mt-2">Select the language of the post.</Label>

                          <Label htmlFor="lang" className="flex items-center gap-2 text-primary">
                            <WandSparkles className="h-4 w-4" />
                            Variants with AI translation will be available soon.
                          </Label>
                        </div>
                        <LangSelector setLang={(data) => setLang(data)} />
                      </div>
                    </Alert>

                    <div className="grid gap-3">
                      <Alert className="items-top flex p-5">
                        <div className="grid gap-3">
                          <Label htmlFor="lang">Import from <kbd>MDX</kbd> file</Label>
                          <Label htmlFor="lang" className="text-muted-foreground text-sm -mt-2">You can import the content of the post from an MDX file.</Label>

                          <Label htmlFor="file-input" className="flex items-center gap-2">
                            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                            <input type="file" className="opacity-0 absolute z-[-1]" id="file-mdx-input" onChange={(e) => {
                              const file = e.target.files?.[0];

                              if (!file) {
                                toast.error("No file selected.");
                                // @ts-ignore
                                document.getElementById("file-mdx-input").value = "";
                                return;
                              }

                              if (file.size > 5242880) {
                                toast.error("File is too large. Max size is 5MB.");
                                // @ts-ignore
                                document.getElementById("file-mdx-input").value = "";
                                return;
                              }


                              if (!file.name.endsWith(".mdx")) {
                                toast.error("Invalid file type. Only MDX files are allowed.");
                                // @ts-ignore
                                document.getElementById("file-mdx-input").value = "";
                                return;
                              }

                              setImported(true);
                              setImportedFileName(file.name);

                              const reader = new FileReader();

                              reader.readAsText(file, "UTF-8");

                              reader.onload = () => {
                                const docContent = reader.result as string;
                                const lines = docContent.split(/\r?\n/);

                                const fileData = {
                                  title: "",
                                  description: "",
                                  content: ""
                                };

                                let isMetadata = false;
                                for (const line of lines) {
                                  if (line === "---") {
                                    isMetadata = !isMetadata;
                                    continue;
                                  }

                                  if (isMetadata) {
                                    if (line.startsWith("title:")) {
                                      fileData.title = line.replace("title:", "").trim();
                                    } else if (line.startsWith("description:")) {
                                      fileData.description = line.replace("description:", "").trim();
                                    }
                                  } else {
                                    if (fileData.content === "") {
                                      fileData.content = line;
                                    } else {
                                      if (line === "") {
                                        fileData.content += "\n";
                                      } else {
                                        fileData.content += line + "\n";
                                      }
                                    }
                                  }
                                }

                                const { title, description, content } = fileData;
                                setTitle(title.replace(/['"]+/g, ""));
                                setExcerpt(description.replace(/['"]+/g, ""));
                                setContent(content.replace(/['"]+/g, "").replace(/\\n/g, "\n"));
                              };

                            }} accept=".mdx" />
                            {/* @ts-ignore */}
                            {imported ? (
                              <Button size="sm" variant="ghost" className="gap-1" onClick={() => {
                                setTitle("");
                                setExcerpt("");
                                setContent("");
                                setImported(false);
                                setImportedFileName(null);
                                // @ts-ignore
                                document.getElementById("file-mdx-input").value = "";
                              }}>
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove MDX file ({importedFileName})
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="gap-1"
                                // @ts-ignore
                                onClick={() => document?.getElementById("file-mdx-input").click()}>
                                <Upload className="h-3.5 w-3.5" />
                                Load content from MDX file
                              </Button>
                            )}
                          </Label>
                        </div>
                      </Alert>
                    </div>
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
                      {metadata.map(({ key, type, value }, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Label htmlFor={`key-${index}`} className="sr-only">Key</Label>
                            <Input
                              id={`key-${index}`}
                              type="text"
                              value={key}
                              placeholder={
                                type === "string" ? "some-key"
                                  : type === "number" ? "pigCount"
                                    : "isPigOrientedPost"
                              }
                              onChange={(e) => {
                                const newMetadata = metadata.slice();
                                newMetadata[index].key = e.target.value;
                                setMetadata(newMetadata);
                              }} />
                          </TableCell>

                          <TableCell>
                            <Label htmlFor={`type-${index}`} className="sr-only">Type</Label>
                            <Select defaultValue={type} onValueChange={(value) => {
                              const newMetadata = metadata.slice();
                              newMetadata[index].type = (value as "string");
                              setMetadata(newMetadata);
                            }}>
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
                                typeof value === "boolean" ? (value ? "true" : "false") : "true"
                              } onValueChange={(value) => {
                                const newMetadata = metadata.slice();
                                newMetadata[index].value = value === "true" ? true : false;
                                setMetadata(newMetadata);
                              }}>
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
                                value={(value as string)}
                                onChange={(e) => {
                                  const newMetadata = metadata.slice();
                                  newMetadata[index].value = e.target.value;
                                  setMetadata(newMetadata);
                                }} />
                            </TableCell>
                          )}

                          <TableCell>
                            <Button size="icon" variant="outline" className="gap-1" onClick={() => {
                              const newMetadata = metadata.slice();
                              newMetadata.splice(index, 1);
                              setMetadata(newMetadata);
                            }}>
                              <Trash2 className="h-3.5 w-3.5" />
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
                    onClick={() => setMetadata([...metadata, { key: "", type: "string", value: "" }])}>
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
                      <Select defaultValue="DRAFT" onValueChange={(value) => setStatus(value as PostStatus)} disabled={
                        title === superSecretPhraseToUnlockConfetti
                        || isPending
                      }>
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
                <CardFooter className="border-t p-4 justify-end">
                  <Button size="sm" className="gap-1" onClick={savePost} disabled={
                    title === ""
                    || title === superSecretPhraseToUnlockConfetti
                    || !title.match(/[\w\d]/)
                    || excerpt === ""
                    || !excerpt.match(/[\w\d]/)
                    || content === ""
                    || !content.match(/[\w\d]/)
                    || isPending
                  }>
                  Save as {status === "DRAFT" ? "Draft" : "Published"}
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
                        src={title !== superSecretPhraseToUnlockConfetti ? bannerUrl || "/_static/no-image.png" : superSecretImageBannerURL}
                      />
                    )}
                  </div>
                </CardContent>

                {title !== superSecretPhraseToUnlockConfetti ? (
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

                    {/*
                      If you're here, it's because you want to see whether or not images are deleted on the server.
                      So far I haven't implemented the deletion of images on the server if the user deletes the image or doesn't create the post.

                      But I intend to do so, I'll rely on the `delete` method once the Hackaton is over, for the moment I'm concentrating on creating posts and the essentials.

                      - Gaëtan
                    */}
                  </CardFooter>
                ) : (
                  <CardFooter className="border-t p-4 justify-between">
                    <Button size="sm" variant="ghost" className="gap-1" asChild>
                      <Link href={"https://supabase.com/blog/supabase-oss-hackathon"}>
                        <Zap className="h-3.5 w-3.5 rounded-md" fill="#40cf8d" stroke="#40cf8d" />
                        Supabase: OSS Hackathon
                      </Link>
                    </Button>

                    <Button size="sm" variant="ghost" className="gap-1" onClick={() => setTitle("")}>
                      <Undo2 className="h-3.5 w-3.5" />
                      Recover all
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Post;