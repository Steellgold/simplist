import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export const middleware = async(request: NextRequest): Promise<ReturnType<typeof updateSession>> => {
  return await updateSession(request);
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};