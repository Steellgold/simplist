import { env } from "@/env.mjs";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async(request: NextRequest): Promise<NextResponse> => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers
      }
    });

    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({ request: { headers: request.headers } });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            request.cookies.set({ name, value: "", ...options });
            response = NextResponse.next({ request: { headers: request.headers } });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            response.cookies.set({ name, value: "", ...options });
          }
        }
      },
    );

    await supabase.auth.getUser();

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }
};