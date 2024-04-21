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
import { Languages, Loader2, Pen, PlusCircle, Trash2, Undo2, Upload, WandSparkles, Zap } from "lucide-react";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/utils";

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
  const [variants, setVariants] = useState<{
    title: string;
    excerpt: string;
    content: string;
    lang: Lang;
  }[]>([]);

  const [currentVariantEditing, setCurrentVariantEditing] = useState<{
    title: string;
    excerpt: string;
    content: string;
    lang: Lang;
  } | null>(null);

  const [newVariantOpen, setNewVariantOpen] = useState<boolean>(false);
  const [editVariantOpen, setEditVariantOpen] = useState<boolean>(false);

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
                        </div>
                        <LangSelector setLang={(data) => setLang(data)} />
                      </div>

                      {variants.length > 0 && <div className="my-3"></div>}

                      {variants.length > 0 && variants.map((variant, index) => (
                        <Alert className={cn("items-top flex p-5 w-full flex flex-col", {
                          "mt-3": index !== 0
                        })} key={index}>
                          <div className="flex justify-between">
                            <div className="grid gap-3">
                              <Label htmlFor={`variant-${index}`}>{variant.title}</Label>
                              <Label htmlFor={`variant-${index}`} className="text-muted-foreground text-sm -mt-2">This is a <strong>{variant.lang.label}</strong> variant of the post.</Label>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="gap-1"
                                onClick={() => {
                                  const newVariants = variants.slice();
                                  newVariants.splice(index, 1);
                                  setVariants(newVariants);
                                }}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>

                              <Dialog open={editVariantOpen} onOpenChange={(open) => setEditVariantOpen(open)}>
                                <DialogTrigger asChild>
                                  <Button size="icon" variant="outline" className="gap-1"
                                    onClick={() => setCurrentVariantEditing(variant)}
                                  >
                                    <Pen className="h-3.5 w-3.5" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <div className="grid gap-3">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                      id="title"
                                      type="text"
                                      placeholder="Construire en un week-end"
                                      value={currentVariantEditing?.title || ""}
                                      // @ts-ignore
                                      onChange={(e) => setCurrentVariantEditing({
                                        ...variant, title: e.target.value
                                      })}
                                    />
                                  </div>

                                  <div className="grid gap-3">
                                    <Label htmlFor="lang">Language</Label>
                                    {/* @ts-ignore */}
                                    <LangSelector setLang={(data) => setCurrentVariantEditing({
                                      ...variant, lang: data
                                    })} />
                                  </div>

                                  <div className="grid gap-3">
                                    <Label htmlFor="excerpt">Excerpt</Label>
                                    <Textarea
                                      id="excerpt"
                                      className="min-h-24 resize-none"
                                      placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, vestibulum mi nec, ultricies nunc. Nulla facilisi. Nullam nec nunc nec libero ultricies ultricies."
                                      value={currentVariantEditing?.excerpt || ""}
                                      // @ts-ignore
                                      onChange={(e) => setCurrentVariantEditing({
                                        ...variant, excerpt: e.target.value
                                      })}
                                    />
                                  </div>

                                  <div className="grid gap-3">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                      id="content"
                                      className="h-48 resize-none"
                                      placeholder={defaultContent}
                                      value={currentVariantEditing?.content || ""}
                                      // @ts-ignore
                                      onChange={(e) => setCurrentVariantEditing({
                                        ...variant, content: e.target.value
                                      })}
                                    />
                                  </div>

                                  <div className="flex justify-between">
                                    <Button size="sm" variant={"secondary"}
                                      onClick={() => setNewVariantOpen(false)}>Cancel</Button>

                                    <div className="flex gap-2">
                                      <Button
                                        variant={"default"}
                                        size="sm"
                                        className="gap-1"
                                        onClick={() => {
                                          const newVariants = variants.slice();
                                          // @ts-ignore
                                          newVariants[index] = currentVariantEditing;
                                          setVariants(newVariants);
                                          setCurrentVariantEditing(null);
                                          setEditVariantOpen(false);
                                        }}
                                      >
                                        Save as {variant.lang.label}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </Alert>
                      ))}

                      <div className="my-3"></div>

                      <div className="flex justify-end">
                        <AlertDialog onOpenChange={(open) => {
                          setNewVariantOpen(open);
                          setCurrentVariantEditing({
                            title: "",
                            excerpt: "",
                            content: "",
                            lang: { value: "EN", label: "English" }
                          });
                        }} open={newVariantOpen}>
                          <AlertDialogTrigger onClick={() => setNewVariantOpen(true)}>
                            <Button size="sm" variant="ghost" className="gap-1" disabled={isPending}>
                              <Languages className="h-3.5 w-3.5" />
                              Add Variant
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <div className="grid gap-3">
                              <Label htmlFor="title">Title</Label>
                              <Input
                                id="title"
                                type="text"
                                placeholder="Construire en un week-end"
                                value={currentVariantEditing?.title || ""}
                                // @ts-ignore
                                onChange={(e) => setCurrentVariantEditing({
                                  ...currentVariantEditing, title: e.target.value
                                })}
                              />
                            </div>

                            <div className="grid gap-3">
                              <Label htmlFor="lang">Language</Label>
                              {/* @ts-ignore */}
                              <LangSelector setLang={(data) => setCurrentVariantEditing({
                                ...currentVariantEditing, lang: data
                              })} />
                            </div>

                            <div className="grid gap-3">
                              <Label htmlFor="excerpt">Excerpt</Label>
                              <Textarea
                                id="excerpt"
                                className="min-h-24 resize-none"
                                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, vestibulum mi nec, ultricies nunc. Nulla facilisi. Nullam nec nunc nec libero ultricies ultricies."
                                value={currentVariantEditing?.excerpt || ""}
                                // @ts-ignore
                                onChange={(e) => setCurrentVariantEditing({
                                  ...currentVariantEditing, excerpt: e.target.value
                                })}
                              />
                            </div>

                            <div className="grid gap-3">
                              <Label htmlFor="content">Content</Label>
                              <Textarea
                                id="content"
                                className="h-48 resize-none"
                                placeholder={defaultContent}
                                value={currentVariantEditing?.content || ""}
                                // @ts-ignore
                                onChange={(e) => setCurrentVariantEditing({
                                  ...currentVariantEditing, content: e.target.value
                                })}
                              />
                            </div>

                            <div className="flex justify-between">
                              <Button size="sm" onClick={() => setNewVariantOpen(false)}>
                                Cancel
                              </Button>

                              <div className="flex gap-2">
                                <Button
                                  variant={"secondary"}
                                  size="sm"
                                  className="gap-1"
                                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                  onClick={async() => {
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                    const { data, error } = await supabase.functions.invoke("openai", {
                                      body: {
                                        // langFrom, langTo, content
                                        langFrom: lang.value,
                                        langTo: currentVariantEditing?.lang.value,
                                        content: currentVariantEditing?.content || ""
                                      }
                                    });

                                    if (error) {
                                      toast.error("An error occurred while translating the content.");
                                      return;
                                    }

                                    console.log(data);
                                  }}
                                >
                                  <WandSparkles className="h-3.5 w-3.5" />
                                  Translate from {lang.label}
                                </Button>

                                <Button
                                  size="sm"
                                  className="gap-1"
                                  disabled={
                                    currentVariantEditing?.title === ""
                                    || currentVariantEditing?.excerpt === ""
                                    || currentVariantEditing?.content === ""
                                    || isPending
                                  }
                                  onClick={() => {
                                    if (currentVariantEditing) {
                                      setVariants([...variants, currentVariantEditing]);
                                      setCurrentVariantEditing(null);
                                      setNewVariantOpen(false);
                                    }
                                  }}
                                >
                                  Save Variant
                                </Button>
                              </div>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
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