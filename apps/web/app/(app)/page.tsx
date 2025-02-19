"use client";

import { authClient } from "@/lib/auth-client";
import { ReactElement } from "react";

const Home = (): ReactElement => {
  const { data: activeOrganization, isPending: isActiveOrganizationPending } = authClient.useActiveOrganization();
  if (isActiveOrganizationPending) {
    return <div>Loading...</div>;
  }

  if (!activeOrganization) {
    return <div>No active organization</div>;
  }

  return (
    <pre>
      {JSON.stringify(JSON.parse(activeOrganization?.metadata), null, 2)}
    </pre>
  );
};

export default Home;