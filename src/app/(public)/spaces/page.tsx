import { prisma } from "@/lib/prisma";
import SpaceCard, { type SpaceItem } from "@/components/SpaceCard";
import Link from "next/link";
import { SpaceType, Space } from "@prisma/client";

// Forzar Server-Side Rendering (SSR) en cada petición
export const dynamic = "force-dynamic";

interface SpacesPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function SpacesPage({ searchParams }: SpacesPageProps) {
  const { type } = await searchParams;

  // Filtrar por tipo si viene en el query param (ej: /spaces?type=DESK)
  const isValidType = type && Object.values(SpaceType).includes(type as SpaceType);
  const filterType = isValidType ? (type as SpaceType) : undefined;

  // Regla 12: Solo espacios activos en el catálogo público
  const spaces: Space[] = await prisma.space.findMany({
    where: {
      isActive: true,
      ...(filterType ? { type: filterType } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedSpaces: SpaceItem[] = spaces.map((s: Space) => ({
    ...s,
    hourlyPrice: Number(s.hourlyPrice),
  }));

  const filters = [
    { label: "Todos", value: undefined },
    { label: "Escritorios", value: SpaceType.DESK },
    { label: "Cabinas", value: SpaceType.BOOTH },
    { label: "Salas de Reuniones", value: SpaceType.MEETING_ROOM },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Catálogo de Espacios
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base">
          Elige el espacio que mejor se adapte a tu jornada y resérvalo por horas al instante.
        </p>
      </div>

      {/* Filtros por tipo de espacio */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => {
          const isActive = (!type && !f.value) || type === f.value;
          const href = f.value ? `/spaces?type=${f.value}` : "/spaces";

          return (
            <Link
              key={f.label}
              href={href}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                  : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {/* Grid de Espacios */}
      {serializedSpaces.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500 text-sm">
            No se encontraron espacios disponibles en esta categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serializedSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </div>
  );
}