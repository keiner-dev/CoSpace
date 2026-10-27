import { cookies } from "next/headers";
import { verifyAccessToken, type UserPayload } from "@/lib/auth";
import { Role } from "@prisma/client";

export interface SessionResult {
  user: UserPayload | null;
  error?: string;
  statusCode?: number;
}

export async function getSessionUser(): Promise<SessionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { user: null, error: "No autenticado. Token ausente.", statusCode: 401 };
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    return { user: null, error: "Sesión inválida o expirada.", statusCode: 401 };
  }

  return { user: payload };
}

export async function requireAdmin(): Promise<SessionResult> {
  const session = await getSessionUser();
  if (!session.user) return session;

  if (session.user.role !== Role.ADMIN) {
    return { user: null, error: "Acceso denegado. Se requiere rol de administrador.", statusCode: 403 };
  }

  return session;
}