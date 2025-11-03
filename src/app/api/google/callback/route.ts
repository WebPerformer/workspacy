import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    console.log("🔗 Google callback endpoint HIT!");

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/signin?error=auth_failed", req.url)
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });

    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    console.error("Error in Google callback:", error);
    return NextResponse.redirect(new URL("/signin?error=auth_failed", req.url));
  }
}
