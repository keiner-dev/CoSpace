import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { ReservationStatus, Role } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  _request: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await getSessionUser();
    if (!session.user) {
      return NextResponse.json(
        { success: false, error: session.error },
        { status: session.statusCode }
      );
    }

    const { id } = await params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return NextResponse.json(
        { success: false, error: "Reserva no encontrada." },
        { status: 404 }
      );
    }

    // Regla 9 y 14: Solo el dueño o un ADMIN pueden cancelarla
    const isOwner = reservation.userId === session.user.userId;
    const isAdmin = session.user.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "No tienes autorización para cancelar esta reserva." },
        { status: 403 }
      );
    }

    // Comprobar si ya estaba cancelada
    if (reservation.status === ReservationStatus.CANCELLED) {
      return NextResponse.json(
        { success: false, error: "La reserva ya se encuentra cancelada." },
        { status: 400 }
      );
    }

    // Regla 10: Cancelación hasta 2 horas antes de su inicio (aplica a usuarios regulares)
    if (!isAdmin) {
      const now = new Date();
      const startTime = new Date(reservation.startTime);
      const diffInHours = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 2) {
        return NextResponse.json(
          {
            success: false,
            error: "Solo se puede cancelar una reserva con al menos 2 horas de anticipación a su inicio.",
          },
          { status: 400 }
        );
      }
    }

    // Regla 11: Se cambia el estado a CANCELLED (no se elimina)
    const cancelledReservation = await prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.CANCELLED },
    });

    return NextResponse.json({
      success: true,
      message: "Reserva cancelada exitosamente.",
      data: cancelledReservation,
    });
  } catch (error) {
    console.error("Error al cancelar reserva:", error);
    return NextResponse.json(
      { success: false, error: "Error al procesar la cancelación." },
      { status: 500 }
    );
  }
}