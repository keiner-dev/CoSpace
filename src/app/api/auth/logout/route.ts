import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashToken, COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
      const currentHash = hashToken(refreshToken);
      await prisma.refreshToken.updateMany({
        where: { token: currentHash },
        data: { revoked: true },
      });
    }

    // Limpiar cookies del navegador
    cookieStore.set("accessToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
    cookieStore.set("refreshToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });

    return NextResponse.json({
      success: true,
      message: "Sesión cerrada correctamente.",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    return NextResponse.json(
      { success: false, error: "Error al cerrar sesión." },
      { status: 500 }
    );
  }
}