"use client";

/**
 * Language/i18n context for the Nukarsa application.
 *
 * Provides `useTranslation()` hook with:
 *   - `t(key)` — resolves dot-notation keys (e.g. "nav.home") to the current locale string
 *   - `language` — current active locale ("id" | "en")
 *   - `setLanguage(lang)` — updates locale and persists to localStorage
 *
 * Also exports `useLanguage()` as a backward-compatible alias.
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { translations } from "@/lib/i18n/translations";

type Language = "id" | "en";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = "nukarsa_lang";
const DEFAULT_LANG: Language = "id";

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

/**
 * Resolves a dot-notation key (e.g. "nav.home") against a nested object.
 * Returns the string value if found, or undefined if not.
 */
function resolveKey(obj: Record<string, unknown>, key: string): string | undefined {
  const parts = key.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : undefined;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLang === "en" || savedLang === "id") {
        setLanguageState(savedLang);
      }
    } catch {
      // localStorage may be unavailable (SSR, private browsing, etc.)
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      // Try current language first
      const value = resolveKey(translations[language] as unknown as Record<string, unknown>, key);
      if (value !== undefined) return value;

      // Fallback to English
      if (language !== "en") {
        const fallback = resolveKey(translations.en as unknown as Record<string, unknown>, key);
        if (fallback !== undefined) return fallback;
      }

      // Last resort: return the key itself (never blank)
      return key;
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Primary i18n hook. Returns `{ t, language, setLanguage }`.
 */
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}

/**
 * Backward-compatible alias for `useTranslation()`.
 * Existing components that import `useLanguage` will continue to work.
 */
export const useLanguage = useTranslation;

/**
 * Language toggle UI component.
 * Renders ID/EN pill buttons for switching locale.
 */
export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center bg-slate-950/60 p-1.5 rounded-full border border-slate-800">
      <button
        onClick={() => setLanguage("id")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
          language === "id"
            ? "bg-blue-600 text-white shadow"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        🇮🇩 ID
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
          language === "en"
            ? "bg-blue-600 text-white shadow"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
