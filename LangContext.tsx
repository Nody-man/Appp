"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Lang, translations, type TranslationStrings } from "./i18n";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationStrings;
}

const LangContext = createContext<LangContextType>({
  lang: "ru",
  setLang: () => {},
  t: translations.ru,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("toza-lang") as Lang | null;
    if (stored && (stored === "ru" || stored === "uz" || stored === "en")) {
      setLangState(stored);
    }
    setHydrated(true);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("toza-lang", l);
  };

  // Prevent hydration mismatch by rendering with default "ru" until hydrated
  const activeLang = hydrated ? lang : "ru";

  return (
    <LangContext.Provider value={{ lang: activeLang, setLang, t: translations[activeLang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
