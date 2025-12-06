"use server";
import { cookies } from "next/headers";

import {
  ForgotPasswordData,
  ResetPasswordData,
  SigninData,
  SignupData,
  ValidateOtpData,
} from "../types/auth";

import "@/envConfig";

export async function signInRequest({ email, password, remember }: SigninData) {
  try {
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/auth/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": "random-secure-token",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

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

export async function signUpRequest({ username, email, password }: SignupData) {
  try {
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      const user = await signInRequest({ email, password, remember: false });
      return { success: true, data: user.data };
    } else {
      return { success: false, data: result.data };
    }
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function getGoogleOAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL as string,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
}

export async function signOutRequest() {
  try {
    (await cookies()).delete("token");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}

export async function forgotPasswordRequest({ email }: ForgotPasswordData) {
  try {
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
        }),
      }
    );
    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result };
    } else {
      return { success: false, data: result };
    }
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function validateOtpRequest({ email, otp }: ValidateOtpData) {
  try {
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/auth/validate-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
        }),
      }
    );
    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result };
    } else {
      return { success: false, data: result };
    }
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function resetPasswordRequest({
  email,
  otp,
  newPassword,
}: ResetPasswordData) {
  try {
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      }
    );
    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result };
    } else {
      return { success: false, data: result };
    }
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}
