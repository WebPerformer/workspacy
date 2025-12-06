"use client";

export async function hasUsedTrialClient(): Promise<{
  success: boolean;
  has_used_trial: boolean;
}> {
  try {
    // Usar API route do Next.js que faz proxy para a API externa
    const response = await fetch("/api/subscriptions/has-used-trial", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

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

