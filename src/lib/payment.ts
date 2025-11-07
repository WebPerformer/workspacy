"use server";

import { cookies } from "next/headers";

export async function createPaymentIntent(data: {
  price_id: string;
  mode: "payment" | "subscription";
  product_id: string;
}) {
  try {
    const token = (await cookies()).get("token")?.value;

    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/payment/create-intent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) return { success: false, error: "Request failed" };

    const result = await response.json();

    return {
      success: result.success,
      client_secret: result.client_secret,
      customer_id: result.customer_id,
    };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

export async function createSubscription(data: {
  price_id: string;
  payment_method_id: string;
}) {
  try {
    const token = (await cookies()).get("token")?.value;

    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/payment/create-subscription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) return { success: false, error: "Request failed" };

    const result = await response.json();

    return {
      success: result.success,
      subscription_id: result.subscription_id,
      status: result.status,
    };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}
