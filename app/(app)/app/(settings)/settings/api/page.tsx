"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCreateKey, useGetKeys, useInvalidateKey } from "@/lib/actions/key/key.hook";
import { CalendarClock, Copy, Loader2, NotepadText, Trash2 } from "lucide-react";
import { useEffect, useState, type ReactElement } from "react";
import type { GetKeyType } from "@/lib/actions/key/key.types";
import { useBreadcrumbStore } from "@/hooks/use-breadcrumb";
import { useActiveOrganization } from "@/lib/auth/client";
import type { Component } from "@/components/component";
import { Textarea } from "@/components/ui/textarea";
import { formatExpiration } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { dayJS } from "@/lib/day-js";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const Page = (): ReactElement => {
  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);
  const { data: keys, isPending } = useGetKeys();
  const { data: organization, isPending: isOrganizationPending } = useActiveOrganization();

  const invalidate = useInvalidateKey();

  useEffect(() => {
    setBreadcrumb([{ href: "/settings", label: "Settings" }], "API Keys");
  }, [setBreadcrumb]);

  return (
    <>
      <Header keys={keys ?? []} />
      <div className="mt-4">
        <div className="mt-4 border border border-muted rounded-md">
          <div className="flex flex-col w-full">
            {!isPending && !isOrganizationPending && keys ? keys.sort((a, b) => {
              if (a.active && !b.active) return -1;
              if (!a.active && b.active) return 1;
              return dayJS(b.createdAt).diff(dayJS(a.createdAt));
            }).map((key) => {
              const member = organization?.members.find((member) => member.id === key.memberId);

              return (
                <div className={cn(
                  "w-full flex items-center justify-between border-b last:border-b-0 p-4",
                  "hover:bg-white/10",
                  "last:rounded-b-md first:rounded-t-md",
                  "transition-colors"
                )} key={key.key}>
                  <div className="hidden sm:block md:w-[15%]">
                    <div className="font-medium text-sm flex items-center">
                      {key.name}

                      {key.note && (
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger>
                              <NotepadText className="w-4 h-4 ml-2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              {key.note}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{key.key}</div>
                  </div>

                  <div className="md:w-[25%]">
                    <div className="text-sm text-muted-foreground hidden md:block">
                      <strong>Created:</strong>&nbsp;
                      {dayJS(key.createdAt).format("MMM D, YYYY")}
                    </div>

                    <div className="text-sm text-muted-foreground hidden md:block">
                      <strong>Last Used:</strong>&nbsp;
                      {key.lastUsedAt ? dayJS(key.lastUsedAt).format("MMM D, YYYY") : "Never"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:w-[30%]">
                    {member?.user.image && (
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={member.user.image} />
                        <AvatarFallback>{member.user.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                    )}

                    <span className="ml-2">{member?.user.name}</span>
                  </div>

                  <div className="md:w-[30%]">
                    {key.active && key.expiresAt == "" ? (
                      <Badge variant="apikey-active">Active</Badge>
                    ) : key.active && key.expiresAt && dayJS(key.expiresAt).isAfter(dayJS()) ? (
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="apikey-active" className="flex items-center gap-1">
                              <CalendarClock className="w-3 h-3" />
                                Active
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                              Expires {formatExpiration(dayJS(key.expiresAt).toDate())}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="apikey-inactive">Inactive</Badge>
                    )}
                  </div>

                  <div className="flex justify-end">

                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button size={"icon-sm"} variant={"outline-destructive"}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Invalidating API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                              This action is irreversible. Are you sure you want to invalidate this API key?
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                              toast.promise(
                                invalidate.mutateAsync({
                                  key: key.key,
                                  secuValue: key.LinkingKey
                                }), {
                                  loading: "Invalidating...",
                                  success: "Key invalidated!",
                                  error: "Failed to invalidate key"
                                }
                              );
                            }}
                          >
                              Invalidate
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            }) : (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div className={cn(
                    "w-full flex items-center justify-between border-b last:border-b-0 p-4",
                    "hover:bg-white/10",
                    "last:rounded-b-md first:rounded-t-md",
                    "transition-colors"
                  )} key={i}>
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-24 h-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-24 h-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-24 h-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-24 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

type ExpiryType = "1m" | "3m" | "6m" | "1y" | "never";

const Header: Component<{ keys: GetKeyType[] }> = ({ keys }) => {
  const [name, setName] = useState<string>("");
  const [note, setNote] = useState<string | null>(null);

  const [expire, setExpire] = useState<ExpiryType>("never");

  const [key, setKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const expireStringToDate = (choosed: ExpiryType): Date | null => {
    if (choosed === "1m") return dayJS().add(1, "month").toDate();
    if (choosed === "3m") return dayJS().add(3, "month").toDate();
    if (choosed === "6m") return dayJS().add(6, "month").toDate();
    if (choosed === "1y") return dayJS().add(1, "year").toDate();
    if (choosed === "never") return null;
    return null;
  };

  const create = useCreateKey();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">API Keys</h1>
        <p className="text-sm text-muted-foreground">{keys?.length} key(s) found</p>
      </div>
      <div className="flex flex-col md:flex-row gap-2 sm:gap-1 mt-2 md:mt-0">
        <Button onClick={() => setDialogOpen(true)}>Create Key</Button>

        <Dialog open={dialogOpen} onOpenChange={() => {
          setNote(null);
          setName("");
          setExpire("never");
          setKey(null);
          setLoading(false);

          setDialogOpen(!dialogOpen);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {key ? "Your API Key" : "Generate new"}
              </DialogTitle>
              <DialogDescription>
                {key
                  ? "Once you've closed this dialog box, you won't be able to open it again, so make sure you've copied and saved your API key."
                  : "Generate a new API key for getting access to the API and retrieve your posts!"
                }
              </DialogDescription>
            </DialogHeader>

            {key ? (
              <div className="flex items-center gap-2">
                <Input value={key} readOnly />
                {/* copy */}
                <Button size={"icon-sm"} onClick={() => {
                  toast.promise(
                    navigator.clipboard.writeText(key), {
                      loading: "Copying...",
                      success: "Copied!",
                      error: "Failed to copy"
                    }
                  );
                }}>
                  <Copy className="w-6 h-6" />
                </Button>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <Textarea value={note ?? ""} onChange={(e) => setNote(e.target.value)} className="resize-none" placeholder="Note (optional)" />

                <Select onValueChange={(value: ExpiryType) => setExpire(value)} value={expire}>
                  <SelectTrigger>
                    <SelectValue placeholder="Expires in" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectSeparator />
                    <SelectItem value="1m">1 month</SelectItem>
                    <SelectItem value="3m">3 months</SelectItem>
                    <SelectItem value="6m">6 months</SelectItem>
                    <SelectItem value="1y">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setDialogOpen(false);
                setKey(null);
                setName("");
                setNote(null);
                setExpire("never");
                setLoading(false);
              }}>
                {key ? "Close" : "Cancel"}
              </Button>

              <Button
                onClick={() => {
                  if (!name) {
                    toast.error("Name is required");
                    return;
                  }

                  if (name.length < 3 || name.length > 16) {
                    toast.error("Name must be between 3-16 characters");
                    return;
                  }

                  if (note && note.length < 3 || note && note.length > 56) {
                    toast.error("Note must be between 3-56 characters");
                    return;
                  }

                  if (loading) return;
                  setLoading(true);
                  toast.promise(
                    create.mutateAsync(
                      { name, note: note ?? "", expiresAt: expireStringToDate(expire)?.toUTCString() ?? "" }, {
                        onSuccess: (data) => {
                          setKey(data.key);
                          setLoading(false);
                        },
                        onError: () => setLoading(false)
                      }
                    ), {
                      loading: "Creating key...",
                      success: "Key created! Please save it somewhere safe.",
                      error: "Failed to create key"
                    }
                  );
                }}
                disabled={key !== null || loading}
              >
                {/* {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <></>} */}
                Create Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;