"use server"

import { auth } from "../auth";
import { headers } from "next/headers";

type Props = {
  password: string;
}

export const definePassword: (props: Props) => Promise<void> = async (props) => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Not authenticated");
  }

  const { status } = await auth.api.setPassword({
    headers: await headers(),
    body: {
      newPassword: props.password
    }
  });

  console.log("Password defined", { status });
}