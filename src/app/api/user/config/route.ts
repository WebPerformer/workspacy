import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401 }
      );
    }

    console.log(
      "Fetching from external API:",
      `${process.env.EXTERNAL_API_URL}/user/config`
    );

    // Fazer requisição para a API externa
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/user/config`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("External API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("External API error:", errorText);
      return NextResponse.json(
        {
          success: false,
          error: `Erro ao buscar configurações: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("External API result:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro na API user/config GET:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      console.log("PATCH: No token found");
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("PATCH: Request body received:", JSON.stringify(body, null, 2));

    // Validar o corpo da requisição
    if (
      !body.template_data &&
      !body.selected_template_id &&
      !body.is_template_configured
    ) {
      console.log("PATCH: Invalid data - no update fields provided");
      return NextResponse.json(
        { success: false, error: "Dados inválidos para atualização" },
        { status: 400 }
      );
    }

    console.log(
      "PATCH: Making request to external API:",
      `${process.env.EXTERNAL_API_URL}/user/config`
    );

    // Fazer requisição para a API externa
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/user/config`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    console.log("PATCH: External API response status:", response.status);

    if (!response.ok) {
      // CORREÇÃO: Não ler o corpo duas vezes
      const errorText = await response.text();
      console.error("PATCH: External API error response:", errorText);

      return NextResponse.json(
        {
          success: false,
          error: `Erro ao atualizar configurações: ${
            response.status
          } - ${errorText.substring(0, 200)}`,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("PATCH: External API success result:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("PATCH: Error in API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Erro interno do servidor: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
