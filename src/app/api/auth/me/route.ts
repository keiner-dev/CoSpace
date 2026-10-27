import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  const session = await getSessionUser();

  if (!session.user) {
    return NextResponse.json(
      { success: false, error: session.error || "No autenticado." },
      { status: session.statusCode || 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Usuario no encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: user,
  });
}