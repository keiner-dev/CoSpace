import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ReservationForm from "./ReservationForm";

// Forzar Server-Side Rendering (SSR)
export const dynamic = "force-dynamic";

interface SpaceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SpaceDetailPage({ params }: SpaceDetailPageProps) {
  const { id } = await params;

  // Consultar espacio en el servidor
  const space = await prisma.space.findUnique({
    where: { id },
  });

  // Regla 12: Si no existe o está desactivado, 404
  if (!space || !space.isActive) {
    notFound();
  }

  const hourlyPriceNum = Number(space.hourlyPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/spaces"
        className="inline-flex items-center text-xs font-semibold text-zinc-500 hover:text-indigo-600 mb-6 transition"
      >
        ← Volver al catálogo de espacios
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información del espacio (2 columnas) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
            <Image
              src={space.imageUrl}
              alt={space.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {space.type}
              </span>
              <span className="text-xs text-zinc-500 font-medium">
                Capacidad: {space.capacity} personas
              </span>
            </div>

            <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">
              {space.name}
            </h1>

            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {space.description}
            </p>
          </div>
        </div>

        {/* Formulario de reserva (1 columna lateral) */}
        <div className="lg:col-span-1">
          <ReservationForm
            spaceId={space.id}
            hourlyPrice={hourlyPriceNum}
          />
        </div>
      </div>
    </div>
  );
}