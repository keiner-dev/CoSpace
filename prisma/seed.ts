import { PrismaClient, Role, SpaceType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("🌱 Iniciando seed...");

  // 1. Limpiar base de datos previa (opcional pero recomendado para consistencia)
  await prisma.reservation.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.space.deleteMany();
  await prisma.user.deleteMany();

  // 2. Crear Administrador inicial
  const adminPasswordHash = await bcrypt.hash("Admin1234*", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@cospace.com",
      password: adminPasswordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`👤 Administrador creado: ${admin.email}`);

  // 3. Crear Usuario regular de prueba
  const userPasswordHash = await bcrypt.hash("User1234*", 10);
  const regularUser = await prisma.user.create({
    data: {
      name: "Juan Perez",
      email: "juan@cospace.com",
      password: userPasswordHash,
      role: Role.USER,
    },
  });
  console.log(`👤 Usuario de prueba creado: ${regularUser.email}`);

  // 4. Crear Espacios de ejemplo (Escritorios, Salas y Cabinas)
  const spaces = [
    {
      name: "Hot Desk 01",
      description: "Escritorio flexible en zona compartida con conexión de alta velocidad y café ilimitado.",
      type: SpaceType.DESK,
      capacity: 1,
      hourlyPrice: 5.0,
      imageUrl: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80",
      isActive: true,
    },
    {
      name: "Hot Desk 02 (Silencioso)",
      description: "Puesto de trabajo en zona silenciosa con monitor ergonómico incluido.",
      type: SpaceType.DESK,
      capacity: 1,
      hourlyPrice: 6.5,
      imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80",
      isActive: true,
    },
    {
      name: "Cabina Acústica Alfa",
      description: "Cabina insonorizada ideal para llamadas confidenciales, videollamadas o grabaciones.",
      type: SpaceType.BOOTH,
      capacity: 1,
      hourlyPrice: 10.0,
      imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80",
      isActive: true,
    },
    {
      name: "Sala de Juntas Innovación",
      description: "Sala para reuniones de equipo equipada con pantalla 4K, pizarra y sistema de videoconferencia.",
      type: SpaceType.MEETING_ROOM,
      capacity: 8,
      hourlyPrice: 25.0,
      imageUrl: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop&q=80",
      isActive: true,
    },
    {
      name: "Sala Creativa Brainstorm",
      description: "Espacio amplio y dinámico con mobiliario modular para talleres y sesiones de lluvia de ideas.",
      type: SpaceType.MEETING_ROOM,
      capacity: 12,
      hourlyPrice: 35.0,
      imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80",
      isActive: true,
    },
  ];

  for (const space of spaces) {
    await prisma.space.create({ data: space });
  }

  console.log(`🏢 Se crearon ${spaces.length} espacios de coworking.`);
  console.log("✅ Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });