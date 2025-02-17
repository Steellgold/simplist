import { NextResponse } from "next/server";

export const GET = (request: Request): NextResponse => {
  return NextResponse.redirect(new URL("/account/settings", request.url));
}