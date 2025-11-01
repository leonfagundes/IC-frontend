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
  const [countdown, setCountdown] = useState(180); // 3 minutos
  const TOTAL_TIME = 180; // 3 minutos em segundos

  useEffect(() => {
    if (!isLoading) {
      setLoadingMessage({
        title: t("result.analyzing"),
        description: t("result.analyzingDesc")
      });
      setCountdown(180); // Reset countdown quando não está carregando
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
      setCountdown(180); // Iniciar countdown em 3 minutos
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

  // Calcular progresso (0% quando countdown = 180, 100% quando countdown = 0)
  const progressPercentage = ((TOTAL_TIME - countdown) / TOTAL_TIME) * 100;

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
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4 sm:space-y-6">
            <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-primary" />
            <DialogTitle className="text-xl sm:text-2xl text-center px-4">{loadingMessage.title}</DialogTitle>
            <DialogDescription className="text-center max-w-md text-sm sm:text-base px-4">
              {loadingMessage.description}
            </DialogDescription>
            {loadingMessage.title === t("result.serverRestarting") && countdown > 0 && (
              <div className="w-full max-w-md space-y-3 sm:space-y-4 px-4">
                <div className="text-center space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("result.timeRemaining")}</p>
                  <p className="text-lg font-bold text-muted-foreground tabular-nums">
                    {formatTime(countdown)}
                  </p>
                </div>
                
                {/* Barra de progresso */}
                <div className="space-y-2">
                  <div className="h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-1000 ease-linear"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(progressPercentage)}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : prediction && info ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl">{t("result.title")}</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                {t("result.description")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-6 pt-4">
              {/* Card de resultado */}
              <div className="border rounded-lg p-4 sm:p-6 space-y-4 bg-accent/30">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
                  <div className="flex-1 space-y-2 sm:space-y-3 w-full sm:w-auto">
                    <h3 className="text-xl sm:text-2xl font-bold text-primary text-center sm:text-left">{info.name}</h3>
                    
                    {/* Acurácia Global do Modelo */}
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {t("result.globalAccuracy")}
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: '90.6%' }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">
                          90,6%
                        </span>
                      </div>
                    </div>

                    {/* Confiança desta Predição */}
                    {prediction.confidence && (
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {t("result.predictionConfidence")}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-500"
                              style={{ width: `${prediction.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                            {(prediction.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {info.description}
                  </p>
                </div>
              </div>

              {/* Aviso importante */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
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
