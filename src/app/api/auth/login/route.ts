import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import {
  signAccessToken,
  signRefreshToken,
  hashToken,
  COOKIE_OPTIONS,
  ACCESS_COOKIE_MAX_AGE,
  REFRESH_COOKIE_MAX_AGE,
} from "@/lib/auth";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rate-limit";

interface LoginInput {
  email?: string;
  password?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as LoginInput;
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email y contraseña requeridos." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Obtener IP del cliente
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    // 2. Clave de bloqueo específica por IP + Correo
    // Así, intentos fallidos con otro usuario NO bloquean al administrador
    const rateLimitKey = `login_attempts:${clientIp}:${normalizedEmail}`;

    // 3. Verificar si esta cuenta específica está bloqueada para esta IP
    const rateCheck = checkRateLimit(rateLimitKey, 5);
    if (!rateCheck.allowed) {
      const minutesLeft = Math.ceil(rateCheck.retryAfterSeconds / 60);
      return NextResponse.json(
        {
          success: false,
          error: `Demasiados intentos fallidos para esta cuenta. Por seguridad, el acceso ha sido bloqueado temporalmente. Intenta nuevamente en ${minutesLeft} minuto(s).`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfterSeconds),
          },
        }
      );
    }

    // 4. Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // 5. Si no existe o la contraseña no coincide -> Registramos intento fallido PARA ESTE CORREO
    if (!user || !(await bcrypt.compare(password, user.password))) {
      recordFailedAttempt(rateLimitKey);
      const remainingAttempts = rateCheck.remaining - 1;

      return NextResponse.json(
        {
          success: false,
          error:
            remainingAttempts > 0
              ? `Credenciales inválidas. Te quedan ${remainingAttempts} intento(s) antes del bloqueo temporal.`
              : "Credenciales inválidas. Has alcanzado el límite de intentos para esta cuenta.",
        },
        { status: 401 }
      );
    }

    // 6. Si el login es exitoso, reseteamos el contador para esta cuenta
    resetRateLimit(rateLimitKey);

    // 7. Generar Access Token (15m) y Refresh Token (7d)
    const accessToken = await signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const tokenId = randomUUID();
    const refreshToken = await signRefreshToken({
      userId: user.id,
      tokenId,
    });

    // 8. Almacenar el hash del refresh token en la base de datos
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE * 1000);

    await prisma.refreshToken.create({
      data: {
        id: tokenId,
        token: tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    // 9. Inyectar cookies seguras httpOnly
    const cookieStore = await cookies();
    cookieStore.set("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_COOKIE_MAX_AGE,
    });

    cookieStore.set("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });

    // 10. Responder con datos del usuario sin tokens en el body
    return NextResponse.json({
      success: true,
      message: "Inicio de sesión exitoso.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor al iniciar sesión." },
      { status: 500 }
    );
  }
}