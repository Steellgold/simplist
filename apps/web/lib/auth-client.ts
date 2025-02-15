import { usernameClient, organizationClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

type BetterAuthOptions = ReturnType<typeof createAuthClient>

export const authClient: BetterAuthOptions = createAuthClient({
    plugins: [
        usernameClient(),
        organizationClient(),
    ],
    baseURL: process.env.PUBLIC_BETTER_AUTH_URL!,
})