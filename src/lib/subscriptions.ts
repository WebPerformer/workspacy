"use server";

import { cookies } from "next/headers";

export async function changeSubscription(data: {
  current_price_id: string;
  new_price_id: string;
}) {
  try {
    const token = (await cookies()).get("token")?.value;

    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/subscriptions/change`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Erro ao mudar assinatura",
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Erro ao mudar assinatura:", error);
    return {
      success: false,
      error: "Erro de conexão",
    };
  }
}

export async function cancelSubscription() {
  try {
    const token = (await cookies()).get("token")?.value;
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/subscriptions/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Erro ao cancelar assinatura",
      };
    }
    const result = await response.json();
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    return {
      success: false,
      error: "Erro de conexão",
    };
  }
}

export async function createSetupIntent() {
  try {
    const token = (await cookies()).get("token")?.value;
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/payment/create-setup-intent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Erro ao criar SetupIntent",
      };
    }
    const result = await response.json();
    return {
      success: true,
      clientSecret: result.client_secret,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erro de conexão",
    };
  }
}

export async function updatePaymentMethod(payment_method_id: string) {
  try {
    const token = (await cookies()).get("token")?.value;
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/payment/update-payment-method`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payment_method_id }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Erro ao atualizar método de pagamento",
      };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Erro de conexão",
    };
  }
}

export async function hasUsedTrial() {
  try {
    const token = (await cookies()).get("token")?.value;
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/subscriptions/has-used-trial`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      // Se der erro, assumir que não usou (para não bloquear usuários)
      return { success: true, has_used_trial: false };
    }
    const result = await response.json();
    return {
      success: result.success,
      has_used_trial: result.has_used_trial || false,
    };
  } catch (error) {
    // Em caso de erro, assumir que não usou (para não bloquear usuários)
    return {
      success: true,
      has_used_trial: false,
    };
  }
}