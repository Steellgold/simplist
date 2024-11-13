/* eslint-disable camelcase */
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useSendWebhookMessage } from "@/hooks/use-webhook-message";
import { useCreateIntegration } from "@/lib/actions/integration/integration.hook";
import { useActiveOrganization } from "@/lib/auth/client";
import type { Integration } from "@/lib/integrations";
import type { MessageEmbed } from "@/lib/wmd.types";
import { Loader } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { toast } from "sonner";

type Props = {
  integration: Integration;
  isNew?: boolean;

  onCanceled?: () => void;
  onSaved?: () => void;
};

const PARAMS: Record<string, string> = {
  "{{ post_title }}": "Post title of the published post",
  "{{ post_excerpt }}": "Excerpt of the published post",
  "{{ post_url }}": "URL of the published post with the blog domain configured in organization settings (Ex: https://blog.example.com/post-slug)",
  "{{ post_slug }}": "Slug of the published post",
  "{{ post_author }}": "Author name of the published post",
  "{{ post_date }}": "Date of the published post",
  "{{ post_tags }}": "Tags separated by comma of the published post",
  "{{ post_variants }}": "Languages available for the published post separated by comma",
  "{{ post_locale }}": "Locale of the published post (original language)"
};

export const ConfigureIntegration: Component<Props> = ({ integration, isNew, onCanceled, onSaved }) => {
  const { data: organization, isPending } = useActiveOrganization();

  const [ok, setOk] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [webhookUrl, setWebhookUrl] = useState<string>("");

  const [embed, setEmbed] = useState<boolean>(false);

  const [embedData, setEmbedData] = useState<MessageEmbed | null>(null);
  const [messageContent, setMessageContent] = useState<string | null>(null);

  const [vanillaColor, setVanillaColor] = useState<string>("#5865F2");

  const create = useCreateIntegration();
  const send = useSendWebhookMessage(webhookUrl || "");

  const updateColor = (color: string): void => {
    setVanillaColor(color);
    setEmbedData({ ...embedData, color: parseInt(color.replace("#", ""), 16) });
  };

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
              setWebhookUrl(url);
            }}
            onFailedTest={() => setOk(false)}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex flex-row items-center w-full justify-between rounded-lg border p-4">
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor="use-embed" className="text-base">Use Embed</Label>
                  <p className="text-sm text-muted-foreground">Send messages with rich embeds.</p>
                </div>

                <Switch
                  id="use-embed"
                  checked={embed}
                  onCheckedChange={(checked) => {
                    setEmbed(checked);
                    if (!checked) setEmbedData(null);
                    if (checked && !embedData) {
                      setVanillaColor("#5865F2");
                      setEmbedData({
                        color: parseInt(vanillaColor.replace("#", ""), 16)
                      });
                    }
                  }}
                />
              </div>
            </div>

            {embed ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 border rounded-lg p-4">
                  <div className="flex flex-col gap-2 w-full">
                    <LabelDescription label="Title" forItem="embed-title" />
                    <Input
                      id="embed-title" type="text" value={embedData?.title || ""}
                      placeholder="Rich Embed Title"
                      onChange={(e) => setEmbedData({ ...embedData, title: e.target.value })}
                    />
                  </div>


                  <div className="flex flex-col gap-2 w-full">
                    <LabelDescription label="URL" forItem="embed-url" />
                    <Input
                      id="embed-title" type="url" value={embedData?.url || ""}
                      placeholder="https://example.com"
                      onChange={(e) => setEmbedData({ ...embedData, url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full border rounded-lg p-4">
                  <LabelDescription label="Description" forItem="embed-description" />
                  <Textarea
                    id="embed-description" value={embedData?.description || ""}
                    placeholder="Rich Embed Description (4096 characters max)"
                    onChange={(e) => setEmbedData({ ...embedData, description: e.target.value })}
                  />
                </div>

                <div className="flex flex-row gap-2 border rounded-lg p-4">
                  <div className="flex flex-col gap-2 w-full">
                    <LabelDescription label="Color" forItem="embed-color" />
                    <Input id="embed-color" type="color" value={vanillaColor} onChange={(e) => updateColor(e.target.value)} />
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <LabelDescription label="Timestamp" forItem="embed-timestamp" />
                    <Input
                      id="embed-timestamp" type="datetime-local" value={embedData?.timestamp || ""}
                      onChange={(e) => setEmbedData({ ...embedData, timestamp: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-2 border rounded-lg p-4">
                  <div className="flex flex-col gap-2 w-full">
                    <LabelDescription label="Footer" forItem="embed-footer" />
                    <Input
                      id="embed-footer" type="text" value={embedData?.footer?.text || ""}
                      placeholder="Rich Embed Footer"
                      onChange={(e) => setEmbedData({ ...embedData, footer: { ...embedData?.footer, text: e.target.value } })}
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <LabelDescription label="Footer Icon" forItem="embed-footer-icon" />
                    <Input
                      id="embed-footer-icon" type="url" value={embedData?.footer?.icon_url || ""}
                      placeholder="https://example.com/icon.png"
                      // @ts-expect-error no worries
                      onChange={(e) => setEmbedData({ ...embedData, footer: { ...embedData?.footer, icon_url: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-2 border rounded-lg p-4">
                  <div className="flex flex-col gap-2 w-full">
                    <LabelDescription label="Author" forItem="embed-author" />
                    <Input
                      id="embed-author" type="text" value={embedData?.author?.name || ""}
                      placeholder="John Doe"
                      onChange={(e) => setEmbedData({ ...embedData, author: { ...embedData?.author, name: e.target.value ?? "" } })}
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <LabelDescription label="Author URL" forItem="embed-author-url" />
                    <Input
                      id="embed-author-url" type="url" value={embedData?.author?.url || ""}
                      placeholder="https://example.com"
                      // @ts-expect-error no worries
                      onChange={(e) => setEmbedData({ ...embedData, author: { ...embedData?.author, url: e.target.value } })}
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <LabelDescription label="Author Icon" forItem="embed-author-icon" />
                    <Input
                      id="embed-author-icon" type="url" value={embedData?.author?.icon_url || ""}
                      placeholder="https://example.com/icon.png"
                      // @ts-expect-error no worries
                      onChange={(e) => setEmbedData({ ...embedData, author: { ...embedData?.author, icon_url: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-2 border rounded-lg p-4">
                  <div className="flex flex-col gap-2 w-full">
                    <LabelDescription label="Thumbnail" forItem="embed-thumbnail" />
                    <Input
                      id="embed-thumbnail" type="url" value={embedData?.thumbnail?.url || ""}
                      placeholder="https://example.com/thumbnail.png"
                      onChange={(e) => setEmbedData({ ...embedData, thumbnail: { ...embedData?.thumbnail, url: e.target.value } })}
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <LabelDescription label="Image" forItem="embed-image" />
                    <Input
                      id="embed-image" type="url" value={embedData?.image?.url || ""}
                      placeholder="https://example.com/image.png"
                      onChange={(e) => setEmbedData({ ...embedData, image: { ...embedData?.image, url: e.target.value } })}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label>Message Content</Label>
                <Textarea placeholder={"Message content..."} value={messageContent || ""} onChange={(e) => setMessageContent(e.target.value)} />
              </div>
            )}

            <Button size={"sm"} variant={"discord"} onClick={() => {
              toast.promise(
                send.mutateAsync({
                  content: messageContent || "",
                  embeds: embedData ? [embedData] : []
                }),
                {
                  loading: "Sending test message...",
                  success: "Test message sent successfully.",
                  error: "Failed to send test message."
                }
              );
            }}>
              <FaDiscord />
              Send a Test Message
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button size={"sm"} variant={"outline"} onClick={onCanceled}>Cancel</Button>
        <Button size={"sm"} onClick={() => {
          if (isNew) {
            toast.promise(
              create.mutateAsync({
                type: integration.type,
                enabled: true,
                id: nanoid(20),
                organization: { connect: { id: organization?.id } },
                credentials: { create: { data: {
                  webhookUrl: webhookUrl,
                  data: { isEmbed: embed, embedData: embedData, messageContent: messageContent  }
                } } }
              }, {
                onSuccess: () => {
                  onSaved?.();
                }
              }), {
                loading: "Enabling integration...",
                success: "Integration enabled successfully.",
                error: "Failed to enable integration."
              }
            );
          } else {
            toast.message("Updating integration is not supported yet.");
          }
        }} disabled={!ok || loading}>
          {loading && <Loader className="animate-spin" />}
          {isNew ? "Enable" : "Update"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const LabelDescription: Component<{
  label: string;
  description?: string;
  forItem: string;
}> = ({ description, label, forItem }) => (
  <div className="flex flex-col gap-0.5">
    <Label htmlFor={forItem}>{label}</Label>
    {description && <p className="text-sm text-muted-foreground">{description}</p>}
  </div>
);