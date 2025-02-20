"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { PasswordInput } from "@workspace/ui/components/input-password";
import { Component } from "@workspace/ui/components/utils/component";
import { toast } from "@workspace/ui/hooks/use-toast";
import { CircleAlert, Loader2 } from "lucide-react";
import { PropsWithChildren, useState } from "react";

type PasswordConfirmationDialogProps = PropsWithChildren & {
  action: (password: string) => void | Promise<void>;

  actionType?: "delete" | "update";
}

export const PasswordConfirmationDialog: Component<PasswordConfirmationDialogProps> = ({ children, action, actionType }) => {
  const [isPending, setPending] = useState(false);
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={() => {
      setOpen(!isOpen);
      setPending(false);
    }} open={isOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border" aria-hidden="true">
            <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Confirm the action
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              {
                actionType === "delete"
                  ? "This action cannot be undone. To confirm, please enter your password."
                  : "To confirm your changes, please enter your password."
              }
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          className="space-y-5"
          onSubmit={async(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);

            await authClient.changePassword({
              currentPassword: e.currentTarget.password.value,
              newPassword: e.currentTarget.password.value,
              fetchOptions: {
                onError: () => {
                  setPending(false);
                  toast({
                    title: "Oops!",
                    description: "It seems like the password you entered is incorrect. Please try again.",
                    variant: "destructive"
                  })
                },
                onRequest: () => {
                  setPending(true);
                  toast({
                    title: "Verifying your identity",
                    description: "Please wait while we verify your identity.",
                  })
                },
                onSuccess: async() => {
                  toast({
                    title: "Identity confirmed",
                    description: "You have successfully confirmed your identity.",
                  })

                  setOpen(false);
                  await action(formData.get("password") as string);
                }
              }
            })
          }}
        >
          <PasswordInput label="Type your password to confirm the action" showForgotPassword={false} />
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Confirm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
