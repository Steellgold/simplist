"use client";

import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@workspace/ui/components/input-otp";
import { Component } from "@workspace/ui/components/utils/component";
import { toast } from "@workspace/ui/hooks/use-toast";
import { CircleAlert } from "lucide-react";
import { PropsWithChildren, useState } from "react";

type TotpConfirmationDialogProps = PropsWithChildren & {
  action: (code: string) => void | Promise<void>;
  actionType?: "delete" | "update";
}

export const TotpConfirmationDialog: Component<TotpConfirmationDialogProps> = ({ children, action, actionType }) => {
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
              Two-Factor Authentication Required
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              {
                actionType === "delete"
                  ? "This action cannot be undone. Please enter your 2FA code to confirm."
                  : "To confirm your changes, please enter your 2FA code."
              }
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5">
          <InputOTP
            maxLength={6}
            autoFocus
            disabled={isPending}
            onComplete={async(code) => {
              await authClient.twoFactor.verifyTotp({
                code,
                fetchOptions: {
                  onRequest: () => {
                    setPending(true);
                    toast({
                      title: "Verifying Code",
                      description: "Please wait while we verify your 2FA code.",
                    });
                  },
                  onError: () => {
                    setPending(false);
                    toast({
                      title: "Invalid Code",
                      description: "The 2FA code you entered is incorrect. Please try again.",
                      variant: "destructive"
                    });
                  },
                  onSuccess: async() => {
                    toast({
                      title: "Code Verified",
                      description: "Your 2FA code has been verified successfully.",
                    });

                    setOpen(false);
                    await action(code);
                  }
                }
              });
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </DialogContent>
    </Dialog>
  );
}