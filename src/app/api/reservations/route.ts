import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { ReservationStatus, Role } from "@prisma/client";

interface CreateReservationInput {
  spaceId?: string;
  startTime?: string; // Formato ISO: "2026-10-28T10:00:00Z"
  endTime?: string;   // Formato ISO: "2026-10-28T12:00:00Z"
}

// GET /api/reservations - Listar reservas propias
export async function GET(): Promise<NextResponse> {
  try {
    const session = await getSessionUser();
    if (!session.user) {
      return NextResponse.json(
        { success: false, error: session.error },
        { status: session.statusCode }
      );
    }

    // Regla 14: Usuario normal solo ve sus reservas. Admin puede ver todas.
    const whereCondition =
      session.user.role === Role.ADMIN ? {} : { userId: session.user.userId };

    const reservations = await prisma.reservation.findMany({
      where: whereCondition,
      include: {
        space: {
          select: {
            id: true,
            name: true,
            type: true,
            imageUrl: true,
            hourlyPrice: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al obtener las reservas." },
      { status: 500 }
    );
  }
}

// POST /api/reservations - Crear una reserva
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getSessionUser();
    if (!session.user) {
      return NextResponse.json(
        { success: false, error: session.error },
        { status: session.statusCode }
      );
    }

    const body = (await request.json()) as CreateReservationInput;
    const { spaceId, startTime, endTime } = body;

    // Validación básica de campos
    if (!spaceId || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, error: "spaceId, startTime y endTime son requeridos." },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { success: false, error: "Formato de fecha u hora no válido." },
        { status: 400 }
      );
    }

    // 1. Regla 3: No en el pasado
    if (start < now) {
      return NextResponse.json(
        { success: false, error: "No se puede reservar en una fecha u hora pasada." },
        { status: 400 }
      );
    }

    // 2. Regla 3: No más de 30 días de anticipación
    const maxFutureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (start > maxFutureDate) {
      return NextResponse.json(
        { success: false, error: "No se puede reservar con más de 30 días de anticipación." },
        { status: 400 }
      );
    }

    // 3. Regla 1: Horas completas (minutos, segundos y milisegundos en 0)
    if (
      start.getMinutes() !== 0 ||
      start.getSeconds() !== 0 ||
      end.getMinutes() !== 0 ||
      end.getSeconds() !== 0
    ) {
      return NextResponse.json(
        { success: false, error: "Las reservas solo se permiten en horas completas (ejemplo: 10:00 a 12:00)." },
        { status: 400 }
      );
    }

    // 4. Regla 1: Duración entre 1 y 4 horas exactas
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (durationHours < 1 || durationHours > 4 || !Number.isInteger(durationHours)) {
      return NextResponse.json(
        { success: false, error: "La reserva debe durar entre 1 y 4 horas completas." },
        { status: 400 }
      );
    }

    // 5. Regla 2: Horario permitido entre las 7:00 y las 21:00
    const startHour = start.getHours();
    const endHour = end.getHours();
    if (startHour < 7 || endHour > 21 || (endHour === 21 && end.getMinutes() > 0)) {
      return NextResponse.json(
        { success: false, error: "El horario permitido de reservas es únicamente entre las 7:00 y las 21:00." },
        { status: 400 }
      );
    }

    // Comprobar que sea el mismo día calendario
    if (start.toDateString() !== end.toDateString()) {
      return NextResponse.json(
        { success: false, error: "La reserva debe comenzar y terminar el mismo día." },
        { status: 400 }
      );
    }

    // 6. Regla 7: El espacio debe existir y estar activo
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space || !space.isActive) {
      return NextResponse.json(
        { success: false, error: "El espacio seleccionado no existe o se encuentra desactivado." },
        { status: 400 }
      );
    }

    // 7. Regla 6: Máximo 3 reservas futuras confirmadas por usuario
    const futureConfirmedCount = await prisma.reservation.count({
      where: {
        userId: session.user.userId,
        status: ReservationStatus.CONFIRMED,
        startTime: { gt: now },
      },
    });

    if (futureConfirmedCount >= 3) {
      return NextResponse.json(
        { success: false, error: "Has alcanzado el límite máximo permitido de 3 reservas futuras confirmadas." },
        { status: 409 }
      );
    }

    // 8. Regla 4: No solapamiento en el mismo espacio
    // Dos intervalos [A, B] y [C, D] se solapan si: A < D && B > C
    const spaceOverlap = await prisma.reservation.findFirst({
      where: {
        spaceId,
        status: ReservationStatus.CONFIRMED,
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } },
        ],
      },
    });

    if (spaceOverlap) {
      return NextResponse.json(
        { success: false, error: "El espacio ya cuenta con una reserva confirmada en ese rango horario." },
        { status: 409 }
      );
    }

    // 9. Regla 5: No solapamiento para el mismo usuario (en cualquier espacio)
    const userOverlap = await prisma.reservation.findFirst({
      where: {
        userId: session.user.userId,
        status: ReservationStatus.CONFIRMED,
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } },
        ],
      },
    });

    if (userOverlap) {
      return NextResponse.json(
        { success: false, error: "Ya tienes otra reserva confirmada que se cruza con este horario." },
        { status: 409 }
      );
    }

    // 10. Regla 8: Precio total calculado exclusivamente por el servidor
    const hourlyPriceNum = Number(space.hourlyPrice);
    const totalPrice = hourlyPriceNum * durationHours;

    // Crear la reserva
    const reservation = await prisma.reservation.create({
      data: {
        userId: session.user.userId,
        spaceId: space.id,
        startTime: start,
        endTime: end,
        totalPrice,
        status: ReservationStatus.CONFIRMED,
      },
      include: {
        space: {
          select: { name: true, type: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Reserva creada exitosamente.",
        data: reservation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear reserva:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al procesar la reserva." },
      { status: 500 }
    );
  }
}