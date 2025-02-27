import { ac,  admin, editor, member, owner, Permissions } from "./permissions";
import { organizationClient, multiSessionClient, passkeyClient, twoFactorClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac: ac,
      roles: { member, editor, admin, owner }
    }),
    multiSessionClient(),
    passkeyClient(),
    twoFactorClient()
  ],
  baseURL: process.env.PUBLIC_BETTER_AUTH_URL!,
});

// export const canSeeMembers: ReturnType<typeof authClient.organization.hasPermission> = await authClient.organization.hasPermission({
//   permission: { members: ["view"] },
//   fetchOptions: {
//     onError: (ctx) => {
//       console.log("onError", ctx)
//     },
//     onSuccess: (ctx) => {
//       console.log("onSuccess", ctx)
//     }
//   }
// });

export const can = async (permission: Permissions): Promise<boolean> => {
  const response = await authClient.organization.hasPermission({
    permission,
    fetchOptions: {
      onError: (ctx: any) => {
        console.error("Permission check failed:", ctx);
      },
      onSuccess: (ctx: any) => {
        console.log("Permission check succeeded:", ctx);
      }
    },
  });

  if (response.error) return false;
  if (response.data.success) return true;
  return false;
}

// export const canDoSomething = async (permissions: Permissions) => {
//   return await authClient.organization.hasPermission({ permission: permissions });
// };

export type Session = typeof authClient.$Infer.Session
export type Organization = typeof authClient.$Infer.Organization
export type Member = typeof authClient.$Infer.Member
export type Invitation = typeof authClient.$Infer.Invitation