import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = (): ReturnType<typeof createServerClient> => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.error(error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            console.error(error);
          }
        }
      }
    },
  );
};