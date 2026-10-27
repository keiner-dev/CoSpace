import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, getSessionUser } from "@/lib/session";
import { SpaceType, Role } from "@prisma/client";

interface CreateSpaceInput {
  name?: string;
  description?: string;
  type?: SpaceType;
  capacity?: number;
  hourlyPrice?: number;
  imageUrl?: string;
}

// GET /api/spaces - Listar catálogo
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";

    // Si pide ver inactivos, verificamos si es admin
    let whereCondition = { isActive: true };

    if (showAll) {
      const session = await getSessionUser();
      if (session.user && session.user.role === Role.ADMIN) {
        whereCondition = {} as { isActive: true }; // Admin ve todos
      }
    }

    const spaces = await prisma.space.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: spaces,
    });
  } catch (error) {
    console.error("Error al listar espacios:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al obtener los espacios." },
      { status: 500 }
    );
  }
}

// POST /api/spaces - Crear nuevo espacio (Solo Admin)
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. Verificar rol de administrador
    const session = await requireAdmin();
    if (!session.user) {
      return NextResponse.json(
        { success: false, error: session.error },
        { status: session.statusCode }
      );
    }

    const body = (await request.json()) as CreateSpaceInput;
    const { name, description, type, capacity, hourlyPrice, imageUrl } = body;

    // 2. Validar campos obligatorios
    if (!name || !description || !type || capacity === undefined || hourlyPrice === undefined || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    if (!Object.values(SpaceType).includes(type)) {
      return NextResponse.json(
        { success: false, error: "Tipo de espacio inválido (DESK, MEETING_ROOM, BOOTH)." },
        { status: 400 }
      );
    }

    if (capacity <= 0 || hourlyPrice <= 0) {
      return NextResponse.json(
        { success: false, error: "La capacidad y el precio por hora deben ser mayores a 0." },
        { status: 400 }
      );
    }

    // 3. Crear el espacio
    const newSpace = await prisma.space.create({
      data: {
        name,
        description,
        type,
        capacity: Number(capacity),
        hourlyPrice: Number(hourlyPrice),
        imageUrl,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Espacio creado exitosamente.",
        data: newSpace,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear espacio:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al crear el espacio." },
      { status: 500 }
    );
  }
}