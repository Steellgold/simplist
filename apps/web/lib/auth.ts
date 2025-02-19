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
  plugins: [
    organization(),
    multiSession({
      maximumSessions: 1 // testing
    }),
    passkey({
      rpName: "Simplist",
      origin: "http://localhost:3000"
    }),
    twoFactor(),
    openAPI()
  ],
  database: new Pool({
    connectionString: process.env.DATABASE_URL!
  }),
  trustedOrigins: [
    "http://192.168.1.132:3000",
  ]
});