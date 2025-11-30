"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoUpload } from "@/components/photo-upload";
import { HelpButton } from "@/components/help-button";
import { useI18n } from "@/components/i18n-provider";
import Image from "next/image";

export function HomeContent() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <section className="text-center space-y-3 sm:space-y-4 py-4 sm:py-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl flex items-center justify-center gap-3">
            <Image 
              src="/brain_11666649.png" 
              alt="Logo DetectIA" 
              width={60} 
              height={60}
              className="hidden md:block object-contain"
            />
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
