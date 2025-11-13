import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

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
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Key é obrigatória" },
        { status: 400 }
      );
    }

    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME ?? "",
      Key: key,
    });

    await r2.send(deleteObjectCommand);

    return NextResponse.json(
      {
        success: true,
        message: "Imagem deletada com sucesso",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao deletar imagem:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
