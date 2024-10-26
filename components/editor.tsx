"use client";

import { Lang, LANGUAGES } from "@/lib/lang";
import { useEffect, useState } from "react";
import type { Component } from "./component";
import { useBreadcrumbStore } from "@/hooks/use-breadcrumb";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { AlertDialog, AlertDialogCancel, AlertDialogAction, AlertDialogFooter,
  AlertDialogDescription, AlertDialogTrigger, AlertDialogTitle,
  AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { BookDashed, CircleDotDashed, FilePen, FilePenLine, ImageOff, ImagePlus, Loader2, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import type { File } from "@prisma/client";
import { useUpdatePost } from "@/lib/actions/post/post.hook";
import { useRouter } from "next/navigation";

type PostInfo = {
  title: string;
  excerpt: string;
  content: string;
  banner?: string | null;
  lang: Lang;
  variantId?: string;
}[];

type EditorProps = {
  isNew?: boolean;
  posts?: PostInfo;
  files?: File[];
  dbId: string;
};

export const Editor: Component<EditorProps> = ({ isNew = false, posts = [], dbId }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);
  useEffect(() => setBreadcrumb([
    { href: "/app", label: "Overview" },
    { href: "/app/posts", label: "Posts" }
  ], isNew ? "New" : posts[activeIndex].title.slice(0, 20) + "..."),
  [setBreadcrumb, isNew, posts, activeIndex]);

  const [postsData, setPostsData] = useState<PostInfo>(
    posts.length ? posts : [{ title: "", excerpt: "", content: "", lang: Lang.EN }]
  );

  const handleLanguageChange = (lang: Lang): void => {
    const existingIndex = postsData.findIndex(post => post.lang === lang);
    if (existingIndex !== -1) {
      setActiveIndex(existingIndex);
    } else {
      const newPostInfo = [...postsData, { title: "", excerpt: "", content: "", lang }];
      setPostsData(newPostInfo);
      setActiveIndex(newPostInfo.length - 1);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <div className="col-span-6 md:col-span-4 space-y-3">
        <EditorHeader
          activeIndex={activeIndex}
          postInfo={postsData}
          onLanguageChange={handleLanguageChange}
          setActiveIndex={setActiveIndex}
        />

        <EditorTitle
          setValue={(title) => {
            const newPostInfo = [...postsData];
            newPostInfo[activeIndex].title = title;
            setPostsData(newPostInfo);
          }}
          activeIndex={activeIndex}
          postInfo={postsData}
        />

        <EditorExcerpt
          setValue={(excerpt) => {
            const newPostInfo = [...postsData];
            newPostInfo[activeIndex].excerpt = excerpt;
            setPostsData(newPostInfo);
          }}
          activeIndex={activeIndex}
          postInfo={postsData}
        />

        <EditorContent
          setValue={(content) => {
            const newPostInfo = [...postsData];
            newPostInfo[activeIndex].content = content;
            setPostsData(newPostInfo);
          }}
          activeIndex={activeIndex}
          postInfo={postsData}
        />

        {postsData[activeIndex].lang !== Lang.EN && (
          <Card variant="destructive">
            <CardHeader className="flex flex-row justify-between gap-4">
              <div>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Are you sure you want to delete this language from the post?</CardDescription>
              </div>

              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size={"sm"}>
                      <Trash size={16} />
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogTitle>Delete Language</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the language from the post?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => {
                          const newPostInfo = postsData.filter((_, index) => index !== activeIndex);
                          setPostsData(newPostInfo);
                          setActiveIndex(0);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
          </Card>
        )}
      </div>

      <div className="col-span-6 md:col-span-2 space-y-3">
        <EditorBanner />
        <EditorSave isNew={isNew} postInfo={postsData} postId={dbId} />
      </div>
    </div>
  );
};

type EditorElementProps = {
  activeIndex: number;
  postInfo: PostInfo;

  setValue: (value: string) => void;
};

type EditorHeaderProps = {
  activeIndex: number;
  postInfo: PostInfo;

  setActiveIndex: (index: number) => void;
  onLanguageChange: (lang: Lang) => void
};

const EditorHeader: Component<EditorHeaderProps> = ({ activeIndex, postInfo, onLanguageChange }) => {
  return (
    <Card>
      <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>Post Editor</CardTitle>
          <CardDescription>Write a new post, and publish it to the API endpoint.</CardDescription>
        </div>

        <Select
          value={postInfo[activeIndex].lang}
          onValueChange={(value) => onLanguageChange(value as Lang)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(LANGUAGES)
              .sort(([keyA], [keyB]) => {
                const existsA = postInfo.some(post => post.lang === keyA as Lang);
                const existsB = postInfo.some(post => post.lang === keyB as Lang);
                return existsA === existsB ? 0 : existsA ? -1 : 1;
              })
              .map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-1.5">
                    {postInfo.some(post => post.lang === key as Lang) ? (
                      <CircleDotDashed size={16} className={cn("text-muted-foreground", {
                        "animate-pulse text-blue-500": postInfo[activeIndex].lang === key as Lang
                      })} />
                    ) : null}

                    {value}
                  </span>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </CardHeader>
    </Card>
  );
};

const EditorTitle: Component<EditorElementProps> = ({ setValue, activeIndex, postInfo }) => (
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
        onChange={(event) => setValue(event.target.value)}
      />
    </CardContent>
  </Card>
);

const EditorExcerpt: Component<EditorElementProps> = ({ setValue, activeIndex, postInfo }) => (
  <Card>
    <CardHeader>
      <CardTitle>Excerpt</CardTitle>
      <CardDescription>Enter a short summary of the post.</CardDescription>
    </CardHeader>

    <CardContent>
      <Input
        id="excerpt"
        placeholder="A short summary of the post."
        value={postInfo[activeIndex].excerpt}
        onChange={(event) => setValue(event.target.value)}
      />
    </CardContent>
  </Card>
);

const EditorContent: Component<EditorElementProps> = ({ setValue, activeIndex, postInfo }) => (
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
        onChange={(event) => setValue(event.target.value)}
        style={{ resize: "vertical", minHeight: "200px" }}
      />
    </CardContent>
  </Card>
);

const EditorBanner: Component<{ banner?: string }> = ({ banner }) => {
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

type EditorSaveProps = {
  isNew: boolean;
  postInfo: PostInfo;
  postId: string;
};

const EditorSave: Component<EditorSaveProps> = ({
  isNew,
  postInfo,
  postId
}) => {
  const update = useUpdatePost();
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Save Post</CardTitle>
        <CardDescription>Save the post to the API endpoint.</CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-end gap-2">
        {isNew && (
          <Button variant="outline" size={"sm"}>
            <BookDashed size={16} />
            Save as Draft
          </Button>
        )}

        <Button
          variant="default"
          size={"sm"}
          onClick={() => {
            if (isNew) {
              toast.success("Post published successfully.");
              return;
            }

            setIsSaving(true);
            update.mutate({
              id: postId,
              data: {
                title: postInfo[0].title,
                excerpt: postInfo[0].excerpt,
                content: postInfo[0].content,
                lang: postInfo[0].lang,
                variants: {
                  updateMany: postInfo.slice(1).map(variant => ({
                    where: { id: variant.variantId },
                    data: {
                      title: variant.title,
                      excerpt: variant.excerpt,
                      content: variant.content,
                      lang: variant.lang
                    }
                  }))
                }
              }
            }, {
              onSuccess: () => {
                setIsSaving(false);
                router.push("/app/posts");
                toast.success("Post updated successfully.");
              },
              onError: () => {
                toast.error("Failed to update post.");
                setIsSaving(false);
              }
            });
          }}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : (
            <>
              {isNew ? <FilePenLine size={16} /> : <FilePen size={16} />}
            </>
          )}
          {isNew ? "Publish Post" : "Update Post"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// const EditorTags: Component = () => {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Tags</CardTitle>
//         <CardDescription>Add tags to the post.</CardDescription>
//       </CardHeader>

//       <CardContent>
//         <Input id="tags" placeholder="Add tags to the post." />
//       </CardContent>
//     </Card>
//   );
// };

// const EditorCategories: Component = () => {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Categories</CardTitle>
//         <CardDescription>Add categories to the post.</CardDescription>
//       </CardHeader>

//       <CardContent>
//         <Input id="categories" placeholder="Add categories to the post." />
//       </CardContent>
//     </Card>
//   );
// };