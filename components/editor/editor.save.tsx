"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../ui/card";
import { useCreatePost, useDeletePost, useUpdatePost } from "@/lib/actions/post/post.hook";
import type { Component } from "../component";
import type { EditorSaveProps } from "./editor.types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { startOfToday } from "date-fns";
import {
  CalendarClock,
  CalendarCog,
  CalendarIcon,
  CalendarOff,
  ChevronDown,
  FilePenLine,
  Loader2,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useActiveOrganization, useSession } from "@/lib/auth/client";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { metaStringify, slugify } from "@/lib/utils";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export const EditorSave: Component<EditorSaveProps> = ({ isNew, postInfo, postId, activeIndex }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [combinedDateTime, setCombinedDateTime] = useState<Date | null>(null);

  useEffect(() => {
    if (date && time) {
      const [hours, minutes] = time.split(":");
      const combined = dayJS(date).set("hours", Number(hours)).set("minutes", Number(minutes)).toDate();
      setCombinedDateTime(combined);
    }
  }, [date, time]);

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [nowPDialogOpen, setNowPDialogOpen] = useState(false);

  const router = useRouter();

  const update = useUpdatePost();
  const create = useCreatePost();
  const deletePost = useDeletePost();

  const { data: organization, isPending } = useActiveOrganization();
  const { data: session, isPending: isSessionPending } = useSession();

  const CoU = (published: boolean, clearSchedule = false, addPublishedAt = false): void => {
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
      scheduledAt: addPublishedAt || clearSchedule ? null : (combinedDateTime || undefined),
      publishedAt: new Date(),
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
        scheduledAt: addPublishedAt || clearSchedule ? null : (combinedDateTime || undefined),
        publishedAt: addPublishedAt ? new Date() : undefined,
        published: published,
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
        toast.success(`Post ${isNew ? "created" : "updated"} successfully.`);
        router.push("/app/posts");
        setIsSaving(false);
      },
      onError: () => {
        toast.error(`Failed to ${isNew ? "create" : "update"} post.`);
        setIsSaving(false);
      }
    });
  };

  const deletePostHandler = (): void => {
    setIsDeleting(true);
    deletePost.mutate(postId, {
      onSuccess: () => {
        toast.success("Post deleted successfully.");
        router.push("/app/posts");
        setIsDeleting(false);
      },
      onError: () => {
        toast.error("Failed to delete post.");
        setIsDeleting(false);
      }
    });
  };

  if (activeIndex !== 0) return <></>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? "Save Post" : "Update Post"}</CardTitle>
        <CardDescription>Save or update the post to the API endpoint.</CardDescription>
      </CardHeader>

      {organization && !isPending && session && !isSessionPending ? (
        <CardFooter className="flex flex-wrap md:justify-end gap-2">
          {!isNew && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isSaving || isDeleting}>
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}Delete
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
                  <AlertDialogAction variant="destructive" onClick={deletePostHandler}>
                    {isDeleting ? "Deleting..." : "Delete Post"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm" disabled={isSaving || isDeleting}>
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                {isNew ? "Save" : "Update"}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => CoU(isNew ? true : false)}>
                <FilePenLine size={16} />
                {isNew ? "Publish" : "Update"}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {!postInfo[0].published && (
                <DropdownMenuItem onClick={() => setScheduleDialogOpen(true)}>
                  {isNew ? <CalendarClock size={16} /> : <CalendarCog size={16} />}
                  {isNew ? "Schedule Post" : postInfo[0].scheduledAt ? "Reschedule Post" : "Schedule Post"}
                </DropdownMenuItem>
              )}

              {((!isNew && postInfo[0].scheduledAt) || (!isNew && !postInfo[0].published)) && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => setNowPDialogOpen(true)}>
                    <CalendarOff size={16} />
                    Publish Now
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      ) : (
        <CardFooter className="flex justify-end gap-2">
          <Skeleton className="w-20 h-8" />
          <Skeleton className="w-20 h-8" />
        </CardFooter>
      )}

      <AlertDialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Schedule Post</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Choose a date and time to schedule the post.
          </AlertDialogDescription>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? dayJS(date).format("MMM DD, YYYY") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus fromDate={startOfToday()} />
            </PopoverContent>
          </Popover>

          <Select onValueChange={setTime} defaultValue={time}>
            <SelectTrigger>
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

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!combinedDateTime) {
                  toast.error("Please select a date and time to schedule the post.");
                  return;
                }

                CoU(false);
                setScheduleDialogOpen(false);
              }}
            >
              Schedule Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={nowPDialogOpen} onOpenChange={setNowPDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish the Post Now</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to publish the post now?
            You always can after publishing the post &apos;unpublish&apos; it with the button &apos;Save as Draft&apos;.
          </AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                CoU(true, true, true);
                setIsSaving(true);
                setNowPDialogOpen(false);
              }}
            >
              Publish Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};