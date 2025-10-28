"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Locale = "pt" | "en" | "es";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");
  const [messages, setMessages] = useState<any>({});

  useEffect(() => {
    // Carregar idioma salvo
    const saved = localStorage.getItem("language") as Locale;
    if (saved && ["pt", "en", "es"].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    // Carregar mensagens do idioma
    import(`@/messages/${locale}.json`).then((module) => {
      setMessages(module.default);
    });
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("language", newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value = messages;
    
    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key; // Retorna a chave se não encontrar a tradução
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
