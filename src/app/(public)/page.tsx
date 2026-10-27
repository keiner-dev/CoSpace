import Link from "next/link";
import Image from "next/image";

// Mantenemos la estrategia de renderizado estático obligatoria (SSG)
export const dynamic = "error";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Luces difusas de fondo (Spatial Ambient Glows) */}
      <div className="relative w-full">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-r from-blue-300/30 via-indigo-200/30 to-teal-200/20 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-96 -left-20 w-96 h-96 bg-purple-200/25 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-80 -right-20 w-96 h-96 bg-cyan-200/20 blur-3xl pointer-events-none rounded-full" />

        {/* HERO SECTION */}
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24 flex flex-col items-center text-center">
          {/* Badge de cristal iridiscente */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] mb-8 transform hover:scale-[1.02] transition-transform cursor-default border border-white/60 dark:border-white/10">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-[11px] font-bold">
              ✦
            </span>
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 tracking-wide">
              El nuevo estándar del coworking por horas
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Tipografía Principal de Hero */}
          <h1 className="text-4xl sm:text-6xl lg:text-[64px] lg:leading-[72px] font-extrabold text-zinc-900 dark:text-white max-w-4xl tracking-tight mb-6">
            Espacios inspiradores, reserva por horas{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-500 bg-clip-text text-transparent">
              sin fricción
            </span>
            .
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Accede a escritorios ergonómicos, cabinas acústicas privadas y salas de juntas de alta fidelidad con tarificación exacta en horas completas. Sin ataduras, con máxima fluidez.
          </p>

          {/* Buscador Rápido de Cristal Líquido */}
          <div className="w-full max-w-4xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-3xl shadow-[0_20px_48px_-8px_rgba(15,23,42,0.08),inset_0_1px_2px_rgba(255,255,255,1)] dark:shadow-[0_20px_48px_-8px_rgba(0,0,0,0.5)] rounded-3xl p-3 mb-10 border border-white/80 dark:border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              {/* Fecha */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-50/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800 transition-all text-left">
                <span className="material-symbols-outlined text-blue-600 text-[22px]">calendar_today</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Fecha</span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">Hoy en adelante</span>
                </div>
              </div>

              {/* Tipo de Espacio */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-50/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800 transition-all text-left">
                <span className="material-symbols-outlined text-indigo-600 text-[22px]">desk</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tipo Espacio</span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">Desks & Cabinas</span>
                </div>
              </div>

              {/* Horario */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-50/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800 transition-all text-left">
                <span className="material-symbols-outlined text-emerald-600 text-[22px]">schedule</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Horario Permitido</span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">7:00 a 21:00</span>
                </div>
              </div>

              {/* Botón Explorar */}
              <Link
                href="/spaces"
                className="w-full h-full py-3.5 px-6 rounded-2xl bg-blue-600 text-white font-semibold text-sm shadow-[0_8px_20px_rgba(0,113,227,0.25),inset_0_1px_1px_rgba(255,255,255,0.7)] hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span>Explorar</span>
              </Link>
            </div>
          </div>

          {/* Botones Primarios Duales */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/spaces"
              className="px-8 py-3.5 rounded-full bg-blue-600 text-white font-semibold text-sm shadow-[0_10px_25px_rgba(0,89,181,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Explorar Espacios</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl text-zinc-900 dark:text-white font-semibold text-sm shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:bg-white dark:hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all border border-white/60 dark:border-white/10"
            >
              Crear Cuenta
            </Link>
          </div>

          {/* Indicadores de Confianza */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
              <span>Sin contratos forzados</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-[18px]">lock_clock</span>
              <span>Horas de 7:00 a 21:00</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-indigo-600 text-[18px]">near_me</span>
              <span>Cancelación hasta 2h antes</span>
            </div>
          </div>
        </section>

        {/* BENTO GRID FLOTANTE: 3 PILARES DE CRISTAL */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="text-[11px] uppercase tracking-widest text-blue-600 font-bold">
              Arquitectura de Productividad
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-1 tracking-tight">
              Diseñado para alto rendimiento intelectual
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pilar 1 */}
            <div className="bg-white/65 dark:bg-zinc-900/65 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_32px_-4px_rgba(15,23,42,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-none border border-white/80 dark:border-white/10 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">timelapse</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                    Bloques de 1 a 4 Horas
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Flexibilidad Absoluta</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Reserva el tiempo exacto que requiere tu jornada laboral. Sin cuotas de mantenimiento mensual ni contratos extensos.
                </p>
              </div>

              <div className="mt-6 pt-4 bg-zinc-50/70 dark:bg-zinc-800/40 rounded-2xl p-4 flex flex-col gap-2 border border-zinc-200/50 dark:border-zinc-700/50">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Duración permitida</span>
                  <span className="text-blue-600">1h a 4h</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full w-3/4 rounded-full" />
                </div>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white/65 dark:bg-zinc-900/65 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_32px_-4px_rgba(15,23,42,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-none border border-white/80 dark:border-white/10 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">hearing_disabled</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                    -38dB Aislamiento
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Acústica & Conectividad</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Cabinas insonorizadas para videollamadas privadas, internet simétrico de alta velocidad y pantallas 4K para presentaciones de impacto.
                </p>
              </div>

              <div className="mt-6 pt-4 bg-zinc-50/70 dark:bg-zinc-800/40 rounded-2xl p-4 flex items-center justify-between border border-zinc-200/50 dark:border-zinc-700/50">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">1.0 Gbps</span>
                  <span className="text-[11px] text-zinc-500">Baja latencia simétrica</span>
                </div>
                <span className="text-indigo-600 font-black text-sm">WiFi 6E</span>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white/65 dark:bg-zinc-900/65 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_32px_-4px_rgba(15,23,42,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-none border border-white/80 dark:border-white/10 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                    Cero Cargos Ocultos
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Tarifas Transparentes</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  El servidor calcula exactamente el precio según las horas reservadas. Facturación transparente y confirmación instantánea.
                </p>
              </div>

              <div className="mt-6 pt-4 bg-zinc-50/70 dark:bg-zinc-800/40 rounded-2xl p-4 flex flex-col gap-1.5 border border-zinc-200/50 dark:border-zinc-700/50 text-xs">
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Precio calculado</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">Por hora fija</span>
                </div>
                <div className="h-px bg-zinc-200 dark:bg-zinc-700 my-1" />
                <div className="flex justify-between items-center font-bold text-zinc-900 dark:text-white">
                  <span>Cancelación gratuita</span>
                  <span className="text-emerald-600">Hasta 2h antes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL HACIA EL CATÁLOGO */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="p-10 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mb-3">
              ¿Listo para potenciar tu productividad?
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mb-8">
              Encuentra el puesto de trabajo o sala ideal y resérvalo en menos de un minuto.
            </p>
            <Link
              href="/spaces"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all hover:scale-105"
            >
              Ver Catálogo Completo de Espacios
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}