"use server";

export async function getProducts() {
  try {
    const response = await fetch(`${process.env.EXTERNAL_API_URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) return { success: false, data: [] };

    const result = await response.json();

    return {
      success: true,
      data: result.data || [],
      has_more: result.has_more || false,
    };
  } catch (error) {
    return { success: false, data: [] };
  }
}
