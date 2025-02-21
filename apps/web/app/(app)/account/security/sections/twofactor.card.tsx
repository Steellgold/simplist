"use client";

import { PasswordConfirmationDialog } from "@/components/password-confirmation-dialog";
import { authClient } from "@/lib/auth-client";
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "@workspace/ui/components/input-otp";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@workspace/ui/components/alert-dialog";
import { toast } from "@workspace/ui/hooks/use-toast";
import { useEffect, useState } from "react";
import { z } from "zod";
import QRCode from "react-qr-code";
import { Check, FileWarning, Loader2, RectangleEllipsis, X } from "lucide-react";

export const SectionA2FCard = () => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [isOpen, setOpen] = useState(false);

  const [isPending, setPending] = useState(false);

  const [twoFactorVerifyURI, setTwoFactorVerifyURI] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const [isVerifying, setVerifying] = useState(false);
  const [isVerified, setVerified] = useState(false);

  const downloadBackupCodes = () => {
    const element = document.createElement("a");
    const file = new Blob([backupCodes.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "backup-codes.txt";
    document.body.appendChild(element); // #FireFox
    element.click();
  }

  useEffect(() => {
    if (!session) return;

    setVerified(session.user.twoFactorEnabled ?? false);
  }, [session]);

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={() => setOpen(!isOpen)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Two-factor authentication</AlertDialogTitle>
            <AlertDialogDescription>
              Scan the QR code or copy the secret key to your authenticator app to enable two-factor authentication.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {isPending && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border" aria-hidden="true">
                <Loader2 className="animate-spin opacity-80" size={16} strokeWidth={2} />
              </div>
            </div>
          )}

          {!isPending && !isVerified && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col md:flex-row gap-4 p-2 border">
                <div className="flex flex-col gap-3">
                  <div className="p-2 bg-white">
                    <QRCode
                      value={twoFactorVerifyURI}
                      size={170}
                    />
                  </div>

                  <Button size="sm" className="w-full" onClick={() => {
                    if (twoFactorVerifyURI) {
                      const secretKey = twoFactorVerifyURI.split("?")[1]?.split("&")[0]?.split("=")[1];
                      if (secretKey) {
                        navigator.clipboard.writeText(secretKey);
                        toast({
                          title: "Copied",
                          description: "The secret key has been copied to your clipboard.",
                        });
                      } else {
                        toast({
                          title: "Error",
                          description: "Failed to extract the secret key.",
                          variant: "destructive",
                        });
                      }
                    } else {
                      toast({
                        title: "Error",
                        description: "Two-factor verification URI is not available.",
                        variant: "destructive",
                      });
                    }
                  }}>
                    Copy secret key
                  </Button>
                </div>

                <div className="p-2 relative">
                  {isVerifying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="animate-spin" size={16} strokeWidth={2} />
                    </div>
                  )}

                  <p className="text-sm mb-2 text-muted-foreground">Enter the code from your authenticator app to enable 2FA.</p>

                  <InputOTP
                    maxLength={6}
                    autoFocus
                    disabled={isVerifying || isVerified}
                    onComplete={
                      async(code) => {
                        await authClient.twoFactor.verifyTotp({
                          code,
                          fetchOptions: {
                            onRequest: () => {
                              setVerifying(true);
                            },
                            onError: () => {
                              setVerifying(false);
                              toast({
                                title: "An error occurred",
                                description: "An error occurred while verifying the two-factor authentication code.",
                                variant: "destructive",
                              });
                            },
                            onSuccess: () => {
                              setVerifying(false);
                              setVerified(true);
                              setOpen(false);

                              toast({
                                title: "Success",
                                description: "Two-factor authentication has been enabled.",
                              });
                            }
                          }
                        });
                      }
                    }
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
              </div>
            </div>
          )}

          <AlertDialogFooter>
            {backupCodes.length > 0 && (
              <Button variant="outline" onClick={() => downloadBackupCodes()} className="border-red-500 text-red-500">
                <FileWarning size={16} className="text-red-500" />
                Download backup codes
              </Button>
            )}

            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Two-factor authentication</CardTitle>
            <CardDescription>
              Extra layer of security for your account.
            </CardDescription>
          </div>

          {isVerified && (
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

                await authClient.twoFactor.disable({
                  password,
                  fetchOptions: {
                    onRequest: () => {
                      toast({
                        title: "Disabling two-factor authentication",
                        description: "Please wait while we disable two-factor authentication.",
                      });
                    },
                    onError: () => {
                      toast({
                        title: "An error occurred",
                        description: "An error occurred while disabling two-factor authentication.",
                        variant: "destructive",
                      });
                    },
                    onSuccess: () => {
                      setVerified(false);
                      toast({ title: "Success", description: "Two-factor authentication has been disabled." });
                    }
                  }
                });
              }}>
              <Button variant="outline" size="sm">
                Disable
              </Button>
            </PasswordConfirmationDialog>
          )}

          {!isVerified && (
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
                  toast({
                    title: "An error occurred",
                    description: a2fResult.error.message ?? "An error occurred",
                    variant: "destructive",
                  });
                  return;
                }

                setTwoFactorVerifyURI(a2fResult.data.totpURI);
                setBackupCodes(a2fResult.data.backupCodes);
              }}>
              <Button variant="outline" size="sm">
                <RectangleEllipsis size={16} />
                Enable
              </Button>
            </PasswordConfirmationDialog>
          )}
        </CardHeader>

        <CardContent>
          {isVerified ? (
            <div className="flex flex-col items-center justify-center p-4 space-y-2">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border" aria-hidden="true">
                <Check className="text-green-500" size={24} />
              </div>

              <div className="flex flex-col items-center space-y-1">
                <p className="text-sm text-center">Two-factor authentication is enabled.</p>
                <span className="text-xs text-muted-foreground">You can disable two-factor authentication at any time.</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 space-y-2">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border" aria-hidden="true">
                <X className="h-5 w-5 text-destructive" />
              </div>

              <p className="text-sm text-center">Two-factor authentication is not enabled.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};