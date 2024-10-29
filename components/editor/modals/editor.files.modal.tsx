"use client";

import type { Component } from "@/components/component";
import type { Banner } from "../editor.types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { useGetFiles } from "@/lib/actions/file/file.hook";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/card";
import { useActiveOrganization } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Images, MousePointerClick, RotateCcw } from "lucide-react";
import { dayJS } from "@/lib/day-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChangeEvent } from "react";
import { useState } from "react";
import type { GetFileType } from "@/lib/actions/file/file.types";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";

type EditorFilesModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void

  onSelected: (file: Banner) => void;
};

export const EditorFilesModal: Component<EditorFilesModalProps> = ({ onSelected, onOpenChange, isOpen }) => {
  const { data: files, isPending, refetch, isRefetching } = useGetFiles();
  const { data: organization, isPending: isOrgPending } = useActiveOrganization();

  const [search, setSearch] = useState<string>("");

  if (isOrgPending) return <Skeleton className="w-full" />;
  if (isPending) return <Skeleton className="w-full" />;

  const filesSearch = files?.filter((file) => file.name.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-4/5 h-4/5 max-w-none max-h-none flex flex-col">
        <AlertDialogHeader>
          <DialogTitle>Select a File</DialogTitle>
          <DialogDescription>Choose a file from your organization&apos;s library.</DialogDescription>
        </AlertDialogHeader>

        <div className="file-grid flex-grow overflow-auto">
          {files && files.length === 0 && (
            <EmptyState
              title="No files found"
              description="There are no files in your organization's library."
              icon={<Images size={24} />}
              actions={[
                <Link href="/app/files" key="view" className={buttonVariants({ variant: "default" })}>
                  Files Library
                </Link>
              ]}
            />
          )}
          <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {isRefetching && Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-44" />
            ))}

            {!isRefetching && filesSearch.map((file) => (
              <Card key={file.id} className="flex flex-col gap-1.5">
                <CardHeader className="flex flex-col p-2">
                  <div
                    className="relative group"
                    onClick={() => onSelected({
                      id: file.id,
                      url: file.url,
                      name: file.name,
                      size: file.size,
                      type: file.mimeType,
                      uploadedAt: file.createdAt,
                      uploadedBy: file.memberId
                    })}
                  >
                    <Image
                      src={file.url}
                      alt={file.name}
                      width={200}
                      height={200}
                      className={cn(
                        "rounded-lg w-full h-44 object-cover",
                        "group-hover:opacity-80 transition-opacity duration-200"
                      )}
                    />

                    <span className={cn(
                      // "flex flex-col items-center justify-center absolute inset-0 hidden group-hover:flex bg-black bg-opacity-50 rounded-lg"
                      "hidden group-hover:flex",
                      "transition-opacity duration-200",
                      "cursor-pointer",
                      "flex-col items-center justify-center absolute inset-0 bg-black bg-opacity-50 rounded-lg"
                    )}>
                      <MousePointerClick size={16} />
                      Click to select
                    </span>
                  </div>

                  <div className="p-2 rounded-b-lg">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{formatBytes(file.size)}</span>
                        <span>{dayJS(file.createdAt).format("DD MMM YYYY")}</span>
                      </div>

                      {organization && organization.members.find((member) => member.id === file.memberId) ? (
                        <span className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <span className="flex items-center gap-1 rounded-lg">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback>{organization.members.find((member) => member.id === file.memberId)?.user.name[0]}</AvatarFallback>
                              <AvatarImage src={organization.members.find((member) => member.id === file.memberId)?.user.image} alt="User Avatar" />
                            </Avatar>
                            {organization.members.find((member) => member.id === file.memberId)?.user.name}
                          </span>
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Uploaded by <code>Unknown</code></span>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Input placeholder="Search files..." onChange={(value: ChangeEvent<HTMLInputElement>) => {
            setSearch(value.target.value);
          }} />

          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
            <RotateCcw size={16} />
            Refresh Files
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};