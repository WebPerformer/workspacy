"use server";

import { cookies } from "next/headers";

export async function getTemplates(tier?: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/templates${tier ? `?tier=${tier}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) return { success: false, data: [] };

    const result = await response.json();

    return {
      success: true,
      data: result.data || [],
    };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function getTemplateById(id: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/templates/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) return { success: false, data: null };

    const result = await response.json();

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return { success: false, data: null };
  }
}

export async function activeTemplate(templateId: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/user/config/activate-template`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ template_id: templateId }),
      }
    );

    if (!response.ok) return { success: false, data: null };

    const result = await response.json();

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return { success: false, data: null };
  }
}
