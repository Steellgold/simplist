import { betterAuth } from "better-auth";
import { multiSession, openAPI, organization, twoFactor } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { Pool } from "pg";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8
  },
  appName: "Simplist",
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"]
    }
  },
  plugins: [
    organization(),
    multiSession({
      maximumSessions: 1 // testing purposes
    }),
    passkey({
      rpName: "Simplist",
      origin: process.env.BETTER_AUTH_URL!,
    }),
    twoFactor({
      issuer: "simplist"
    }),
    openAPI()
  ],
  database: new Pool({
    connectionString: process.env.DATABASE_URL!
  }),
  trustedOrigins: [
    "http://192.168.1.132:3000" // Desktop at home - Remove when branch merged
  ]
});