import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
  server: process.env.POLAR_SERVER! as "production" | "sandbox",
  accessToken: process.env.POLAR_ACCESS_TOKEN!
})