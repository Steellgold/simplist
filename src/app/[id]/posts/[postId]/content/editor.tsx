"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomCard } from "@/components/ui/custom-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon, Link, Sparkles, Trash2, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MDB } from "./editor/button.markdown";

type EditorProps = {
  ogTitle: string;
  ogExcerpt: string;
  ogContent: string;
  ogVisibility: "published" | "drafted";
  ogBannerImage: string;
};

export const Editor = ({ ogTitle, ogExcerpt, ogContent, ogVisibility, ogBannerImage }: EditorProps): ReactElement => {
  const [title, setTitle] = useState<string>(ogTitle);
  const [excerpt, setExcerpt] = useState<string>(ogExcerpt);
  const [content, setContent] = useState<string>(ogContent);
  const [visibility, setVisibility] = useState<"published" | "drafted">(ogVisibility);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [selection, setSelection] = useState<string | null>(null);

  const [imageURL, setImageURL] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState<string | null>(null);

  const [linkURL, setLinkURL] = useState<string | null>(null);

  const [_, setUploading] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(ogBannerImage);

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
                  <MDB contentRef={contentRef} selection={selection ?? ""} isDisabled={isSelectionEmpty} onContentChange={setContent} type="bold" />
                  <MDB contentRef={contentRef} selection={selection ?? ""} isDisabled={isSelectionEmpty} onContentChange={setContent} type="italic" />
                  <MDB contentRef={contentRef} selection={selection ?? ""} isDisabled={isSelectionEmpty} onContentChange={setContent} type="strike" />

                  <Dialog>
                    <DialogTrigger disabled={!isSelectionEmpty}>
                      <Button variant="inputStyle" disabled={!isSelectionEmpty}>
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                        <DialogDescription>Upload or insert a link to an image that you want to include in your blog post.</DialogDescription>
                      </DialogHeader>

                      <Input placeholder="Enter the alt text of the image" value={imageAlt ?? ""} onChange={(e) => setImageAlt(e.target.value)} />
                      <Input placeholder="Enter the URL of the image" value={imageURL ?? ""} onChange={(e) => setImageURL(e.target.value)} />
                      <Button disabled variant="inputStyle">Upload Image&nbsp;&nbsp;<Badge variant={"outline"}>Soon</Badge></Button>

                      <DialogFooter>
                        <Button
                          disabled={!imageURL || !imageAlt}
                          onClick={() => {
                            if (contentRef.current) {
                              const text = contentRef.current.value;
                              const selectionStart = contentRef.current.selectionStart;
                              const selectionEnd = contentRef.current.selectionEnd;

                              const newText = `${text.slice(0, selectionStart)}![${imageAlt}](${imageURL})${text.slice(selectionEnd)}`;
                              setImageURL(null);
                              setImageAlt(null);
                              setContent(newText);
                            }
                          }}>Insert Image</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger disabled={isSelectionEmpty}>
                      <Button variant="inputStyle" disabled={isSelectionEmpty}>
                        <Link className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Insert Link</DialogTitle>
                        <DialogDescription>Insert a link to a website or another blog post.</DialogDescription>
                      </DialogHeader>

                      <Input placeholder="Enter the URL of the link" value={linkURL ?? ""} onChange={(e) => setLinkURL(e.target.value)} />

                      <DialogFooter>
                        <Button variant="outline" onClick={() => {}}>Cancel</Button>
                        <Button
                          disabled={!linkURL || !selection}
                          onClick={() => {
                            if (contentRef.current) {
                              const text = contentRef.current.value;
                              const selectionStart = contentRef.current.selectionStart;
                              const selectionEnd = contentRef.current.selectionEnd;

                              const newText = `${text.slice(0, selectionStart)}[${selection}](${linkURL})${text.slice(selectionEnd)}`;
                              setContent(newText);
                              setLinkURL(null);
                            }
                          }}>Insert Link</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Separator orientation="vertical" className="h-4" />

                  <Select defaultValue="h1" onValueChange={(value) => {
                    if (contentRef.current) {
                      const text = contentRef.current.value;
                      const selectionStart = contentRef.current.selectionStart;
                      const selectionEnd = contentRef.current.selectionEnd;

                      const heading = "#".repeat(Number(value[1]));
                      const newText = `${text.slice(0, selectionStart)}${heading} ${selection}${text.slice(selectionEnd)}`;
                      setContent(newText);
                    }
                  }}>
                    <SelectTrigger className="w-[100px]" disabled={isSelectionEmpty}>
                      <SelectValue>Heading</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="h1">H1</SelectItem>
                      <SelectItem value="h2">H2</SelectItem>
                      <SelectItem value="h3">H3</SelectItem>
                      <SelectItem value="h4">H4</SelectItem>
                      <SelectItem value="h5">H5</SelectItem>
                      <SelectItem value="h6">H6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Textarea
                  ref={contentRef}
                  className="h-96 p-3"
                  placeholder="Enter the content of your blog post"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
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

                <div className="my-5" />

                <input
                  type="file"
                  className="opacity-0 absolute z-[-1]"
                  id="file-banner-input"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
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
                    <Button
                      size="sm"
                      className="gap-1 w-full"
                      onClick={() => document?.getElementById("file-banner-input")?.click()}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload Image
                    </Button>

                    {uploadedImage && (
                      <Button onClick={() => setUploadedImage(null)} size="sm" className="gap-1 w-full">
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove Image
                      </Button>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mt-2">Accepted formats: jpg, jpeg, png</p>
                </div>
              </CardContent>
            </CustomCard>

            <CustomCard noHover>
              <CardHeader>
                <CardTitle>Visibility</CardTitle>
                <CardDescription>Choose the visibility of your blog post. You can choose to make it published or drafted.</CardDescription>
              </CardHeader>

              <CardContent>
                <Select defaultValue={visibility} onValueChange={(value) => setVisibility(value as "published" | "drafted")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the visibility of your blog post" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="drafted">Drafted</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>

              <CardFooter>
                <Button
                  variant="default"
                  className="w-full"
                  disabled={
                    (!title || !excerpt || !content || !visibility)
                    || (title === ogTitle && excerpt === ogExcerpt && content === ogContent && visibility === ogVisibility)
                  }>
                    Save Post
                </Button>
              </CardFooter>
            </CustomCard>
          </div>
        </div>
      </div>
    </main>
  );
};