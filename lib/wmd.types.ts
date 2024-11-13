/* eslint-disable @typescript-eslint/no-explicit-any */
type EmbedField = {
  name: string;
  value: string;
  inline?: boolean;
}

type MessageEmbed = {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: {
    text: string;
    icon_url?: string;
  };
  image?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
  };
  fields?: EmbedField[];
}

type WebhookMessage = {
  content?: string;
  username?: string;
  avatar_url?: string;
  tts?: boolean;
  embeds?: MessageEmbed[];
}

type WebhookResponse = {
  id: string;
  type: number;
  content: string;
  channel_id: string;
  author: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    bot: boolean;
  };
  attachments: any[];
  embeds: MessageEmbed[];
  mentions: any[];
  mention_roles: any[];
  pinned: boolean;
  mention_everyone: boolean;
  tts: boolean;
  timestamp: string;
  edited_timestamp: string | null;
  flags: number;
  components: any[];
  webhook_id: string;
}

export type { EmbedField, MessageEmbed, WebhookMessage, WebhookResponse };