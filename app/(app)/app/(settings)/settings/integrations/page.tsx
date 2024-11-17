"use client";

import { BreadcrumbUpdater } from "@/components/breadcrumbUpdater";
import { IntegrationCard } from "@/components/integrations/integration-card";
import { useGetIntegrations } from "@/lib/actions/integration/integration.hook";
import type { Integration } from "@/lib/integrations";
import { integrations } from "@/lib/integrations";
import { useState, type ReactElement } from "react";
import { NoIntegrations } from "./empty";
import { Button } from "@/components/ui/button";

export const Page = (): ReactElement => {
  const { data: activeIntegrations, isPending, isRefetching } = useGetIntegrations();
  const [choosedIntegration, setChoosedIntegration] = useState<Integration | null>(null);

  if (isPending || isRefetching) return <div>Loading...</div>;

  if (activeIntegrations?.length === 0) {
    return <NoIntegrations />;
  }

  if (choosedIntegration) {
    return (
      <p>
        Hello
      </p>
    );
  }

  return (
    <>
      <BreadcrumbUpdater links={[{ href: "/settings", label: "Settings" }]} title="Integrations" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-sm text-muted-foreground">
            {isPending
              ? "Loading integrations..."
              : activeIntegrations?.length === 0
                ? "You haven't enabled any integrations yet."
                : `${activeIntegrations ? activeIntegrations.length : 0} integration(s) enabled.`
            }
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {activeIntegrations && activeIntegrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integrations.find((i) => i.type === integration.type) || integrations[0]}
            actionButton={
              <Button variant={"outline"} onClick={() => setChoosedIntegration(integration)}>Configure</Button>
            }
          />
        ))}
      </div>
    </>
  );
};

export default Page;