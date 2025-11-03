"use server";
import { cookies } from "next/headers";

export async function getCustomers() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return { success: false, data: [] };

    const response = await fetch(`${process.env.EXTERNAL_API_URL}/customers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return { success: false, data: [] };

    const result = await response.json();
    return {
      success: true,
      data: result.data || [],
      count: result.count || 0,
    };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function getCustomersProfile(slug?: string) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return { success: false, data: null };

    const url = slug
      ? `${process.env.EXTERNAL_API_URL}/customers/profile?slug=${slug}`
      : `${process.env.EXTERNAL_API_URL}/customers/profile`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return { success: false, data: null };

    const result = await response.json();
    return {
      success: true,
      data: result.data || null,
    };
  } catch (error) {
    return { success: false, data: null };
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return { success: false, error: "Not authenticated" };

    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/subscriptions/cancel`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscription_id: subscriptionId }),
      }
    );

    if (!response.ok)
      return { success: false, error: "Failed to cancel subscription" };

    const result = await response.json();
    return {
      success: true,
      data: result.data || null,
    };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}
