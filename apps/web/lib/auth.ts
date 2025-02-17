import { betterAuth } from "better-auth";
import { multiSession, organization, username } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { Pool } from "pg";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8
  },
  plugins: [
    username(),
    organization(),
    multiSession(),
    passkey()
  ],
  database: new Pool({
    connectionString: process.env.DATABASE_URL!
  })
});