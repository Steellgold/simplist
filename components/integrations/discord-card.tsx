"use client";

import { useState } from "react";
import type { Component } from "../component";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader, Send } from "lucide-react";
import { toast } from "sonner";
import { DiscordIntegrationResponseSchema } from "@/lib/integrations.schemas";

type Props = {
  onSuccessfulTest: (
    name: string,
    webhookUrl: string
  ) => void;
  onFailedTest: () => void;
};

export const DiscordTestingCard: Component<Props> = ({ onSuccessfulTest }) => {
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [_, setWebhookName] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [__, setSuccess] = useState<boolean>(false);

  const handleTest = async(): Promise<void> => {
    setLoading(true);

    const response = await fetch(webhookUrl);
    const schema = DiscordIntegrationResponseSchema.safeParse(await response.json());
    if (!schema) {
      toast.error("Failed to parse response from webhook.");
      setLoading(false);
      return;
    }

    if (!schema.success) {
      toast.error("Failed to test webhook.");
      console.error(schema.error);
      setLoading(false);
      return;
    }

    setWebhookName(schema.data.name);
    setSuccess(true);
    setLoading(false);
    onSuccessfulTest(schema.data.name, webhookUrl);
    toast.success("Webhook URL is valid and working.");
  };

  return (
    <div className="flex flex-col w-full justify-between rounded-lg border p-4 gap-2">
      <p className="text-sm text-muted-foreground">Enter the webhook URL to test the connection.</p>

      <div className="flex flex-row gap-2">
        <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://discord.com/api/webhooks/..." />
        <Button
          size={"icon"}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async() => await handleTest()}
          disabled={
            loading
              || !webhookUrl
              || !webhookUrl.startsWith("https://discord.com/api/webhooks/")
          }>
          {loading ? <Loader className="animate-spin" /> : <Send />}
        </Button>
      </div>
    </div>
  );
};