"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLanguage("es")}
        className={`px-2 py-1 rounded transition-colors ${
          language === "es"
            ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
        }`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 rounded transition-colors ${
          language === "en"
            ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
        }`}
      >
        EN
      </button>
    </div>
  );
}