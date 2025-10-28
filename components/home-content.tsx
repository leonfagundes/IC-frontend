"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoUpload } from "@/components/photo-upload";
import { HelpButton } from "@/components/help-button";
import { useI18n } from "@/components/i18n-provider";

export function HomeContent() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <section className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t("home.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("home.subtitle")}
          </p>
        </section>

        <section className="flex justify-center py-6">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t("home.uploadTitle")}</CardTitle>
              <CardDescription>
                {t("home.uploadDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhotoUpload />
            </CardContent>
          </Card>
        </section>
      </div>
      
      <HelpButton />
    </div>
  );
}
