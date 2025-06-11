import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  if (
    token &&
    [
      "/signin",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/one-time-password",
    ].includes(path)
  ) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  if (!token && path.startsWith("/avatar-picker")) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl.origin));
  }

  if (!token && path.startsWith("/projects/financial-tracker")) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl.origin));
  }

  // Handle Google OAuth callback
  if (path.startsWith("/callback/google")) {
    const googleToken = req.nextUrl.searchParams.get("token");

    if (!googleToken) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    const response = NextResponse.redirect(new URL("/", req.url));

    // Set the token cookie
    response.cookies.set({
      name: "token",
      value: googleToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // One week
      path: "/",
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/one-time-password",
    "/callback/google",
    "/avatar-picker",
    "/projects/financial-tracker",
  ],
};
