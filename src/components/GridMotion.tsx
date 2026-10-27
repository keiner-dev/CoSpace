"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface GridMotionProps {
  items?: (string | React.ReactNode)[];
  gradientColor?: string;
  className?: string;
}

const DEFAULT_ITEMS: string[] = [
  "✦ CoSpace",
  "Escritorios Ergonómicos",
  "Cabinas Acústicas",
  "Salas de Juntas 4K",
  "WiFi 6E Simétrico",
  "Horario 7:00 a 21:00",
  "Sin Contratos",
  "Reserva por Horas",
  "Liquid Glass UI",
  "Productividad",
  "Cancelación Flexible",
  "Confirmación Instantánea",
  "Café de Especialidad",
  "Zonas Silenciosas",
  "Networking",
  "Acceso Rápido",
];

export default function GridMotion({
  items = DEFAULT_ITEMS,
  gradientColor = "rgba(37, 99, 235, 0.12)",
  className = "",
}: GridMotionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Seguimiento suave del mouse con GSAP
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPercent = (e.clientX / innerWidth - 0.5) * 2; // Rango de -1 a 1
      const yPercent = (e.clientY / innerHeight - 0.5) * 2; // Rango de -1 a 1

      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        // Alternar direcciones: filas pares hacia un lado, impares al opuesto
        const direction = index % 2 === 0 ? 1 : -1;
        const targetX = xPercent * 90 * direction;
        const targetY = yPercent * 35 * (direction * 0.5);

        gsap.to(row, {
          x: targetX,
          y: targetY,
          duration: 1.4,
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
  const fullItems = items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      style={{
        background: `radial-gradient(ellipse at center, ${gradientColor} 0%, rgba(248, 250, 252, 0.85) 60%, #f8fafc 100%)`,
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-center gap-6 -rotate-12 scale-125 opacity-65">
        {rows.map((rowIndex) => {
          // Desplazar el arreglo de elementos para que cada fila sea diferente
          const rotatedItems = [
            ...fullItems.slice(rowIndex * 3),
            ...fullItems.slice(0, rowIndex * 3),
            ...fullItems,
          ];

          return (
            <div
              key={rowIndex}
              ref={(el) => {
                rowRefs.current[rowIndex] = el;
              }}
              className="flex items-center gap-5 whitespace-nowrap will-change-transform"
            >
              {rotatedItems.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="px-6 py-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] text-zinc-700 font-semibold text-xs tracking-wide flex items-center gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600/80" />
                  {item}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}