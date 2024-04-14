import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type GetProps = { request: NextRequest };

export const GET = async({ request }: GetProps): Promise<NextResponse> => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  revalidatePath("/");
  return NextResponse.redirect(origin);
};