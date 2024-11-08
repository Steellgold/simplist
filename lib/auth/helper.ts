import { headers } from "next/headers";
import { auth as baseAuth } from "./auth";
import { redirect } from "next/navigation";
import type { User } from "better-auth";
import type { OrganizationMember } from "../ba.types";
import { client } from "./client";

export const auth = async(): Promise<User | null> => {
  const session = await baseAuth.api.getSession({
    headers: await headers()
  });

  if (session?.user) return session.user;
  return null;
};

export const requiredAuth = async(): Promise<User> => {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  return user;
};

export const getActiveMember: () => Promise<OrganizationMember | null> = async() => {
  const session = await baseAuth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const organization = await client.organization.getFull({ query: { orgId: session.session.activeOrganizationId! } }, { headers: await headers() });
  if (!organization) throw new Error("Unauthorized");

  return organization.data?.members.find((member) => member.userId === session.user.id) || null;
};