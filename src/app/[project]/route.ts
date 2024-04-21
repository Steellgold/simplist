import { redirect } from "next/navigation";
import type { NextRequest, NextResponse } from "next/server";

export const GET = ({ url }: NextRequest): NextResponse => {
  return redirect(`${url}/posts`);
};