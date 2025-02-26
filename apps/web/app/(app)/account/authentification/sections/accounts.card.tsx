"use client";

import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ReactElement, useState } from "react";
import { GitHub, Google } from "@workspace/ui/icons";
import { useGetAccounts } from "@/hooks/use-accounts";
import { Globe, Link, Loader2, Unlink } from "lucide-react";
import { dayJS } from "@/lib/dayjs";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/hooks/use-toast";

const providers = ["credential", "github", "google"];

export const SocialAccountsCard = (): ReactElement => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const { accounts, isPending } = useGetAccounts();

  if (isSessionPending) {
    return <Skeleton className="h-60" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Accounts</CardTitle>
        <CardDescription className="mt-1 text-sm">
          Manage your connected social accounts for easier sign-in
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {isPending && Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-16" />
        ))}

        {!isPending && accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-background">
                {account.provider === "github" ? (
                  <GitHub className="h-5 w-5" />
                ) : account.provider === "google" ? (
                  <Google className="h-5 w-5" />
                ) : (
                  <Globe className="h-5 w-5" />
                )}
              </div>

              <div>
                <p className="font-medium capitalize">{account.provider}</p>

                <p className="text-sm text-muted-foreground">
                  {account.provider == "credential" ? "Account created" : "Connected"} on <strong>{dayJS(account.createdAt).format("MMMM D, YYYY")}</strong>
                </p>
              </div>
            </div>

            {account.provider !== "credential" && (
              <Button
                variant="outline"
                size="sm"
                onClick={async() => {
                  setDisconnecting(account.provider);

                  await authClient.unlinkAccount({
                    providerId: account.provider,
                    fetchOptions: {
                      onError: (ctx) => {
                        setDisconnecting(null);
                        toast({
                          title: "Error disconnecting account",
                          description: ctx.error.message ?? "An error occurred while disconnecting your account",
                          variant: "destructive"
                        })
                      },
                      onSuccess: () => {
                        setDisconnecting(null);
                        toast({
                          title: "Account disconnected",
                          description: "You have successfully disconnected your account"
                        })
                      }
                    }
                  })
                }}
                disabled={disconnecting !== null || connecting !== null}
              >
                {disconnecting === account.provider ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Unlink className="h-4 w-4" />
                    Disconnect
                  </>
                )}
              </Button>
            )}
          </div>
        ))}

        {!isPending && providers.map((provider) => {
          if (accounts.some((account) => account.provider === provider)) {
            return null;
          }

          return (
            <div
              key={provider}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-background">
                  {provider === "github" ? (
                    <GitHub className="h-5 w-5" />
                  ) : provider === "google" ? (
                    <Google className="h-5 w-5" />
                  ) : (
                    <Globe className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <p className="font-medium capitalize">{provider}</p>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={async() => {
                  setConnecting(provider);
                  
                  await authClient.linkSocial({
                    provider: provider as "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit",
                    fetchOptions: {
                      onError: () => {
                        setConnecting(null);
                        toast({
                          title: "Error connecting account",
                          description: "An error occurred while connecting your account",
                          variant: "destructive"
                        })
                      },
                      onSuccess: () => {
                        setConnecting(null);
                        toast({
                          title: "Account connected",
                          description: "You have successfully connected your account"
                        })
                      }
                    }
                  })
                }}
                disabled={connecting !== null || disconnecting !== null}
              >
                {connecting === provider ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Link className="h-4 w-4" />
                    Connect
                  </>
                )}
              </Button>
            </div>
          )
        })}
      </CardContent>

      <CardFooter>
        <div className="flex flex-col items-start space-y-0.5">
          <p className="text-sm text-muted-foreground">Connected accounts let you sign in using your social accounts and enhance account security.</p>
          <p className="text-sm text-red-500 mt-1">Your accounts must have the same email address to be linked together.</p>
        </div>
      </CardFooter>
    </Card>
  );
};