// https://blog.stackademic.com/integrate-real-time-discord-webhooks-in-next-js-13-cb33810f6248
"use server";

import { env } from "./env.mjs";

type DiscordMessageProps = {
  title: string;
  message: string;
  email?: string;
};

export const sendDiscordMessage = async({ title, message, email }: DiscordMessageProps): Promise<void> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await fetch(env.WEBHOOK_DISCORD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        embeds: [{
          title,
          description: message,
          color: 15258703,
          footer: { text: email ? `From: ${email}` : "Anonymous" }
        }]
      })
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // @ts-ignore
  } catch (err: {
    message: string;
  }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(err.message);
  }
};