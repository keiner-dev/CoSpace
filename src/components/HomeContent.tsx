"use client";

import Link from "next/link";
import AnimatedContent from "@/components/AnimatedContent";

export default function HomeContent() {
  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24 flex flex-col items-center text-center">
        {/* Badge */}
        <AnimatedContent
          distance={40}
          direction="vertical"
          duration={0.6}
          ease="power3.out"
          blur={10}
          trigger="mount"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              El nuevo estándar de coworking por horas
            </span>
          </div>
        </AnimatedContent>

        {/* Título Principal */}
        <AnimatedContent
          distance={60}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          blur={8}
          delay={0.15}
          trigger="mount"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white max-w-4xl tracking-tight mb-6 leading-tight">
            Espacios de trabajo flexibles, reserva por horas{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              sin contratos
            </span>
            .
          </h1>
        </AnimatedContent>

        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          blur={6}
          delay={0.3}
          trigger="mount"
        >
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Accede a escritorios ergonómicos, cabinas acústicas privadas y salas de juntas ejecutivas con tarificación exacta en horas completas. Rápido, flexible y con confirmación inmediata.
          </p>
        </AnimatedContent>

        {/* Botones de Acción */}
        <AnimatedContent
          distance={40}
          direction="vertical"
          duration={0.7}
          ease="power3.out"
          delay={0.45}
          trigger="mount"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/spaces"
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
            >
              Explorar Espacios Disponibles →
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold text-sm border border-zinc-200 dark:border-zinc-700 transition"
            >
              Iniciar Sesión
            </Link>
          </div>
        </AnimatedContent>

        {/* Indicadores de Reglas del Negocio */}
        <AnimatedContent
          distance={30}
          direction="vertical"
          duration={0.6}
          ease="power2.out"
          delay={0.6}
          trigger="mount"
          stagger={0.1}
          className="flex flex-wrap items-center justify-center gap-6 text-zinc-500 text-xs font-medium"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Bloques de 1 a 4 horas</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-500 font-bold">✓</span>
            <span>Horario de 7:00 a 21:00</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Cancelación hasta 2h antes</span>
          </div>
        </AnimatedContent>
      </section>

      {/* CARACTERÍSTICAS / PILARES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={0.7}
          ease="power3.out"
          blur={6}
          threshold={0.2}
        >
          <div className="mb-10 text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Diseñado para máxima productividad
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-2">
              Tres tipos de espacios diseñados para cada momento de tu jornada laboral.
            </p>
          </div>
        </AnimatedContent>

        <AnimatedContent
          distance={80}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          blur={4}
          stagger={0.15}
          threshold={0.1}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Pilar 1: Hot Desks */}
          <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:border-indigo-500/50 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 text-2xl mb-4">
                🖥️
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Puestos Flexibles
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-1 mb-2">
                Hot Desks Ergonómicos
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Escritorios individuales con monitores ergonómicos, tomas de corriente dedicadas y café ilimitado para jornadas intensas de trabajo.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
              <span className="text-zinc-500">Tarifa</span>
              <span className="font-bold text-indigo-600">Desde $5/hora</span>
            </div>
          </div>

          {/* Pilar 2: Cabinas Acústicas */}
          <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:border-indigo-500/50 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 text-2xl mb-4">
                🎙️
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Aislamiento Total
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-1 mb-2">
                Cabinas Acústicas
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Módulos insonorizados (-38dB) con ventilación activa e iluminación graduable, ideales para videollamadas privadas y podcasts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
              <span className="text-zinc-500">Tarifa</span>
              <span className="font-bold text-purple-600">Desde $10/hora</span>
            </div>
          </div>

          {/* Pilar 3: Salas de Juntas */}
          <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:border-indigo-500/50 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 text-2xl mb-4">
                👥
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Colaboración Ejecutiva
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-1 mb-2">
                Salas de Reuniones 4K
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Espacios equipados con pantallas 4K, pizarras y sistema de videoconferencia para presentaciones y talleres de equipo.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
              <span className="text-zinc-500">Tarifa</span>
              <span className="font-bold text-emerald-600">Desde $25/hora</span>
            </div>
          </div>
        </AnimatedContent>
      </section>

      {/* BANNER CTA FINAL */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedContent
          distance={60}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          blur={8}
          threshold={0.2}
        >
          <div className="p-10 rounded-2xl bg-zinc-900 dark:bg-zinc-900 text-white border border-zinc-800 text-center">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              ¿Listo para tu próxima jornada de trabajo?
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto mb-8">
              Selecciona tu espacio preferido, elige tus horas y confirma al instante.
            </p>
            <Link
              href="/spaces"
              className="inline-block px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30"
            >
              Ver Catálogo de Espacios
            </Link>
          </div>
        </AnimatedContent>
      </section>
    </div>
  );
}
