// app/api/stripe/customers/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    console.log("🔧 GET Customers request received");

    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      console.log("❌ No token found");
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Token not found",
        },
        { status: 401 }
      );
    }

    console.log("🔑 Token found");

    if (!process.env.EXTERNAL_API_URL) {
      console.log("❌ EXTERNAL_API_URL not configured");
      return NextResponse.json(
        {
          success: false,
          error: "Server misconfiguration",
          message: "EXTERNAL_API_URL is not set",
        },
        { status: 500 }
      );
    }

    const response = await fetch(`${process.env.EXTERNAL_API_URL}/customers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    });

    console.log("📡 External API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ External API error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        {
          success: false,
          error: "External API error",
          message: `External API returned ${response.status}: ${errorText}`,
        },
        { status: response.status }
      );
    }

    // DEBUG: Ver o que está vindo da API externa
    const responseText = await response.text();
    console.log("📦 Raw response from external API:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log("📊 Parsed data:", data);
    } catch (parseError) {
      console.error("❌ Failed to parse JSON:", parseError);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON response",
          message: "External API returned invalid JSON",
        },
        { status: 500 }
      );
    }

    // Verificar a estrutura dos dados
    console.log("🔍 Data structure:", {
      isArray: Array.isArray(data),
      type: typeof data,
      keys: data ? Object.keys(data) : "null",
      hasData: !!data.data,
      dataLength: data.data ? data.data.length : "no data property",
      directLength: Array.isArray(data) ? data.length : "not array",
    });

    // Adaptar para diferentes estruturas de resposta
    let customers = [];

    if (Array.isArray(data)) {
      // Se a resposta é um array direto
      customers = data;
    } else if (data.data && Array.isArray(data.data)) {
      // Se a resposta tem propriedade data
      customers = data.data;
    } else if (data.customers && Array.isArray(data.customers)) {
      // Se a resposta tem propriedade customers
      customers = data.customers;
    } else if (data.result && Array.isArray(data.result)) {
      // Se a resposta tem propriedade result
      customers = data.result;
    }

    console.log(`✅ Final customers array length: ${customers.length}`);

    return NextResponse.json({
      success: true,
      data: customers,
      count: customers.length,
    });
  } catch (error: any) {
    console.error("❌ GET Customers error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
