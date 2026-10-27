import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { SpaceType, ReservationStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface UpdateSpaceInput {
  name?: string;
  description?: string;
  type?: SpaceType;
  capacity?: number;
  hourlyPrice?: number;
  imageUrl?: string;
  isActive?: boolean;
}

// GET /api/spaces/[id] - Detalle del espacio
export async function GET(
  _request: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;

    const space = await prisma.space.findUnique({
      where: { id },
    });

    if (!space) {
      return NextResponse.json(
        { success: false, error: "Espacio no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: space });
  } catch (error) {
    console.error("Error al obtener espacio:", error);
    return NextResponse.json(
      { success: false, error: "Error al consultar el espacio." },
      { status: 500 }
    );
  }
}

// PUT /api/spaces/[id] - Editar espacio (Solo Admin)
export async function PUT(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await requireAdmin();
    if (!session.user) {
      return NextResponse.json(
        { success: false, error: session.error },
        { status: session.statusCode }
      );
    }

    const { id } = await params;
    const body = (await request.json()) as UpdateSpaceInput;

    const existingSpace = await prisma.space.findUnique({ where: { id } });
    if (!existingSpace) {
      return NextResponse.json(
        { success: false, error: "Espacio no encontrado." },
        { status: 404 }
      );
    }

    const updatedSpace = await prisma.space.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description && { description: body.description }),
        ...(body.type && { type: body.type }),
        ...(body.capacity && { capacity: Number(body.capacity) }),
        ...(body.hourlyPrice && { hourlyPrice: Number(body.hourlyPrice) }),
        ...(body.imageUrl && { imageUrl: body.imageUrl }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Espacio actualizado correctamente.",
      data: updatedSpace,
    });
  } catch (error) {
    console.error("Error al actualizar espacio:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar el espacio." },
      { status: 500 }
    );
  }
}

// PATCH /api/spaces/[id] - Cambiar estado (Activar / Desactivar)
export async function PATCH(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await requireAdmin();
    if (!session.user) {
      return NextResponse.json(
        { success: false, error: session.error },
        { status: session.statusCode }
      );
    }

    const { id } = await params;
    const body = (await request.json()) as { isActive?: boolean };

    if (body.isActive === undefined) {
      return NextResponse.json(
        { success: false, error: "Se debe especificar el campo 'isActive'." },
        { status: 400 }
      );
    }

    const existingSpace = await prisma.space.findUnique({ where: { id } });
    if (!existingSpace) {
      return NextResponse.json(
        { success: false, error: "Espacio no encontrado." },
        { status: 404 }
      );
    }

    // Regla de Negocio 13: No se puede desactivar si tiene reservas futuras confirmadas
    if (body.isActive === false) {
      const now = new Date();
      const futureReservationsCount = await prisma.reservation.count({
        where: {
          spaceId: id,
          status: ReservationStatus.CONFIRMED,
          startTime: { gt: now },
        },
      });

      if (futureReservationsCount > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `No se puede desactivar el espacio porque tiene ${futureReservationsCount} reserva(s) futura(s) confirmada(s).`,
          },
          { status: 409 }
        );
      }
    }

    const space = await prisma.space.update({
      where: { id },
      data: { isActive: body.isActive },
    });

    return NextResponse.json({
      success: true,
      message: body.isActive ? "Espacio activado." : "Espacio desactivado.",
      data: space,
    });
  } catch (error) {
    console.error("Error al cambiar estado del espacio:", error);
    return NextResponse.json(
      { success: false, error: "Error al cambiar estado del espacio." },
      { status: 500 }
    );
  }
}