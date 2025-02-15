import { betterAuth } from "better-auth"
import { usernameClient, organizationClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

type BetterAuthOptions = ReturnType<typeof betterAuth>

export const authClient: BetterAuthOptions = createAuthClient({
    plugins: [
        usernameClient(),
        organizationClient(),
    ],
    baseURL: process.env.PUBLIC_BETTER_AUTH_URL!,
})