import { NextResponse } from "next/server";

export const GET = (req: Request): NextResponse => {
  return new Response("Hello, world!");
};