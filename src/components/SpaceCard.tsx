import Image from "next/image";
import Link from "next/link";
import { SpaceType } from "@prisma/client";

export interface SpaceItem {
  id: string;
  name: string;
  description: string;
  type: SpaceType;
  capacity: number;
  hourlyPrice: number | string;
  imageUrl: string;
  isActive: boolean;
}

const typeLabels: Record<SpaceType, { label: string; color: string }> = {
  DESK: { label: "Escritorio", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
  BOOTH: { label: "Cabina", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300" },
  MEETING_ROOM: { label: "Sala de Juntas", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300" },
};

export default function SpaceCard({ space }: { space: SpaceItem }) {
  const badge = typeLabels[space.type] || { label: space.type, color: "bg-zinc-100 text-zinc-800" };

  return (
    <div className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      {/* Optimización de Imagen con next/image */}
      <div className="relative w-full h-48 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <Image
          src={space.imageUrl}
          alt={space.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.color}`}>
            {badge.label}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white line-clamp-1">
              {space.name}
            </h3>
            <span className="text-xs text-zinc-500">Cap. {space.capacity} pers.</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4">
            {space.description}
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              ${Number(space.hourlyPrice).toFixed(2)}
            </span>
            <span className="text-xs text-zinc-500"> / hora</span>
          </div>

          <Link
            href={`/spaces/${space.id}`}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition"
          >
            Reservar
          </Link>
        </div>
      </div>
    </div>
  );
}