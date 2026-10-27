"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ClientFormattedDate from "@/components/ClientFormattedDate";

interface ReservationItem {
  id: string;
  startTime: string;
  endTime: string;
  totalPrice: number | string;
  status: "CONFIRMED" | "CANCELLED";
  canCancel: boolean;
  space: {
    id: string;
    name: string;
    type: string;
    hourlyPrice: number | string;
  };
}

export default function DashboardPage() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  // Carga de datos asíncrona estándar en React 19 (sin llamadas síncronas en el cuerpo del efecto)
  useEffect(() => {
    let ignore = false;

    fetch("/api/reservations", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (ignore) return;

        if (data.data) {
          const nowMs = Date.now();
          const processed: ReservationItem[] = (data.data as Omit<ReservationItem, "canCancel">[]).map((item) => {
            const startTimeMs = new Date(item.startTime).getTime();
            const diffHours = (startTimeMs - nowMs) / (1000 * 60 * 60);
            return {
              ...item,
              canCancel: item.status !== "CANCELLED" && diffHours >= 2,
            };
          });
          setReservations(processed);
        } else {
          setMessage({ type: "error", text: data.error || "Error al cargar las reservas." });
        }
      })
      .catch(() => {
        if (!ignore) {
          setMessage({ type: "error", text: "Error de conexión al cargar reservas." });
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  // Manejador para cancelar reserva (Reglas 9, 10 y 11)
  const handleCancel = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.")) {
      return;
    }

    setCancellingId(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/reservations/${id}/cancel`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "No se pudo cancelar la reserva." });
      } else {
        setMessage({ type: "success", text: "Reserva cancelada exitosamente." });
        // Disparar recarga de datos
        setReloadKey((prev) => prev + 1);
      }
    } catch {
      setMessage({ type: "error", text: "Error de conexión al cancelar la reserva." });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
            Mis Reservas
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            Administra tus reservas activas y consulta tu historial.
          </p>
        </div>

        <Link
          href="/spaces"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm"
        >
          + Reservar Nuevo Espacio
        </Link>
      </div>

      {/* Notificaciones */}
      {message && (
        <div
          className={`p-4 rounded-xl mb-6 text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Contenido */}
      {loading ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500 text-sm animate-pulse">Cargando tus reservas...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-1">
            No tienes reservas registradas
          </h3>
          <p className="text-zinc-500 text-xs mb-6">
            Explora nuestro catálogo de espacios y realiza tu primera reserva por horas.
          </p>
          <Link
            href="/spaces"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition"
          >
            Ver Espacios Disponibles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reservations.map((res) => {
            const isCancelled = res.status === "CANCELLED";

            return (
              <div
                key={res.id}
                className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCancelled
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                          : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {isCancelled ? "CANCELADA" : "CONFIRMADA"}
                    </span>
                    <span className="text-xs text-zinc-400">·</span>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {res.space.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {res.space.name}
                  </h3>

                  <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-2 flex flex-wrap gap-y-1 gap-x-4">
                    <div>
                      📅 <span className="font-medium">Fecha:</span>{" "}
                      <ClientFormattedDate isoString={res.startTime} type="date" />
                    </div>
                    <div>
                      ⏰ <span className="font-medium">Horario:</span>{" "}
                      <ClientFormattedDate isoString={res.startTime} type="time" /> -{" "}
                      <ClientFormattedDate isoString={res.endTime} type="time" />
                    </div>
                    <div>
                      💵 <span className="font-medium">Total:</span>{" "}
                      <span className="font-bold text-zinc-900 dark:text-white">
                        ${Number(res.totalPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {!isCancelled && (
                    res.canCancel ? (
                      <button
                        onClick={() => handleCancel(res.id)}
                        disabled={cancellingId === res.id}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950 transition border border-red-200 dark:border-red-900 disabled:opacity-50"
                      >
                        {cancellingId === res.id ? "Cancelando..." : "Cancelar Reserva"}
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                        No cancelable (&lt; 2h al inicio)
                      </span>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}