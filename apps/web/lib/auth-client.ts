import { usernameClient, organizationClient, multiSessionClient, passkeyClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    organizationClient(),
    multiSessionClient(),
    passkeyClient(),
  ],
  baseURL: process.env.PUBLIC_BETTER_AUTH_URL!,
})