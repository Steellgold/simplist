/* eslint-disable camelcase */
import type { Type } from "@prisma/client";
import type { ReactElement } from "react";
import { FaDiscord } from "react-icons/fa";
import type { ZodSchema } from "zod";
import { z } from "zod";
import { DiscordIntegrationResponseSchema } from "./integrations.schemas";

export type Integration = {
  available: boolean;
  type: Type;

  name: string;
  description: string;

  icon: ReactElement;
  bg: string;

  required: ZodSchema;
  response?: ZodSchema;
};

export const integrations: Integration[] = [
  {
    name: "Discord",
    type: "DISCORD_WEBHOOK",
    description: "Send messages in your community server when you publish a new post",
    icon: <FaDiscord className="w-6 h-6" />,
    bg: "#5865F2",
    available: true,
    required: z.object({
      webhook_url: z.string()
    }),
    response: DiscordIntegrationResponseSchema
  }
  // {
  //   name: "Slack",
  //   description: "Send messages in workspace when a new post is published.",
  //   icon: <FaSlack className="w-6 h-6" />,
  //   bg: "#4A154B",
  //   available: false
  // },
  // {
  //   name: "Twitter",
  //   description: "Tweet when you publish a new post.",
  //   icon: <FaTwitter className="w-6 h-6" />,
  //   bg: "#1DA1F2",
  //   available: false
  // },
  // {
  //   name: "Telegram",
  //   description: "Send messages in a group when you publish a new post.",
  //   icon: <FaTelegram className="w-6 h-6" />,
  //   bg: "#0088cc",
  //   available: false
  // },
  // {
  //   name: "Facebook",
  //   description: "Share your post on your Facebook page.",
  //   icon: <FaFacebook className="w-6 h-6" />,
  //   bg: "#3b5998",
  //   available: false
  // },
  // {
  //   name: "LinkedIn",
  //   description: "Share your post on your LinkedIn profile.",
  //   icon: <FaLinkedin className="w-6 h-6" />,
  //   bg: "#0077B5",
  //   available: false
  // },
  // {
  //   name: "Reddit",
  //   description: "Share your post on a subreddit.",
  //   icon: <FaReddit className="w-6 h-6" />,
  //   bg: "#FF5700",
  //   available: false
  // }
];