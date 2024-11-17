"use client";

import { cloneElement, useState, type ReactElement } from "react";
import { integrations, type Integration } from "@/lib/integrations";
import { IntegrationCard } from "@/components/integrations/integration-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ConfigureDiscordIntegration } from "./itgs/itg-discord";
import type { ConfigurationProps } from "./type";

export const NoIntegrations = (): ReactElement => {
  const [activeConfig, setActiveConfig] = useState<Integration | null>(null);

  const CONFIGURATIONS: Record<Integration["type"], ReactElement<ConfigurationProps>> = {
    "DISCORD_WEBHOOK": <ConfigureDiscordIntegration integration={integrations[0]} />
  };

  return (
    <>
      {!activeConfig ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">No integrations connected yet</h1>
              <p className="text-sm text-muted-foreground">Connect your favorite services to automate your workflow.</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.type}
                integration={integration}
                showConfigureButton
                actionButton={<Button variant={"outline"} onClick={() => setActiveConfig(integration)}>Configure</Button>}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4 flex flex-col gap-4 justify-center items-center">
          <div className="flex flex-row items-center gap-4 w-full max-w-xl">
            <Button variant={"outline"} size={"icon"} onClick={() => setActiveConfig(null)}>
              <ArrowLeft />
            </Button>

            <div className="w-full max-w-lg">
              <h1 className="text-2xl font-bold">Configure {activeConfig.name}</h1>
              <p className="text-sm text-muted-foreground">{activeConfig.description}</p>
            </div>
          </div>

          {cloneElement(CONFIGURATIONS[activeConfig.type], {
            isNew: true,
            onCanceled: () => setActiveConfig(null),
            onSaved: () => setActiveConfig(null)
          })}
        </div>
      )}
    </>
  );
};