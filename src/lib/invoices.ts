"use server";

import { cookies } from "next/headers";

export async function GetInvoicesRequest() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return { success: false, data: "Token não encontrado" };
  }

  try {
    const response = await fetch("http://localhost:3002/invoices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function CreateInvoiceRequest(values: any) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return { success: false, data: "Token não encontrado" };
  }

  try {
    const response = await fetch("http://localhost:3002/create-invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function GetMetricsRequest() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return { success: false, data: "Token não encontrado" };
  }

  try {
    const response = await fetch("http://localhost:3002/metrics", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function GetRecentPaidInvoicesRequest() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return { success: false, data: "Token não encontrado" };
  }

  try {
    const response = await fetch("http://localhost:3002/invoices/recent", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function DeleteInvoiceRequest(invoiceId: number) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return { success: false, data: "Token não encontrado" };
  }

  try {
    const response = await fetch(
      `http://localhost:3002/delete-invoice/${invoiceId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let result = null;

    if (
      response.headers.get("content-length") !== "0" &&
      response.headers.get("content-type")?.includes("application/json")
    ) {
      result = await response.json();
    }

    return { success: response.ok, data: result };
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function UpdateInvoiceRequest(values: any, invoiceId: number) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return { success: false, data: "Token não encontrado" };
  }

  try {
    const response = await fetch(
      `http://localhost:3002/update-invoice/${invoiceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }
    );
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}
