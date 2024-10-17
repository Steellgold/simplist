import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { passkey, organization, twoFactor } from "better-auth/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    secret: process.env.BETTER_AUTH_SECRET as string,
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string
        },
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
        passkey(),
        organization(),
        twoFactor()
    ],
    trustedOrigins: [
        "localhost:3000",
        "simplist.blog",
        "www.simplist.blog",
        "preview.simplist.blog",
    ]
});