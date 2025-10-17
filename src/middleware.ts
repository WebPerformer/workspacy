import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  const publicPaths = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/one-time-password",
    "/callback/google",
  ];

  // Se o usuário NÃO tiver token e tentar acessar qualquer rota que não seja pública → redireciona para /signin
  if (!token && !publicPaths.some((p) => path.startsWith(p))) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl.origin));
  }

  // Se o usuário JÁ estiver logado e tentar acessar uma rota pública → redireciona para /
  if (token && publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  // Handle Google OAuth callback
  if (path.startsWith("/callback/google")) {
    const googleToken = req.nextUrl.searchParams.get("token");

    if (!googleToken) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    const response = NextResponse.redirect(new URL("/", req.url));

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
