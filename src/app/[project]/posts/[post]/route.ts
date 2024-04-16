import { redirect } from "next/navigation";
import type { NextRequest, NextResponse } from "next/server";

export const GET = ({ url }: NextRequest): NextResponse => {
  console.log(url);
  const params = url.split("/").slice(3, 5);
  if (!params[0] || !params[1]) return redirect("/");
  return redirect(`/${params[0]}/posts/`);
};