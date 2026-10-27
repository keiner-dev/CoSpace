"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
                {/* Logo oficial CoSpace con imagen */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="CoSpace Logo"
            className="w-8 h-8 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
          />
          <span className="text-xl font-bold tracking-tight">CoSpace</span>
        </Link>

        {/* Links principales */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {t.nav.home}
          </Link>
          <Link href="/spaces" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {t.nav.spaces}
          </Link>
          {user && (
            <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {t.nav.dashboard}
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
            >
              {t.nav.admin}
            </Link>
          )}
        </nav>

        {/* Auth & Selector */}
        <div className="flex items-center gap-3">
          <LanguageSelector />
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 hidden sm:inline">
                {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="text-xs bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-md font-medium transition"
              >
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                {t.nav.register}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}