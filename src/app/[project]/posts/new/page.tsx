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
import { Loader2, PlusCircle, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { Editor } from "./editor";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const Post: Component<undefined> = () => {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [fileDownloader, setFileDownloader] = useState<boolean>(false);
  const supabase = createClient();

  return (
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
                    <Input id="title" type="text" className="w-full" defaultValue="Lorem ipsum dolor sit amet" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Excerpt</Label>
                    <Label htmlFor="description" className="text-muted-foreground text-sm -mt-2">A brief description of the post.</Label>

                    <Textarea
                      id="excerpt"
                      // eslint-disable-next-line max-len
                      defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                      className="min-h-24 resize-none"
                    />

                    <Editor />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
                <CardDescription>
                    Add custom metadata to this post will be returned on the response API.
                </CardDescription>
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
                    <TableRow>
                      <TableCell>
                        <Label htmlFor="key" className="sr-only">Key</Label>
                        <Input id="key" type="text" defaultValue="hasProduct" />
                      </TableCell>
                      <TableCell>
                        <Label htmlFor="type" className="sr-only">Type</Label>
                        <Select defaultValue="boolean">
                          <SelectTrigger id="type" aria-label="Select type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      {/* TODO: Here show a checkbox if the type is boolean */}
                      <TableCell>
                        <Label htmlFor="value" className="sr-only">Value</Label>
                        <Input id="value" type="text" defaultValue="true" />
                      </TableCell>
                      <TableCell>
                        <Button size="icon" variant="outline" className="gap-1">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button size="sm" variant="ghost" className="gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                    Add Metadata
                </Button>
              </CardFooter>
            </Card>

            {/* TODO: Add "Variants" card to add same post with different languages, and access to editor */}
          </div>
          <div className="grid auto-rows-max items-start gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Visibility</CardTitle>
                <CardDescription>
                    Do you want to publish or draft this post?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="draft">
                      <SelectTrigger id="status" aria-label="Select status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Publish(ed)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 justify-end">
                <Button size="sm" className="gap-1">
                  Save as {"Draft"}
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

                {/*


                  If you're here, it's because you want to see whether or not images are deleted on the server.
                  So far I haven't implemented the deletion of images on the server if the user deletes the image or doesn't create the post.

                  But I intend to do so, I'll rely on the `delete` method once the Hackaton is over, for the moment I'm concentrating on creating posts and the essentials.

                  - Gaëtan


                */}
              </CardFooter>
            </Card>

            {/*
                KEEP THIS COMMENTED: For the "/edit" page
                <Card>
                  <CardHeader>
                    <CardTitle>Archive Post</CardTitle>
                    <CardDescription>
                      This action will archive the post and it will not be available on the API.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div></div>
                    <Button size="sm" variant="secondary">
                      Archive Post
                    </Button>
                  </CardContent>
                </Card>
              */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Post;