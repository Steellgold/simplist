import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username, passkey, organization, twoFactor } from "better-auth/plugins";
import prisma from "../db";

export const auth = betterAuth({
  appName: "Simplist",
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  secret: process.env.BETTER_AUTH_SECRET as string,

  emailAndPassword: { enabled: true },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  },

  plugins: [
    username(),
    passkey(),
    organization(),
    twoFactor()
  ],

  trustedOrigins: [
    "localhost:3000",
    "simplist.blog",
    "www.simplist.blog",
    "preview.simplist.blog"
  ]
});