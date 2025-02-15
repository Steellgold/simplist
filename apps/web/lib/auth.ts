import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { organization, username } from "better-auth/plugins";
 
const prisma = new PrismaClient();

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8
  },
  plugins: [
    username(),
    organization()
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});