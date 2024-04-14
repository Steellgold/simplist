import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const GET = async({ url }: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  revalidatePath("/");
  return NextResponse.redirect(origin);
};