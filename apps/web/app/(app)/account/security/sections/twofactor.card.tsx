"use client";

import { PasswordConfirmationDialog } from "@/components/password-confirmation-dialog";
import { authClient } from "@/lib/auth-client";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, } from "@workspace/ui/components/input-otp";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@workspace/ui/components/alert-dialog";
import { toast } from "@workspace/ui/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";
import QRCode from "react-qr-code";
import { Loader2, RectangleEllipsis } from "lucide-react";

export const SectionA2FCard = () => {
  const [isOpen, setOpen] = useState(false);

  const [isPending, setPending] = useState(false);

  const [twoFactorVerifyURI, setTwoFactorVerifyURI] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={() => setOpen(!isOpen)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Two-factor authentication</AlertDialogTitle>
            <AlertDialogDescription>
              Scan the QR code below to enable two-factor authentication on your account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {isPending && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border" aria-hidden="true">
                <Loader2 className="animate-spin opacity-80" size={16} strokeWidth={2} />
              </div>
            </div>
          )}

          {!isPending && (
            <div className="flex flex-col items-center gap-2">
              <QRCode value={twoFactorVerifyURI} />
              <InputOTP
                maxLength={6}
                autoFocus
                onComplete={
                  async(code) => {
                    const { data, error } = await authClient.twoFactor.verifyTotp({
                      code
                    });

                    // TODO
                  }
                }
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Two-factor authentication</CardTitle>
            <CardDescription>
              Add an extra layer of security to your account.
            </CardDescription>
          </div>

          <PasswordConfirmationDialog
            actionType="update"
            action={async(password: string) => {
              const schema = z.object({ password: z.string() });
              const result = schema.safeParse({ password });
              if (result.error) {
                toast({
                  title: "An error occurred",
                  description: result.error.message ?? "An error occurred",
                  variant: "destructive",
                })
                return;
              }

              const { data } = await authClient.twoFactor.enable({
                password,
                fetchOptions: {
                  onRequest: () => {
                    setOpen(true);
                    setPending(true);
                  },
                  onError: () => {
                    setOpen(false);
                    setPending(false);
                    toast({
                      title: "An error occurred",
                      description: "An error occurred while enabling two-factor authentication.",
                      variant: "destructive",
                    });
                  },
                  onSuccess: () => {
                    setPending(false);
                  }
                }
              });

              const a2fSchema = z.object({
                totpURI: z.string(),
                backupCodes: z.array(z.string())
              });

              const a2fResult = a2fSchema.safeParse(data);
              if (a2fResult.error) {
                console.error("A2F error", a2fResult.error);
                toast({
                  title: "An error occurred",
                  description: a2fResult.error.message ?? "An error occurred",
                  variant: "destructive",
                });
                return;
              }

              console.log("A2F result", a2fResult.data);
              setTwoFactorVerifyURI(a2fResult.data.totpURI);
              setBackupCodes(a2fResult.data.backupCodes);
            }}>
            <Button variant="outline" size="sm">
              <RectangleEllipsis size={16} />
              Configure
            </Button>
          </PasswordConfirmationDialog>
        </CardHeader>

        <CardContent>
        </CardContent>
      </Card>
    </>
  );
};