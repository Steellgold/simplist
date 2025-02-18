"use server"

import { redirect } from "next/navigation";
import { polar } from "../polar";
import { auth } from "../auth";
import { headers } from "next/headers";

export const createOrganization = async (formData: FormData) => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Not authenticated");
  }

  const organizationName = formData.get("organization-name") as string;
  const plan = formData.get("plan-selector") as string;

  console.log("Creating organization with name:", organizationName, "and plan:", plan);

  const checkout = await polar.checkouts.create({
    productId: "6153b2d1-26af-43b8-b920-d011c86b6b15",
    successUrl: new URL("/checkout/success?checkout_id={CHECKOUT_ID}", process.env.PUBLIC_BETTER_AUTH_URL).toString(),
    customerEmail: session.user.email,
  })

  redirect(checkout.url);
};