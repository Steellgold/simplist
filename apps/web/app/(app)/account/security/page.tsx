"use client";

import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Rendered } from "@workspace/ui/components/rendered";
import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Check, Minus, X } from "lucide-react";
import { SectionPasskeysCard } from "./sections/passkeys.card";
import { useSessions } from "@/hooks/use-sessions";
import { SectionSessionsCard } from "./sections/sessions.card";

const AccountSecurityPage = () => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: passkeys, isPending: isPasskeysPending } = authClient.useListPasskeys();

  const sessions = useSessions();

  if (isSessionPending || isPasskeysPending || sessions.pending) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="space-y-6 max-w-4xl mx-auto">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <>
      <BreadcrumbSetter items={[ { label: "Account" }, { label: "Security" } ]} />

      <Rendered>
        <div className="flex-1 overflow-auto">
          <div className="space-y-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription className="mt-1 text-sm">
                  Review your account security settings.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex flex-col space-y-2">
                  {session?.user.twoFactorEnabled ? (
                    <div className="flex items-center space-x-2">
                      <Check className="text-green-500" size={16} />
                      <span>Two-factor authentication is enabled.</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <X className="text-red-500" size={16} />
                      <span>Two-factor authentication is not enabled.</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  {passkeys && passkeys.length > 0 ? (
                    <div className="flex items-center space-x-2">
                      <Check className="text-green-500" size={16} />
                      <span>Passkeys are enabled.</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <X className="text-red-500" size={16} />
                      <span>No passkeys are configured.</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  {sessions.list.length > 1 ? (
                    <div className="flex items-center space-x-2">
                      <Minus className="text-gray-500" size={16} />
                      <span>Multiple sessions are active (<kbd>{sessions.list.length}</kbd> total).</span>
                    </div>
                  ) : <></>}
                </div>
              </CardContent>
            </Card>

            <SectionPasskeysCard />
            <SectionSessionsCard />
          </div>
        </div>
      </Rendered>
    </>
  );
};

export default AccountSecurityPage;