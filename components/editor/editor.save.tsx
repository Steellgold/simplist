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

export const EditorSave: Component<EditorSaveProps> = ({ isNew, postInfo, postId }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [date, setDate] = useState<Date | undefined>(startOfToday());
  const [time, setTime] = useState<string>("12:00");
  const router = useRouter();

  const update = useUpdatePost();
  const create = useCreatePost();
  const { data: organization, isPending } = useActiveOrganization();
  const { data: session, isPending: isSessionPending } = useSession();

  const combinedDateTime = useMemo(() => {
    if (!date) return null;
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
    const payload = isNew
      ? {
        id: nanoid(21),
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
              id: nanoid(21),
              title: variant.title,
              excerpt: variant.excerpt,
              content: variant.content,
              lang: variant.lang ?? "EN",
              organizationId: organization.id,
              authorId: organization.members.find(m => m.userId === session.user.id)?.id
            }))
          }
        }
      } : {
        id: postId,
        data: {
          title: postInfo[0].title,
          excerpt: postInfo[0].excerpt,
          content: postInfo[0].content,
          lang: postInfo[0].lang,
          publishedAt: combinedDateTime,
          variants: postInfo.slice(1).map((variant) => ({
            where: { id: variant.variantId },
            data: {
              title: variant.title,
              excerpt: variant.excerpt,
              content: variant.content,
              lang: variant.lang
            }
          }))
        }
      };

    setIsSaving(true);
    // @ts-expect-error - This is a hack, TypeScript please ignore this
    mutation(payload, {
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
          <div className="grid gap-4">
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
            <Select onValueChange={setTime} defaultValue={time}>
              <SelectTrigger id="time"><SelectValue placeholder="Select a time" /></SelectTrigger>
              <SelectContent>{Array.from({ length: 96 }, (_, i) => {
                const hours = String(Math.floor(i / 4)).padStart(2, "0");
                const minutes = String((i % 4) * 15).padStart(2, "0");
                return <SelectItem key={i} value={`${hours}:${minutes}`}>{`${hours}:${minutes}`}</SelectItem>;
              })}</SelectContent>
            </Select>
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