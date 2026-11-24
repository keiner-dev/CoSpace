import { NextResponse, type NextRequest } from "next/server";
import { subirFoto } from "@/lib/s3/upload";

export const runtime = "nodejs";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("foto") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo en el campo 'foto'." },
        { status: 400 }
      );
    }

    // Validar tipo permitido (JPG, PNG, WEBP)
    const extension = ALLOWED_TYPES[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo se aceptan JPG, PNG o WEBP." },
        { status: 400 }
      );
    }

    // Validar tamaño máximo (5 MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera el límite de 5 MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const key = await subirFoto({
      body: buffer,
      contentType: file.type,
      extension,
    });

    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error("Error al subir a S3:", error);
    return NextResponse.json(
      { error: "Error interno al subir el archivo a S3." },
      { status: 500 }
    );
  }
}