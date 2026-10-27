import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import crypto from "crypto";
import { Role } from "@prisma/client";

// Tipado estricto del Payload del usuario
export interface UserPayload extends JWTPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface RefreshTokenPayload extends JWTPayload {
  userId: string;
  tokenId: string; // Identificador único para asociar con la BD
}

// Claves secretas codificadas para jose
const accessSecret = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "fallback_access_secret_change_in_env_32chars"
);
const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret_change_in_env_32chars"
);

// Tiempos de expiración (por defecto 15m y 7d según especificación)
const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

// 1. Generar Access Token
export async function signAccessToken(payload: {
  userId: string;
  email: string;
  role: Role;
}): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_EXPIRES_IN)
    .sign(accessSecret);
}

// 2. Generar Refresh Token
export async function signRefreshToken(payload: {
  userId: string;
  tokenId: string;
}): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_EXPIRES_IN)
    .sign(refreshSecret);
}

// 3. Verificar Access Token
export async function verifyAccessToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, accessSecret);
    return payload as UserPayload;
  } catch {
    return null;
  }
}

// 4. Verificar Refresh Token
export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, refreshSecret);
    return payload as RefreshTokenPayload;
  } catch {
    return null;
  }
}

// 5. Hashear token para almacenarlo seguro en BD (Regla de negocio: nunca almacenar en texto plano)
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// 6. Configuración de Cookies Seguras
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const ACCESS_COOKIE_MAX_AGE = 15 * 60; // 15 minutos en segundos
export const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 días en segundos