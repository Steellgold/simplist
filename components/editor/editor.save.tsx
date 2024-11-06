"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../ui/card";
import { useCreatePost, useDeletePost, useUpdatePost } from "@/lib/actions/post/post.hook";
import type { Component } from "../component";
import type { EditorSaveProps } from "./editor.types";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { startOfToday } from "date-fns";
import {
  BookDashed,
  CalendarIcon,
  CalendarOff,
  FilePen,
  FilePenLine,
  Loader2,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useActiveOrganization, useSession } from "@/lib/auth/client";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, metaStringify, slugify } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import type { Prisma } from "@prisma/client";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogAction,
  AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogCancel
} from "../ui/alert-dialog";
import { dayJS } from "@/lib/day-js";

export const EditorSave: Component<EditorSaveProps> = ({ isNew, postInfo, postId }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const router = useRouter();

  const update = useUpdatePost();
  const create = useCreatePost();
  const deletePost = useDeletePost();

  const { data: organization, isPending } = useActiveOrganization();
  const { data: session, isPending: isSessionPending } = useSession();

  const combinedDateTime = useMemo(() => {
    if (!date) return null;
    if (!time) return date;
    const [hours, minutes] = time.split(":").map(Number);
    return new Date(date.setHours(hours, minutes));
  }, [date, time]);

  const createOrUpdatePost = (published: boolean): void => {
    if (!postInfo[0].title || !postInfo[0].excerpt || !postInfo[0].content) {
      toast.error("Title, excerpt, and content are required.");
      return;
    }

    if (postInfo.slice(1).length > 0) {
      const hasEmptyVariant = postInfo.slice(1).some((variant) => !variant.title || !variant.excerpt || !variant.content);
      if (hasEmptyVariant) {
        toast.error("Title, excerpt, and content are required for all variants.");
        return;
      }
    }

    if (!organization || !session) {
      toast.error("Organization or session is not available.");
      return;
    }

    const mutation = isNew ? create.mutate : update.mutate;

    const createPostPayload: Prisma.PostCreateInput = {
      id: postId || nanoid(),
      title: postInfo[0].title,
      excerpt: postInfo[0].excerpt,
      content: postInfo[0].content,
      lang: postInfo[0].lang,
      published,
      scheduledAt: combinedDateTime || undefined,
      author: {
        connect: {
          id: organization.members.find((member) => member.userId === session.user.id)?.id
        }
      },
      organization: {
        connect: {
          id: organization.id
        }
      },
      banner: postInfo[0].banner ? {
        connect: {
          id: postInfo[0].banner.id
        }
      } : undefined,
      tags: {
        connect: postInfo[0].tags.map((tag) => ({ id: tag }))
      },
      variants: {
        createMany: postInfo.slice(1).length > 0 ? {
          data: postInfo.slice(1).map((variant) => ({
            id: nanoid(),
            title: variant.title,
            excerpt: variant.excerpt,
            content: variant.content,
            lang: variant.lang,
            banner: variant.banner ? {
              connect: {
                id: variant.banner.id
              }
            } : undefined,
            organizationId: organization.id
          }))
        } : undefined
      },
      meta: {
        createMany: postInfo[0].metadatas.length > 0 ? {
          data: postInfo[0].metadatas.map((metadata) => ({
            id: metadata.id || nanoid(),
            key: metadata.key,
            value: metaStringify(metadata.value),
            type: metadata.type
          }))
        } : undefined
      },
      slug: slugify(postInfo[0].title)
    };

    const updatePostPayload: Prisma.PostUpdateArgs = {
      // @ts-expect-error - This is a hack, TypeScript please ignore this
      id: postId,
      data: {
        title: postInfo[0].title,
        excerpt: postInfo[0].excerpt,
        content: postInfo[0].content,
        lang: postInfo[0].lang,
        bannerId: postInfo[0].banner ? postInfo[0].banner.id : undefined,
        meta: {
          upsert: postInfo[0].metadatas.length > 0 ? postInfo[0].metadatas.map((metadata) => ({
            where: {
              id: metadata.id
            },
            update: {
              key: metadata.key,
              value: metaStringify(metadata.value),
              type: metadata.type
            },
            create: {
              id: metadata.id || nanoid(),
              key: metadata.key,
              value: metaStringify(metadata.value),
              type: metadata.type
            }
          })) : undefined
        },
        tags: {
          set: postInfo[0].tags.map((tag) => ({ id: tag }))
        },
        variants: {
          upsert: postInfo.slice(1).length > 0 ? postInfo.slice(1).map((variant) => ({
            where: {
              id: variant.variantId
            },
            update: {
              title: variant.title,
              excerpt: variant.excerpt,
              content: variant.content,
              lang: variant.lang,
              bannerId: variant.banner ? variant.banner.id : undefined,
              authorId: organization.members.find((member) => member.userId === session.user.id)?.id
            },
            create: {
              id: nanoid(),
              title: variant.title,
              excerpt: variant.excerpt,
              content: variant.content,
              lang: variant.lang,
              bannerId: variant.banner ? variant.banner.id : undefined,
              authorId: organization.members.find((member) => member.userId === session.user.id)?.id,
              organizationId: organization.id
            }
          })) : undefined
        }
      }
    };

    setIsSaving(true);
    // @ts-expect-error - This is a hack, TypeScript please ignore this
    mutation(isNew ? createPostPayload : updatePostPayload, {
      onSuccess: () => {
        toast.success(isNew ? "Post created successfully." : "Post updated successfully.");
        router.push("/app/posts");
        setIsSaving(false);
      },
      onError: () => {
        toast.error(`Failed to ${isNew ? "create" : "update"} post.`);
        setIsSaving(false);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? "Save Post" : "Update Post"}</CardTitle>
        <CardDescription>Save or update the post to the API endpoint.</CardDescription>
      </CardHeader>
      {isNew && (
        <CardContent>
          <div className="flex flex-row gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button id="date" variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? dayJS(date).format("MMM DD, YYYY") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus fromDate={startOfToday()} />
              </PopoverContent>
            </Popover>
            <Select onValueChange={setTime} defaultValue={time} disabled={!date}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>

              <SelectContent>
                {Array.from({ length: 96 }, (_, i) => {
                  const hours = String(Math.floor(i / 4)).padStart(2, "0");
                  const minutes = String((i % 4) * 15).padStart(2, "0");
                  return <SelectItem key={i} value={`${hours}:${minutes}`}>{`${hours}:${minutes}`}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <div>
              <Button variant="outline" onClick={() => {
                setDate(undefined);
                setTime(undefined);
              }} disabled={!date} size="icon">
                <CalendarOff />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
      {organization && !isPending && session && !isSessionPending ? (
        <CardFooter className="flex flex-wrap md:justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => createOrUpdatePost(false)}>
            <BookDashed size={16} /> {isNew ? "Save as Draft" : "Unpublish"}
          </Button>

          {!isNew && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 size={16} /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  Are you sure you want to delete this post? All of your data associated with this post will be permanently removed.
                  &nbsp;This action cannot be undone.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      deletePost.mutate(postId, {
                        onSuccess: () => {
                          toast.success("Post deleted successfully.");
                          router.push("/app/posts");
                        },
                        onError: () => {
                          toast.error("Failed to delete post.");
                        }
                      });
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button variant="default" size="sm" onClick={() => createOrUpdatePost(true)} disabled={isSaving}>
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : (isNew ? <FilePenLine size={16} /> : <FilePen size={16} />)}
            {isNew
              ? combinedDateTime
                ? "Schedule"
                : "Publish"
              : "Update"
            }
          </Button>
        </CardFooter>
      ) : (
        <CardFooter className="flex justify-end gap-2">
          <Skeleton className="w-20 h-8" />
          <Skeleton className="w-20 h-8" />
        </CardFooter>
      )}
    </Card>
  );
};