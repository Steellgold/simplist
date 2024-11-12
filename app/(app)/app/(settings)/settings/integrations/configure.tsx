"use client";

// ----------------------------
//
// Actually only Discord Webhook is present in the integrations list, but in the future there could be
// more integrations. And this file needs to be refactored to support multiple integrations.
//
// ----------------------------

import type { Component } from "@/components/component";
import { DiscordTestingCard } from "@/components/integrations/discord-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Integration } from "@/lib/integrations";
import { useState } from "react";

type Props = {
  integration: Integration;
  isNew?: boolean;

  onCanceled?: () => void;
  onSaved?: () => void;
};

export const ConfigureIntegration: Component<Props> = ({ integration, isNew, onCanceled, onSaved }) => {
  const [ok, setOk] = useState<boolean>(false);

  const [webhookName, setWebhookName] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState<string>("");

  const [embed, setEmbed] = useState<boolean>(false);

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {isNew ? "Enable" : "Update"} {integration.name} Integration
          <Badge variant={ok ? "apikey-active" : "apikey-inactive"}>
            {ok ? "Ready" : "Not Ready"}
          </Badge>
        </CardTitle>
        <CardDescription>
          {integration.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!ok ? (
          <DiscordTestingCard
            onSuccessfulTest={(name, url) => {
              setOk(true);
              setWebhookName(name);
              setWebhookUrl(url);
            }}
            onFailedTest={() => setOk(false)}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 w-full">
              {webhookName && (
                <div className="flex flex-col w-full justify-between rounded-lg border p-4">
                  <Label htmlFor="webhook-name" className="mb-1.5">Name wich will be used for sending messages</Label>
                  <Input id="webhook-name" value={webhookName} />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-row items-center w-full justify-between rounded-lg border p-4">
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor="use-embed" className="text-base">Use Embed ?</Label>
                  <p className="text-sm text-muted-foreground">Send messages with rich embeds.</p>
                </div>

                <Switch
                  id="use-embed"
                  checked={embed}
                  onCheckedChange={(checked) => setEmbed(checked)}
                />
              </div>
            </div>

            <Separator className="my-4" />

            {embed ? (
              <div className="flex flex-col gap-2">
                <Label>Embed Content</Label>
                <Textarea placeholder={"Embed content..."} />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label>Message Content</Label>
                <Textarea placeholder={"Message content..."} />
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button size={"sm"} variant={"outline"} onClick={onCanceled}>Cancel</Button>
        <Button size={"sm"} onClick={onSaved} disabled={!ok}>
          {isNew ? "Enable" : "Update"}
        </Button>
      </CardFooter>
    </Card>
  );
};