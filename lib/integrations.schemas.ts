/* eslint-disable camelcase */
import { z } from "zod";

export const DiscordIntegrationResponseSchema = z.object({
  application_id: z.string().nullable(),
  avatar: z.string().nullable(),
  channel_id: z.string().nullable(),
  guild_id: z.string().nullable(),
  id: z.string(),
  name: z.string(),
  type: z.number(),
  token: z.string(),
  url: z.string()
});