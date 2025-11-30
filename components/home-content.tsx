"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoUpload } from "@/components/photo-upload";
import { HelpButton } from "@/components/help-button";
import { useI18n } from "@/components/i18n-provider";
import { useMobileConnection } from "@/components/mobile-connection-provider";
import { Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeContent() {
  const { t } = useI18n();
  const { isConnected, setIsConnected } = useMobileConnection();

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Indicador de conexão móvel */}
      {isConnected && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 dark:bg-green-400 rounded-full p-1.5">
                <Smartphone className="h-4 w-4 text-white dark:text-black" />
              </div>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Celular conectado
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDisconnect}
              className="h-6 w-6 text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <section className="text-center space-y-3 sm:space-y-4 py-4 sm:py-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {t("home.title")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            {t("home.subtitle")}
          </p>
        </section>

        <section className="flex justify-center py-4 sm:py-6">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl">{t("home.uploadTitle")}</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {t("home.uploadDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <PhotoUpload />
            </CardContent>
          </Card>
        </section>
      </div>
      
      <HelpButton />
    </div>
  );
}
