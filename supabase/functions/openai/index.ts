/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

Deno.serve(async(req) => {
  const { langFrom, langTo, content } = await req.json();
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  const openai = new OpenAI({
    apiKey: apiKey
  });

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: `You will be provided with a sentence in ${langFrom}, and your task is to translate it into ${langTo}.` },
      { role: "user", content }
    ],
    temperature: 0,
    max_tokens: 4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });

  const reply = chatCompletion.choices[0].message.content;

  return new Response(reply, {
    headers: { "Content-Type": "text/plain" }
  });
});