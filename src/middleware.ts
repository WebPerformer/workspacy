import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwt(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  const publicPaths = [
    "/dashboard/signin",
    "/dashboard/signup",
    "/dashboard/forgot-password",
    "/dashboard/reset-password",
    "/dashboard/one-time-password",
  ];

  const isPublicTemplateRoute = /^\/[^\/]+\/[^\/]+$/.test(path);

  if (path === "/api/stripe/webhook" || path === "/api/google/callback")
    return NextResponse.next();

  if (
    !token &&
    !publicPaths.some((p) => path.startsWith(p)) &&
    !isPublicTemplateRoute
  ) {
    return NextResponse.redirect(
      new URL("/dashboard/signin", req.nextUrl.origin)
    );
  }

  if (token && publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  if (token && path.startsWith("/dashboard/customers")) {
    const payload = decodeJwt(token) as { role?: string } | null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook).*)"],
};
