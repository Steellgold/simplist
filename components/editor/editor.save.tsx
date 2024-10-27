"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../ui/card";
import { useCreatePost, useUpdatePost } from "@/lib/actions/post/post.hook";
import type { Component } from "../component";
import type { EditorSaveProps } from "./editor.types";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { format, startOfToday } from "date-fns";
import {
  BookDashed,
  CalendarIcon,
  CalendarOff,
  FilePen,
  FilePenLine,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useActiveOrganization, useSession } from "@/lib/auth/client";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Prisma } from "@prisma/client";

export const EditorSave: Component<EditorSaveProps> = ({ isNew, postInfo, postId, toDelete }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const router = useRouter();

  const update = useUpdatePost();
  const create = useCreatePost();
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

    if (!organization || !session) {
      toast.error("Organization or session is not available.");
      return;
    }

    const mutation = isNew ? create.mutate : update.mutate;

    const createPostPayload: Prisma.PostCreateInput = {
      id: postId, // Because we are generating the ID on the "Editor" component to pass it down to the "EditorBanner" component (for uploading images)
      published,
      organization: { connect: { id: organization.id } },
      author: { connect: { id: organization.members.find(m => m.userId === session.user.id)?.id } },
      publishedAt: combinedDateTime,
      title: postInfo[0].title,
      excerpt: postInfo[0].excerpt,
      content: postInfo[0].content,
      lang: postInfo[0].lang ?? "EN",
      variants: {
        createMany: {
          data: postInfo.slice(1).map((variant) => ({
            id: nanoid(20),
            title: variant.title,
            excerpt: variant.excerpt,
            content: variant.content,
            lang: variant.lang ?? "EN",
            organizationId: organization.id,
            authorId: organization.members.find(m => m.userId === session.user.id)?.id,
            files: variant.banner ? {
              createMany: {
                data: [{
                  id: variant.banner.id,
                  url: variant.banner.url,
                  mimeType: variant.banner.type,
                  size: variant.banner.size,
                  name: variant.banner.name,
                  authorId: organization.members.find(m => m.userId === session.user.id)?.id,
                  isBanner: true,
                  postId: postId,
                  organizationId: organization.id
                }]
              }
            } : []
          }))
        }
      },
      files: {
        createMany: {
          data: postInfo[0].banner ? [{
            id: postInfo[0].banner.id,
            url: postInfo[0].banner.url,
            mimeType: postInfo[0].banner.type,
            size: postInfo[0].banner.size,
            name: postInfo[0].banner.name,
            authorId: organization.members.find(m => m.userId === session.user.id)?.id,
            isBanner: true,
            organizationId: organization.id
          }] : []
        }
      }
    };

    console.log(postId)
    console.log(postInfo)

    const updatePostPayload: Prisma.PostUpdateArgs = {
      // @ts-expect-error - This is a hack, TypeScript please ignore this
      id: postId,
      data: {
        title: postInfo[0].title,
        excerpt: postInfo[0].excerpt,
        content: postInfo[0].content,
        lang: postInfo[0].lang,
        variants: {
          upsert: postInfo.slice(1).map((variant) => ({
            where: {
              id: variant.variantId || nanoid(20)
            },
            update: {
              id: variant.variantId,
              title: variant.title,
              excerpt: variant.excerpt,
              content: variant.content,
              lang: variant.lang,
              files: variant.banner ? {
                upsert: {
                  where: {
                    id: variant.banner.id
                  },
                  update: {
                    id: variant.banner.id,
                    url: variant.banner.url,
                    mimeType: variant.banner.type,
                    size: variant.banner.size,
                    name: variant.banner.name,
                    authorId: organization.members.find(m => m.userId === session.user.id)?.id,
                    isBanner: true,
                    postId: postId,
                    organizationId: organization.id
                  },
                  create: {
                    id: variant.banner.id,
                    url: variant.banner.url,
                    mimeType: variant.banner.type,
                    size: variant.banner.size,
                    name: variant.banner.name,
                    authorId: organization.members.find(m => m.userId === session.user.id)?.id,
                    isBanner: true,
                    postId: postId,
                    organizationId: organization.id
                  }
                }
              } : {}
            },
            create: {
              id: nanoid(20),
              title: variant.title,
              excerpt: variant.excerpt,
              content: variant.content,
              lang: variant.lang,
              organizationId: organization.id,
              authorId: organization.members.find(m => m.userId === session.user.id)?.id,
              files: {
                createMany: {
                  data: variant.banner ? [{
                    id: variant.banner.id,
                    url: variant.banner.url,
                    mimeType: variant.banner.type,
                    size: variant.banner.size,
                    name: variant.banner.name,
                    authorId: organization.members.find(m => m.userId === session.user.id)?.id,
                    isBanner: true,
                    postId: postId,
                    organizationId: organization.id
                  }] : []
                }
              }
            }
          })),
          deleteMany: {
            lang: {
              in: toDelete.map((lang) => lang)
            }
          }
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
                  {date ? format(date, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus fromDate={startOfToday()} />
              </PopoverContent>
            </Popover>
            <Select onValueChange={setTime} defaultValue={time} disabled={!date}>
              <SelectTrigger id="time"><SelectValue placeholder="Select a time" /></SelectTrigger>
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
        <CardFooter className="flex justify-end gap-2">
          {isNew && (
            <Button variant="outline" size="sm" onClick={() => createOrUpdatePost(false)}>
              <BookDashed size={16} /> Save as Draft
            </Button>
          )}
          <Button variant="default" size="sm" onClick={() => createOrUpdatePost(true)} disabled={isSaving}>
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : (isNew ? <FilePenLine size={16} /> : <FilePen size={16} />)}
            {isNew && !combinedDateTime ? "Save Post" : "Schedule Post"}
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