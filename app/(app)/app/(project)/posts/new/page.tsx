"use client";

import { MarkdownPlease } from "@/components/mdx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Lang, LANGUAGES } from "@/lib/lang";
import { Combine } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";
import { toast } from "sonner";

type PostInfo = {
  title: string;
  excerpt: string;
  content: string;
  lang: Lang;
}[];

const Page = (): ReactElement => {
  const [postInfo, setPostInfo] = useState<PostInfo>([
    { title: "English post v1", excerpt: "This is a post in English.", content: "Once upon a time...", lang: Lang.EN },
    { title: "French post v1", excerpt: "C'est un post en français.", content: "Il était une fois...", lang: Lang.FR }
  ]);

  const [activeIndex, setActiveIndex] = useState(0);

  const setTitle = (title: string): void => {
    const newPostInfo = [...postInfo];
    newPostInfo[activeIndex].title = title;
    setPostInfo(newPostInfo);
  };

  const setExcerpt = (excerpt: string): void => {
    const newPostInfo = [...postInfo];
    newPostInfo[activeIndex].excerpt = excerpt;
    setPostInfo(newPostInfo);
  };

  const setContent = (content: string): void => {
    const newPostInfo = [...postInfo];
    newPostInfo[activeIndex].content = content;
    setPostInfo(newPostInfo);
  };

  const parseMDX = (file: File): void => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!file.name.endsWith(".mdx")) {
        toast.error("Invalid file type. Please select a .mdx file.");
        return;
      }

      if (!event.target || typeof event.target.result !== "string") {
        toast.error("Failed to read file contents.");
        return;
      }

      if (event.target.result.length > 10000) {
        toast.warning("File size is too large. Please make sure the file is less than 10KB.");
        return;
      }

      const result = event.target?.result;
      if (typeof result === "string") {
        const lines = result.split("\n");
        const title = lines[0].replace("# ", "");
        const excerpt = lines[1];
        const content = lines.slice(2).join("\n");

        const newPostInfo = [...postInfo];
        newPostInfo[activeIndex].title = title;
        newPostInfo[activeIndex].excerpt = excerpt;
        newPostInfo[activeIndex].content = content;

        setPostInfo(newPostInfo);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="col-span-2 md:col-span-2 space-y-3">
        <Card>
          <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="flex flex-col">
              <CardTitle>Post Editor</CardTitle>
              <CardDescription>Write a new post, and publish it to the API endpoint.</CardDescription>
            </div>

            <div>
              <input type="file" className="hidden" id="import-mdx" onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  parseMDX(file);
                }
              }} />

              <Button onClick={() => document.getElementById("import-mdx")?.click()} variant={"outline"}>
                <Combine size={16} />
                Import from MDX
              </Button>
            </div>
          </CardHeader>

          <CardFooter>
            <Tabs
              defaultValue={Lang.EN}
              className="w-full"
              onValueChange={(value: string) => setActiveIndex(postInfo.findIndex((post) => post.lang === value as Lang))}
            >
              <TabsList>
                {postInfo.map((post, index) => (
                  <TabsTrigger key={index} value={post.lang}>
                    {LANGUAGES[post.lang]} {post.lang === Lang.EN ? " (Default)" : ""}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Enter the title of the post.</CardDescription>
          </CardHeader>

          <CardContent>
            <Input
              id="title"
              placeholder="The story about my cat"
              value={postInfo[activeIndex].title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Excerpt</CardTitle>
            <CardDescription>Enter a short description of the post.</CardDescription>
          </CardHeader>

          <CardContent>
            <Textarea
              id="excerpt"
              placeholder="My cat is a very cute animal."
              value={postInfo[activeIndex].excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              style={{ resize: "none" }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Write the main content of the post.</CardDescription>
          </CardHeader>

          <CardContent>
            <Textarea
              id="content"
              placeholder="Once upon a time, there was a cat named Whiskers..."
              value={postInfo[activeIndex].content}
              onChange={(event) => setContent(event.target.value)}
              style={{ resize: "vertical" }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>View a preview of the post.</CardDescription>
          </CardHeader>

          <CardContent>
            <MarkdownPlease content={postInfo[activeIndex].content} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;