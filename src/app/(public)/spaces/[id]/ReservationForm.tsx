"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface ReservationFormProps {
  spaceId: string;
  hourlyPrice: number;
}

export default function ReservationForm({ spaceId, hourlyPrice }: ReservationFormProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Fecha mínima hoy, máxima hoy + 30 días
  const todayStr = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const [date, setDate] = useState<string>(todayStr);
  const [startHour, setStartHour] = useState<number>(9);
  const [endHour, setEndHour] = useState<number>(11);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular horas y precio estimado
  const duration = endHour - startHour;
  const isDurationValid = duration >= 1 && duration <= 4;
  const estimatedPrice = isDurationValid ? duration * hourlyPrice : 0;

  // Horas disponibles: 7:00 a 21:00 (Regla 2)
  const availableHours = Array.from({ length: 15 }, (_, i) => i + 7); // [7, 8, ..., 21]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      router.push("/login");
      return;
    }

    if (!isDurationValid) {
      setError("La reserva debe durar entre 1 y 4 horas.");
      return;
    }

    setLoading(true);

    try {
      // Construir fechas en formato ISO UTC exacto: YYYY-MM-DDTHH:00:00.000Z
      const startIso = `${date}T${String(startHour).padStart(2, "0")}:00:00.000Z`;
      const endIso = `${date}T${String(endHour).padStart(2, "0")}:00:00.000Z`;

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId,
          startTime: startIso,
          endTime: endIso,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No fue posible crear la reserva.");
        setLoading(false);
        return;
      }

      // Redirigir al dashboard de mis reservas
      router.push("/dashboard");
    } catch {
      setError("Error de conexión al procesar la reserva.");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-6 rounded-2xl text-center">
        <p className="text-amber-800 dark:text-amber-300 font-semibold mb-3">
          Inicia sesión para reservar este espacio
        </p>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition"
        >
          Ir al Inicio de Sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
        Reservar este espacio
      </h3>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Fecha */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          Fecha de Reserva (máximo 30 días adelante)
        </label>
        <input
          type="date"
          value={date}
          min={todayStr}
          max={maxDateStr}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-indigo-500"
        />
      </div>

      {/* Horarios */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Hora Inicio
          </label>
          <select
            value={startHour}
            onChange={(e) => {
              const val = Number(e.target.value);
              setStartHour(val);
              if (endHour <= val) setEndHour(val + 1);
            }}
            className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-indigo-500"
          >
            {availableHours.slice(0, -1).map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Hora Fin
          </label>
          <select
            value={endHour}
            onChange={(e) => setEndHour(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-indigo-500"
          >
            {availableHours
              .filter((h) => h > startHour && h <= startHour + 4)
              .map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}:00
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Resumen de cálculo de precio */}
      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs flex justify-between items-center">
        <div>
          <span className="text-zinc-500 block">Duración:</span>
          <span className="font-bold text-zinc-800 dark:text-zinc-200">
            {duration} {duration === 1 ? "hora" : "horas"}
          </span>
        </div>
        <div className="text-right">
          <span className="text-zinc-500 block">Precio Total Estimado:</span>
          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
            ${estimatedPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-zinc-500 leading-tight">
        * Horario disponible: 7:00 a 21:00. Cancelación sin costo hasta 2 horas antes del inicio.
      </p>

      <button
        type="submit"
        disabled={loading || !isDurationValid}
        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition disabled:opacity-50"
      >
        {loading ? "Procesando reserva..." : "Confirmar Reserva"}
      </button>
    </form>
  );
}