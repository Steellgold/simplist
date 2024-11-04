"use client";

import { useEffect, useState } from "react";
import type { Component } from "../component";
import type { EditorProps, PostInfo } from "./editor.types";
import { useBreadcrumbStore } from "@/hooks/use-breadcrumb";
import { Lang } from "@/lib/lang";
import { EditorTitle } from "./editor.title";
import { EditorExcerpt } from "./editor.excerpt";
import { EditorContent } from "./editor.content";
import { EditorHeader } from "./editor.header";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { EditorBanner } from "./editor.banner";
import { EditorSave } from "./editor.save";
import { nanoid } from "nanoid";
import { EditorMeta } from "./editor.meta";

export const Editor: Component<EditorProps> = ({ isNew = false, posts = [], dbId = "" }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [newPostID, setNewPostID] = useState<string>("");

  const [toDelete, setToDelete] = useState<Lang[]>([]);

  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);
  useEffect(() => setBreadcrumb([
    { href: "/app", label: "Overview" },
    { href: "/app/posts", label: "Posts" }
  ], isNew ? "New" : posts[0].title.slice(0, 20) + "..."),
  [setBreadcrumb, isNew, posts, activeIndex]);

  useEffect(() => {
    if (isNew) setNewPostID(nanoid(20));
    else setNewPostID(dbId);
  }, [isNew, dbId]);

  const [postsData, setPostsData] = useState<PostInfo>(
    posts.length ? posts : [{ title: "", excerpt: "", content: "", lang: Lang.EN, banner: null, metadatas: [] }]
  );

  const handleLanguageChange = (lang: Lang): void => {
    const existingIndex = postsData.findIndex(post => post.lang === lang);
    if (existingIndex !== -1) {
      setActiveIndex(existingIndex);
    } else {
      const newPostInfo = [...postsData, {
        title: "",
        excerpt: "",
        content: "",
        lang,
        banner: null,
        metadatas: [],
        persist: true
      }];
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

        <EditorMeta setValues={(values) => {
          const newPostInfo = [...postsData];
          newPostInfo[activeIndex].metadatas = values;
          setPostsData(newPostInfo);
        }} activeIndex={activeIndex} postInfo={postsData} />

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
                          setToDelete([...toDelete, postsData[activeIndex].lang]);
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
        <EditorBanner
          isNew={isNew}
          postId={newPostID}
          postInfo={postsData}
          setBanner={(banner) => {
            const newPostInfo = [...postsData];
            newPostInfo[activeIndex].banner = banner;
            setPostsData(newPostInfo);
          }}
          activeIndex={activeIndex}
        />

        <EditorSave isNew={isNew} postInfo={postsData} postId={isNew ? newPostID : dbId} toDelete={toDelete} />
      </div>
    </div>
  );
};