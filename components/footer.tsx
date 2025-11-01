"use client";

import { useI18n } from "./i18n-provider";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();
  
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          © {currentYear} {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
