"use server";

import { cookies } from "next/headers";

type SigninData = {
  email: string;
  password: string;
  remember?: boolean | undefined;
};

type SignupData = {
  username: string;
  email: string;
  password: string;
};

export async function SignInRequest({ email, password, remember }: SigninData) {
  try {
    const response = await fetch("http://localhost:3001/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": "random-secure-token",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      if (remember) {
        (await cookies()).set("token", result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // One week
          path: "/",
        });
      } else {
        (await cookies()).set("token", result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // One day
          path: "/",
        });
      }

      return { success: true, data: result.user };
    }

    return { success: false, data: result };
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function SignUpRequest({ username, email, password }: SignupData) {
  try {
    const response = await fetch("http://localhost:3001/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    const result = await response.json();

    if (response.ok) {
      const user = await SignInRequest({ email, password, remember: false });
      return { success: true, data: user.data };
    } else {
      return { success: false, data: result.data };
    }
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function SignOutRequest() {
  try {
    (await cookies()).delete("token");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}
