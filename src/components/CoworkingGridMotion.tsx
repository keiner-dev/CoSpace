"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface CoworkingSpaceCard {
  title: string;
  type: string;
  price: string;
  imageUrl: string;
}

// Espacios reales de coworking con fotos y datos de CoSpace
const SPACES_DATA: CoworkingSpaceCard[] = [
  {
    title: "Hot Desk 01",
    type: "Escritorio",
    price: "$5/h",
    imageUrl: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Cabina Acústica Alfa",
    type: "Cabina",
    price: "$10/h",
    imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Sala de Juntas Innovación",
    type: "Sala Reunión",
    price: "$25/h",
    imageUrl: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Hot Desk 02 Silencioso",
    type: "Escritorio",
    price: "$6.5/h",
    imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Sala Creativa Brainstorm",
    type: "Sala Modular",
    price: "$35/h",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Lounge Colaborativo",
    type: "Zona Abierta",
    price: "$8/h",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Meeting Studio 4K",
    type: "Sala Ejecutiva",
    price: "$30/h",
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Puesto Ergonómico Pro",
    type: "Escritorio",
    price: "$7/h",
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80",
  },
];

export default function CoworkingGridMotion() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPercent = (e.clientX / innerWidth - 0.5) * 2; // -1 a 1
      const yPercent = (e.clientY / innerHeight - 0.5) * 2; // -1 a 1

      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        // Alternar direcciones: filas pares hacia la derecha, impares hacia la izquierda
        const direction = index % 2 === 0 ? 1 : -1;
        const targetX = xPercent * 120 * direction;
        const targetY = yPercent * 40 * (direction * 0.5);

        gsap.to(row, {
          x: targetX,
          y: targetY,
          duration: 1.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const rows = [0, 1, 2, 3];

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-zinc-950"
    >
      {/* Contenedor inclinado en perspectiva */}
      <div className="absolute inset-0 flex flex-col justify-center gap-6 -rotate-6 scale-110 opacity-75">
        {rows.map((rowIndex) => {
          // Desplazamos las cartas para que cada fila tenga un orden diferente
          const shiftedCards = [
            ...SPACES_DATA.slice(rowIndex * 2),
            ...SPACES_DATA.slice(0, rowIndex * 2),
            ...SPACES_DATA,
          ];

          return (
            <div
              key={rowIndex}
              ref={(el) => {
                rowRefs.current[rowIndex] = el;
              }}
              className="flex items-center gap-6 whitespace-nowrap will-change-transform"
            >
              {shiftedCards.map((space, cardIndex) => (
                <div
                  key={cardIndex}
                  className="w-64 sm:w-72 flex-shrink-0 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl relative"
                >
                  {/* Foto del espacio */}
                  <div className="relative h-36 w-full overflow-hidden bg-zinc-800">
                    <img
                      src={space.imageUrl}
                      alt={space.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-bold">
                      {space.price}
                    </div>
                    <div className="absolute top-2.5 left-2.5 bg-indigo-600/90 backdrop-blur-md px-2 py-0.5 rounded-md text-white text-[10px] font-semibold uppercase tracking-wider">
                      {space.type}
                    </div>
                  </div>

                  {/* Detalle inferior de la carta */}
                  <div className="p-3 bg-zinc-900 flex justify-between items-center">
                    <p className="text-xs font-semibold text-zinc-200 truncate">
                      {space.title}
                    </p>
                    <span className="text-[10px] text-zinc-500">CoSpace</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}