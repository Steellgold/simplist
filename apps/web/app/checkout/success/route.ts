import { NextResponse } from "next/server";

export const GET = (): NextResponse => {
  return NextResponse.json({ message: "Hello, World!" });
};