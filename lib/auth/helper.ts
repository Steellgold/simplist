import { headers } from "next/headers";
import { auth as baseAuth } from "./auth";
import { redirect } from "next/navigation";

export const auth = async () => {
  const session = await baseAuth.api.getSession({
    headers: headers()
  });

  if (session?.user) return session.user;
  return null;
}

export const requiredAuth = async () => {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  return user;
}