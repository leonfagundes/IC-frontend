"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useI18n } from "./i18n-provider";

interface ResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  prediction: {
    class: string;
    confidence?: number;
  } | null;
}

export function ResultModal({ open, onOpenChange, isLoading, prediction }: ResultModalProps) {
  const { t } = useI18n();

  // Mapear classes para nomes traduzidos e imagens
  const classInfo: Record<string, { name: string; description: string; image: string }> = {
    'glioma': {
      name: t("help.glioma"),
      description: t("help.gliomaDesc"),
      image: "/tipos-tumor/glioma.jpg"
    },
    'meningioma': {
      name: t("help.meningioma"),
      description: t("help.meningiomaDesc"),
      image: "/tipos-tumor/meningioma.jpg"
    },
    'pituitary': {
      name: t("help.pituitary"),
      description: t("help.pituitaryDesc"),
      image: "/tipos-tumor/pituitary.jpg"
    },
    'notumor': {
      name: t("help.noTumor"),
      description: t("help.noTumorDesc"),
      image: "/tipos-tumor/notumor.jpg"
    },
    'no_tumor': {
      name: t("help.noTumor"),
      description: t("help.noTumorDesc"),
      image: "/tipos-tumor/notumor.jpg"
    }
  };

  const currentClass = prediction?.class.toLowerCase();
  const info = currentClass ? classInfo[currentClass] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <DialogTitle className="text-2xl">Analisando imagem...</DialogTitle>
            <DialogDescription>
              Aguarde enquanto processamos sua imagem.
            </DialogDescription>
          </div>
        ) : prediction && info ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Resultado da Análise</DialogTitle>
              <DialogDescription>
                Aqui está o resultado da análise da sua imagem.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Card de resultado */}
              <div className="border rounded-lg p-6 space-y-4 bg-accent/30">
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={info.image}
                      alt={info.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-2xl font-bold text-primary">{info.name}</h3>
                    {prediction.confidence && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Confiança da predição:
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${prediction.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">
                            {(prediction.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {info.description}
                  </p>
                </div>
              </div>

              {/* Aviso importante */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                <p className="text-sm text-amber-900 dark:text-amber-200">
                  <strong>⚠️ Importante:</strong> Este resultado é apenas uma predição do modelo de IA e não substitui uma avaliação médica profissional. Sempre consulte um médico especialista para diagnósticos precisos.
                </p>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
