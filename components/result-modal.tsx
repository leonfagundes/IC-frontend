"use client";

import { useEffect, useState } from "react";
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
  uploadedImage?: string | null;
}

export function ResultModal({ open, onOpenChange, isLoading, prediction, uploadedImage }: ResultModalProps) {
  const { t } = useI18n();
  const [loadingMessage, setLoadingMessage] = useState({
    title: "Analisando imagem...",
    description: "Aguarde enquanto processamos sua imagem."
  });
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    if (!isLoading) {
      setLoadingMessage({
        title: t("result.analyzing"),
        description: t("result.analyzingDesc")
      });
      setCountdown(120); // Reset countdown quando não está carregando
      return;
    }

    const timer10s = setTimeout(() => {
      setLoadingMessage({
        title: t("result.startingServer"),
        description: t("result.startingServerDesc")
      });
    }, 10000);

    const timer20s = setTimeout(() => {
      setLoadingMessage({
        title: t("result.serverRestarting"),
        description: t("result.serverRestartingDesc")
      });
      setCountdown(120); // Iniciar countdown em 2 minutos
    }, 20000);

    return () => {
      clearTimeout(timer10s);
      clearTimeout(timer20s);
    };
  }, [isLoading, t]);

  // Countdown timer que decrementa a cada segundo após 20s
  useEffect(() => {
    if (!isLoading || countdown <= 0) return;

    // Só iniciar o countdown se estiver na mensagem de reinício (após 20s)
    if (loadingMessage.title !== t("result.serverRestarting")) return;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isLoading, countdown, loadingMessage.title, t]);

  // Formatar tempo em MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
            <DialogTitle className="text-2xl">{loadingMessage.title}</DialogTitle>
            <DialogDescription className="text-center max-w-md">
              {loadingMessage.description}
            </DialogDescription>
            {loadingMessage.title === t("result.serverRestarting") && countdown > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t("result.timeRemaining")}</p>
                <p className="text-3xl font-bold text-primary tabular-nums">
                  {formatTime(countdown)}
                </p>
              </div>
            )}
          </div>
        ) : prediction && info ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{t("result.title")}</DialogTitle>
              <DialogDescription>
                {t("result.description")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Card de resultado */}
              <div className="border rounded-lg p-6 space-y-4 bg-accent/30">
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {uploadedImage ? (
                      <Image
                        src={uploadedImage}
                        alt="Imagem enviada"
                        fill
                        className="object-cover"
                      />
                    ) : (
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
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-2xl font-bold text-primary">{info.name}</h3>
                    
                    {/* Acurácia Global do Modelo */}
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {t("result.globalAccuracy")}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: '90.6%' }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          90,6%
                        </span>
                      </div>
                    </div>

                    {/* Confiança desta Predição */}
                    {prediction.confidence && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {t("result.predictionConfidence")}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-500"
                              style={{ width: `${prediction.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
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
                  <strong>⚠️ {t("result.warning")}</strong> {t("result.warningText")}
                </p>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
