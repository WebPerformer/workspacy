import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: true, has_used_trial: false },
        { status: 200 }
      );
    }

    const apiUrl = process.env.EXTERNAL_API_URL || "http://localhost:3001";
    const response = await fetch(`${apiUrl}/subscriptions/has-used-trial`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: true, has_used_trial: false },
        { status: 200 }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Erro ao verificar trial:", error);
    return NextResponse.json(
      { success: true, has_used_trial: false },
      { status: 200 }
    );
  }
}

