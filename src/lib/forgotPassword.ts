"use server";

type ForgotPasswordData = {
  email: string;
};

type ValidateOtpData = {
  email: string;
  otp: string;
};

type ResetPasswordData = {
  email: string;
  otp: string;
  newPassword: string;
};

export async function forgotPasswordRequest({ email }: ForgotPasswordData) {
  try {
    const response = await fetch("http://localhost:3001/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
      }),
    });
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
    const response = await fetch("http://localhost:3001/validate-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
      }),
    });
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
    const response = await fetch("http://localhost:3001/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        newPassword,
      }),
    });
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
