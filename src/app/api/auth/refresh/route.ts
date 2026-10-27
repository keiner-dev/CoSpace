import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  hashToken,
  COOKIE_OPTIONS,
  ACCESS_COOKIE_MAX_AGE,
  REFRESH_COOKIE_MAX_AGE,
} from "@/lib/auth";

export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const currentRefreshToken = cookieStore.get("refreshToken")?.value;

    if (!currentRefreshToken) {
      return NextResponse.json(
        { success: false, error: "No se proporcionó refresh token." },
        { status: 401 }
      );
    }

    // 1. Verificar JWT del refresh token
    const payload = await verifyRefreshToken(currentRefreshToken);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Refresh token inválido o expirado." },
        { status: 401 }
      );
    }

    // 2. Verificar en la base de datos que el hash coincida y no esté revocado
    const currentHash = hashToken(currentRefreshToken);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: currentHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "Sesión revocada o no encontrada. Inicie sesión nuevamente." },
        { status: 401 }
      );
    }

    // 3. Rotación: Revocar el refresh token actual
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    // 4. Generar nuevo Access Token y nuevo Refresh Token
    const newAccessToken = await signAccessToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    const newTokenId = randomUUID();
    const newRefreshToken = await signRefreshToken({
      userId: storedToken.user.id,
      tokenId: newTokenId,
    });

    const newExpiresAt = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE * 1000);
    await prisma.refreshToken.create({
      data: {
        id: newTokenId,
        token: hashToken(newRefreshToken),
        userId: storedToken.user.id,
        expiresAt: newExpiresAt,
      },
    });

    // 5. Actualizar cookies seguras
    cookieStore.set("accessToken", newAccessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_COOKIE_MAX_AGE,
    });

    cookieStore.set("refreshToken", newRefreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });

    return NextResponse.json({
      success: true,
      message: "Tokens renovados exitosamente.",
    });
  } catch (error) {
    console.error("Error en refresh:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al renovar sesión." },
      { status: 500 }
    );
  }
}