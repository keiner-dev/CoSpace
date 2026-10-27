import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

interface RegisterInput {
  name?: string;
  email?: string;
  password?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as RegisterInput;
    const { name, email, password } = body;

    // Validación de entrada
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Todos los campos (nombre, email, contraseña) son obligatorios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "El formato del correo electrónico no es válido." },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Ya existe un usuario con este correo electrónico." },
        { status: 409 }
      );
    }

    // Hashear contraseña y crear usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: Role.USER, // Siempre USER en registro público
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Usuario registrado exitosamente.",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en register:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor al registrar usuario." },
      { status: 500 }
    );
  }
}