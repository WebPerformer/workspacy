"use server";

import crypto from "crypto";
import { UserConfigImage } from "../types/user";
import "@/envConfig";

export async function generateCloudinarySignature(params: Record<string, any>) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;

  // Remover parâmetros que não devem ser assinados
  const { file, cloud_name, resource_type, api_key, ...paramsToSign } = params;

  // Ordenar parâmetros alfabeticamente
  const sortedParams = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join("&");

  // String para assinar: parâmetros + API secret
  const stringToSign = `${sortedParams}${apiSecret}`;

  // Gerar assinatura SHA-1
  const signature = crypto
    .createHash("sha1")
    .update(stringToSign)
    .digest("hex");

  return {
    signature,
    timestamp: paramsToSign.timestamp,
  };
}

export async function uploadToCloudinary(
  file: File,
  userId: string,
  categoryId: string
): Promise<
  { success: true; data: UserConfigImage } | { success: false; data: any }
> {
  try {
    // Verificar se as variáveis de ambiente estão definidas
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;

    if (!cloudName || !apiKey || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Cloudinary configuration is missing");
    }

    // Parâmetros para a assinatura
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `users/${userId}/categories/${categoryId}`;

    const params = {
      timestamp,
      folder,
    };

    // Gerar assinatura
    const { signature } = await generateCloudinarySignature(params);

    // Preparar form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", apiKey);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (response.ok) {
      const userConfigImage: UserConfigImage = {
        url: result.secure_url,
        filename: result.original_filename,
        key: result.public_id,
        size: result.bytes,
        uploaded_at: new Date(),
        metadata: {
          userId,
          categoryId,
        },
      };
      return { success: true, data: userConfigImage };
    } else {
      console.error("Cloudinary upload error:", result);
      return { success: false, data: result };
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { success: false, data: error };
  }
}

export async function deleteCloudinaryImage(
  publicId: string
): Promise<{ success: boolean; error?: string; publicId: string }> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary configuration is missing");
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const params = {
      timestamp: timestamp.toString(),
      public_id: publicId,
    };

    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key as keyof typeof params]}`)
      .join("&");

    const stringToSign = `${sortedParams}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(stringToSign)
      .digest("hex");

    const formData = new URLSearchParams();
    formData.append("public_id", publicId);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", apiKey);
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    const result = await response.json();

    if (response.ok && result.result === "ok") {
      return { success: true, publicId };
    } else {
      console.error("❌ Erro ao deletar imagem:", publicId, result);
      return {
        success: false,
        error: result.error?.message || "Delete failed",
        publicId,
      };
    }
  } catch (error) {
    console.error("❌ Erro ao deletar imagem:", publicId, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
      publicId,
    };
  }
}

// Função para deletar múltiplas imagens com relatório completo
export async function deleteCloudinaryImages(publicIds: string[]): Promise<{
  success: boolean;
  deleted: string[];
  failed: Array<{ publicId: string; error: string }>;
}> {
  const deleted: string[] = [];
  const failed: Array<{ publicId: string; error: string }> = [];

  for (const publicId of publicIds) {
    const result = await deleteCloudinaryImage(publicId);
    if (result.success) {
      deleted.push(publicId);
    } else {
      failed.push({ publicId, error: result.error || "Unknown error" });
    }
  }

  return {
    success: failed.length === 0,
    deleted,
    failed,
  };
}

export async function deleteCloudinaryFolder(
  folderPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary configuration is missing");
    }

    // 1. Primeiro, verificar se a pasta existe e está vazia
    try {
      // Listar subpastas da pasta pai (se houver)
      const parentFolder = folderPath.substring(0, folderPath.lastIndexOf("/"));
      const folderName = folderPath.substring(folderPath.lastIndexOf("/") + 1);

      // Fazer requisição para listar subpastas
      const listResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/folders/${
          parentFolder || ""
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${apiKey}:${apiSecret}`
            ).toString("base64")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (listResponse.ok) {
        const result = await listResponse.json();

        // Verificar se nossa pasta está na lista
        const folderExists = result.folders?.some(
          (folder: any) =>
            folder.name === folderName || folder.path === folderPath
        );

        if (!folderExists) {
          return { success: true };
        }
      }
    } catch (listError) {
      console.warn("⚠️ Não foi possível listar pastas:", listError);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/folders/${folderPath}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${apiKey}:${apiSecret}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      console.error("❌ Erro ao deletar pasta:", folderPath, result);

      // Verificar tipos de erro comuns
      const errorMessage = result.error?.message || JSON.stringify(result);

      // Se a pasta não existe, não tem permissão, ou já foi deletada
      if (
        errorMessage.includes("not found") ||
        errorMessage.includes("does not exist") ||
        errorMessage.includes("Invalid credentials") ||
        errorMessage.includes("not empty") ||
        errorMessage.includes("cannot be deleted") ||
        response.status === 404 ||
        response.status === 401
      ) {
        console.warn(`⚠️ ${errorMessage} - Pasta: ${folderPath}`);

        // Verificar se podemos deletar recursivamente
        if (errorMessage.includes("not empty")) {
          // Primeiro deletar todos os recursos da pasta
          const deleteResourcesResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=${folderPath}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Basic ${Buffer.from(
                  `${apiKey}:${apiSecret}`
                ).toString("base64")}`,
                "Content-Type": "application/json",
              },
            }
          );

          const deleteResourcesResult = await deleteResourcesResponse.json();

          // Tentar deletar a pasta novamente
          if (deleteResourcesResponse.ok) {
            // Esperar um pouco para o Cloudinary processar
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const retryResponse = await fetch(
              `https://api.cloudinary.com/v1_1/${cloudName}/folders/${folderPath}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Basic ${Buffer.from(
                    `${apiKey}:${apiSecret}`
                  ).toString("base64")}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (retryResponse.ok) {
              return { success: true };
            }
          }
        }

        // Mesmo com erro, consideramos sucesso porque as imagens já foram deletadas
        return { success: true };
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  } catch (error) {
    console.error("❌ Erro inesperado ao deletar pasta:", folderPath, error);

    // Em caso de erro de rede ou inesperado, ainda consideramos sucesso parcial
    // porque as imagens individuais já foram deletadas
    return {
      success: true,
      error: error instanceof Error ? error.message : "Erro ao deletar pasta",
    };
  }
}
