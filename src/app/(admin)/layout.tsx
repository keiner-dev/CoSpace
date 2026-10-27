import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <header className="bg-zinc-900 text-white border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-lg text-indigo-400">
            CoSpace
          </Link>
          <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
            PANEL ADMINISTRADOR
          </span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link
            href="/spaces"
            className="text-xs text-zinc-300 hover:text-white transition"
          >
            ← Volver al sitio
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}