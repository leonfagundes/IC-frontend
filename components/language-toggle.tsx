"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "./i18n-provider";
import Image from "next/image";

const languages = [
  { code: "pt" as const, name: "Português", flag: "/flags/br.svg" },
  { code: "en" as const, name: "English", flag: "/flags/us.svg" },
  { code: "es" as const, name: "Español", flag: "/flags/es.svg" },
];

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center rounded-full h-9 w-9 border-2 border-border overflow-hidden disabled:opacity-50"
        disabled
      >
        <span className="sr-only">Select language</span>
      </button>
    );
  }

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full h-9 w-9 border-2 border-border overflow-hidden transition-all hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring outline-none hover:scale-110 duration-300">
        <div className="relative w-full h-full">
          <Image
            src={currentLanguage.flag}
            alt={currentLanguage.name}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        <span className="sr-only">Select language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className="cursor-pointer flex items-center gap-3"
          >
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border flex-shrink-0">
              <Image
                src={lang.flag}
                alt={lang.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <span>{lang.name}</span>
            {locale === lang.code && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
