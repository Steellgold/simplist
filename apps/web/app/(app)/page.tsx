"use client";

import { authClient } from "@/lib/auth-client";
import { ReactElement } from "react";
import { NoOrganizations } from "./_lib/no-organizations";

const Home = (): ReactElement => {
  const { data: activeOrganization, isPending: isActiveOrganizationPending } = authClient.useActiveOrganization();
  
  if (!activeOrganization) {
    return <NoOrganizations />;
  }

  if (isActiveOrganizationPending) {
    return <div>Loading...</div>;
  }

  return (
    <pre>
      {JSON.stringify(JSON.parse(activeOrganization?.metadata), null, 2)}
    </pre>
  );
};

export default Home;