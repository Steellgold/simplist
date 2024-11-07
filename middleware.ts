import { authMiddleware } from "better-auth/next-js";
import { NextResponse } from "next/server";

export default authMiddleware({
  customRedirect: async(session, request) => {
    const baseURL = request.nextUrl.origin;

    // If the user is signed in and trying to access to the login page
    if (request.nextUrl.pathname === "/sign-in" && session) {
      return NextResponse.redirect(new URL("/app", baseURL));
    }

    // If the user is not signed in and trying to access a page that requires authentication
    if (request.nextUrl.pathname.startsWith("/app") && !session) {
      return NextResponse.redirect(new URL("/sign-in", baseURL));
    }

    // Or,
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/app/:path*", "/user/:path*", "/sign-in"]
};