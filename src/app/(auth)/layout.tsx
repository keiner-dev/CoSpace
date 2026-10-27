import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import CoworkingGridMotion from "@/components/CoworkingGridMotion";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-zinc-950 relative overflow-hidden">
      {/* 1. Fondo interactivo de cartas de coworking animadas con GSAP */}
      <CoworkingGridMotion />

      {/* 2. Capa de viñeta para máxima legibilidad y contraste */}
      <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px] pointer-events-none" />

      {/* 3. Selector de idioma */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      {/* 4. Tarjeta de autenticación flotante */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="CoSpace Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-lg border border-zinc-800 group-hover:scale-105 transition-transform"
            />
            <span className="text-2xl font-black tracking-tight text-white">CoSpace</span>
          </Link>
        </div>

        {/* Tarjeta sólida moderna con bordes limpios */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}