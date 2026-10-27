"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} CoSpace. {t.footer.rights}</p>
      </div>
    </footer>
  );
}