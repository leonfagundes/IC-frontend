"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useI18n } from "./i18n-provider";

export function HelpButton() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const tiposCancer = [
    {
      tipo: t("help.meningioma"),
      descricao: t("help.meningiomaDesc"),
      imagemUrl: "/tipos-tumor/meningioma.jpg"
    },
    {
      tipo: t("help.glioma"),
      descricao: t("help.gliomaDesc"),
      imagemUrl: "/tipos-tumor/glioma.jpg"
    },
    {
      tipo: t("help.pituitary"),
      descricao: t("help.pituitaryDesc"),
      imagemUrl: "/tipos-tumor/pituitary.jpg"
    },
    {
      tipo: t("help.noTumor"),
      descricao: t("help.noTumorDesc"),
      imagemUrl: "/tipos-tumor/notumor.jpg"
    }
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 h-12 sm:h-14 px-4 sm:px-6 gap-2 z-50 group hover:scale-110 bg-primary hover:bg-primary/90"
          >
            <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-12 duration-300" />
            <span className="font-medium text-sm sm:text-base">{t("help.button")}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">{t("help.title")}</DialogTitle>
            <DialogDescription className="text-sm sm:text-base pt-2">
              {t("help.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6 pt-4">
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold">{t("help.instructionsTitle")}</h3>
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>{t("help.step1")}</li>
                <li>{t("help.step2")}</li>
                <li>{t("help.step3")}</li>
                <li>{t("help.step4")}</li>
              </ol>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">{t("help.tumorTypesTitle")}</h3>
              
              <div className="grid gap-3 sm:gap-4">
                {tiposCancer.map((item) => (
                  <div 
                    key={item.tipo}
                    className="flex gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={item.imagemUrl}
                          alt={item.tipo}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold text-sm sm:text-base">{item.tipo}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {item.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                <strong>{t("help.note")}</strong> {t("help.noteText")}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
