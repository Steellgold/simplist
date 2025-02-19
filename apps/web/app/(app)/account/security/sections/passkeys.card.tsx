"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { PasswordConfirmationDialog } from "@/components/password-confirmation-dialog";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/hooks/use-toast";
import { Fingerprint, Loader2, Pen, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { dayJS } from "@/lib/dayjs";
import { useState } from "react";
import { Separator } from "@workspace/ui/components/separator";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { z } from "zod";

export const SectionPasskeysCard = () => {
  const { data: passkeys, refetch, isPending, isRefetching } = authClient.useListPasskeys();

  const [isLoading, setLoading] = useState<false | "update" | "delete" | "create">(false);
  const [isOpen, setOpen] = useState<"create" | "update" | false>(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>Passkeys</CardTitle>
          <CardDescription className="mt-1 text-sm">
            Passkeys are used to authenticate with the API.
          </CardDescription>
        </div>

        <Dialog onOpenChange={() => {
          setOpen(isOpen === "create" ? false : "create")
        }} open={isOpen === "create"}>
          <DialogTrigger asChild>
            <Button variant={"outline"} size="sm" disabled={isLoading === "create"} onClick={() => setOpen("create")}>
              {isLoading === "create" ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <Fingerprint size={16} />
                  Add Passkey
                </>
              )}
            </Button>
          </DialogTrigger>

          <DialogContent>
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border" aria-hidden="true">
                <Fingerprint className="opacity-80" size={16} strokeWidth={2} />
              </div>
              <DialogHeader>
                <DialogTitle className="sm:text-center">Create a new passkey</DialogTitle>
                <DialogDescription className="sm:text-center">To create a new passkey, please enter the name of the passkey.</DialogDescription>
              </DialogHeader>
            </div>

            <form
              className="space-y-5"
              onSubmit={async (event) => {
                event.preventDefault();
                const name = event.currentTarget["passkey-name"].value;

                const schema = z.object({
                  passkeyName: z.string().min(3, "The name must be at least 3 characters long.").max(32, "The name must be at most 32 characters long.")
                });

                const result = schema.safeParse({ passkeyName: name });
                if (result.error) {
                  toast({
                    title: "Error while creating passkey",
                    description: result.error.message || "An error occurred while creating the passkey.",
                    variant: "destructive"
                  });

                  return;
                }

                setLoading("create");
                await authClient.passkey.addPasskey({
                  name: result.data.passkeyName,
                  fetchOptions: {
                    onSuccess: () => {
                      refetch();
                      setLoading(false);
                      setOpen(false);
                      toast({
                        title: "Passkey added",
                        description: "The passkey has been successfully added to your account."
                      });
                    },
                    onRequest: () => {
                      setLoading("create");
                      toast({
                        title: "Adding passkey",
                        description: "Please wait while we add the passkey to your account."
                      });
                    },
                    onError: (error) => {
                      setLoading(false);
                      toast({
                        title: "Error while adding passkey",
                        description: error.error.message || "An error occurred while adding the passkey.",
                        variant: "destructive"
                      });
                    }
                  }
                });
              }}
            >
              <div className="space-y-2">
                <Label htmlFor={"passkey-name"}>Project name</Label>
                <Input
                  id={"passkey-name"}
                  type="text"
                  placeholder="Desktop at home"
                  name="passkey-name"
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </DialogClose>

                <Button type="button" className="flex-1" disabled={isLoading === "create"}>
                  {isLoading === "create" ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {isPending || isRefetching ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            {passkeys && passkeys.length > 0 ? (
              <div className="space-y-2">
                {passkeys.map((passkey) => (
                  <div key={passkey.id} className="flex flex-row items-center justify-between p-4 space-x-4 bg-bg-secondary rounded-lg border border-border">
                    <div className="flex flex-col space-y-1">
                      <p className="text-base font-medium">{passkey.name ?? "Unnamed Passkey"}</p>
                      <div className="flex flex-row items-center text-sm text-gray-300">
                        Created on {dayJS(passkey.createdAt).format("MMMM D, YYYY")}
                        <Separator orientation="vertical" className="h-3 mx-2 bg-gray-300" />
                        Used&nbsp;<strong>{passkey.counter}</strong>&nbsp;times
                      </div>
                    </div>

                    <div className="flex flex-row items-center space-x-2">
                      <Dialog onOpenChange={() => {
                        setOpen(
                          isOpen === "update" ? false : "update"
                        )
                      }} open={isOpen === "update"}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={isLoading === "update"}>
                            {isLoading === "update" ? <Loader2 className="w-6 h-6 animate-spin" /> : "Update"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border" aria-hidden="true">
                              <Pen className="opacity-80" size={16} strokeWidth={2} />
                            </div>
                            <DialogHeader>
                              <DialogTitle className="sm:text-center">Update passkey</DialogTitle>
                              <DialogDescription className="sm:text-center">To update the passkey, please enter the new name.</DialogDescription>
                            </DialogHeader>
                          </div>

                          <form className="space-y-5" onSubmit={async (event) => {
                            event.preventDefault();
                            const newName = event.currentTarget["new-name"].value;

                            setLoading("update");
                            await authClient.passkey.updatePasskey({
                              id: passkey.id,
                              name: newName,
                              fetchOptions: {
                                onSuccess: () => {
                                  refetch();
                                  setLoading(false);
                                  setOpen(false);
                                  toast({
                                    title: "Passkey updated",
                                    description: "The passkey has been successfully updated."
                                  });
                                },
                                onRequest: () => {
                                  setLoading("update");
                                  toast({
                                    title: "Updating passkey",
                                    description: "Please wait while we update the passkey."
                                  });
                                },
                                onError: (error) => {
                                  setLoading(false);
                                  toast({
                                    title: "Error while updating passkey",
                                    description: error.error.message || "An error occurred while updating the passkey.",
                                    variant: "destructive"
                                  });
                                }
                              }
                            });
                          }}>
                            <div className="space-y-1">
                              <Label htmlFor={"new-name"}>New name</Label>
                              <Input id="new-name" type="text" placeholder={passkey.name ?? "Unnamed Passkey"} name="new-name" />
                            </div>

                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" variant="outline" className="flex-1">
                                  Cancel
                                </Button>
                              </DialogClose>

                              <Button type="submit" className="flex-1" disabled={isLoading === "update"}>
                                {isLoading == "update" ? <Loader2 className="w-6 h-6 animate-spin" /> : "Update"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <PasswordConfirmationDialog
                        actionType="delete"
                        action={async () => {
                          await authClient.passkey.deletePasskey({
                            id: passkey.id,
                            fetchOptions: {
                              onSuccess: () => {
                                refetch();
                                setLoading(false);
                                
                                toast({
                                  title: "Passkey deleted",
                                  description: "The passkey has been successfully deleted from your account."
                                });
                              },
                              onRequest: () => {
                                setLoading("delete");
                                toast({
                                  title: "Deleting passkey",
                                  description: "Please wait while we delete the passkey from your account."
                                });
                              },
                              onError: (error) => {
                                setLoading(false);
                                toast({
                                  title: "Error while deleting passkey",
                                  description: error.error.message || "An error occurred while deleting the passkey.",
                                  variant: "destructive"
                                });
                              }
                            }
                          })
                        }}
                      >
                        <Button variant="outline" size="sm" disabled={isLoading === "delete"}>
                          {isLoading === "delete" ? <Loader2 className="w-6 h-6 animate-spin" /> : "Revoke"}
                        </Button>
                      </PasswordConfirmationDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 space-y-2">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border" aria-hidden="true">
                  <X className="h-5 w-5 text-destructive" />
                </div>

                <p className="text-sm text-center">
                  No passkeys are configured.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}