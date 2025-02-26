"use client";

import { authClient } from "@/lib/auth-client";
import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { SocialAccountsCard } from "./sections/accounts.card";

const AccountSettingsPage = () => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  if (!session || isSessionPending) {
    return <Skeleton className="h-96" />;
  }

  return (
    <>
      <BreadcrumbSetter items={[ { label: "Account" }, { label: "Authentification" } ]} />
 
      <SocialAccountsCard />
    </>
  );
};

export default AccountSettingsPage;