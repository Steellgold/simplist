"use client";

import { authClient } from "@/lib/auth-client";
import { ReactElement } from "react";
import { NoOrganizations } from "./_lib/no-organizations";
import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";

const Home = (): ReactElement => {
  const { data: activeOrganization, isPending: isActiveOrganizationPending } = authClient.useActiveOrganization();
  
  if (!activeOrganization) {
    return <NoOrganizations />;
  }

  if (isActiveOrganizationPending) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BreadcrumbSetter items={[{ label: "Organization" }]} />

      <pre>
        {JSON.stringify(JSON.parse(activeOrganization?.metadata), null, 2)}
      </pre>
    </>
  );
};

export default Home;