// app/api/cloudflare/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_PUBLIC_DOMAIN ?? "",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY ?? "",
  },
});

export async function POST(req: NextRequest) {
  try {
    console.log("=== INICIANDO UPLOAD ===");

    const formData = await req.formData();
    const file: File | null = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const categoryId = formData.get("categoryId") as string;

    console.log("Dados recebidos:", {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      userId,
      categoryId,
    });

    // Validações mais detalhadas
    if (!file) {
      console.error("ERRO: Arquivo não encontrado no FormData");
      return NextResponse.json(
        { success: false, error: "Arquivo é obrigatório" },
        { status: 400 }
      );
    }

    if (!userId) {
      console.error("ERRO: userId não encontrado");
      return NextResponse.json(
        { success: false, error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o arquivo é uma imagem
    if (!file.type.startsWith("image/")) {
      console.error("ERRO: Arquivo não é uma imagem");
      return NextResponse.json(
        { success: false, error: "Arquivo deve ser uma imagem" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Buffer criado, tamanho:", buffer.length);

    // Gerar key única
    const fileExtension = file.name.split(".").pop() || "jpg";
    const uniqueKey = `${userId}/${
      categoryId || "temp"
    }/${uuidv4()}.${fileExtension}`;

    console.log("Fazendo upload para:", uniqueKey);

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME ?? "",
      Key: uniqueKey,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        userid: userId,
        categoryid: categoryId || "temp",
        originalname: file.name,
        uploadedat: new Date().toISOString(),
      },
    });

    const response = await r2.send(putObjectCommand);
    console.log(
      "Resposta do Cloudflare R2:",
      response.$metadata.httpStatusCode
    );

    const publicUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_DOMAIN}/${process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME}/${uniqueKey}`;

    console.log("Upload concluído com sucesso:", publicUrl);

    return NextResponse.json(
      {
        success: true,
        data: {
          url: publicUrl,
          key: uniqueKey,
          filename: file.name,
          size: file.size,
          uploaded_at: new Date(),
          metadata: {
            userId,
            categoryId: categoryId || "temp",
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERRO NO UPLOAD:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
