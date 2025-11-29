"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "./i18n-provider";
import { Loader2 } from "lucide-react";

interface QRCodeUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageReceived: (imageData: string) => void;
  sessionId: string;
}

export function QRCodeUploadModal({
  open,
  onOpenChange,
  onImageReceived,
  sessionId,
}: QRCodeUploadModalProps) {
  const { t } = useI18n();
  const [isWaiting, setIsWaiting] = useState(false);
  const [qrSize, setQrSize] = useState(200);
  const uploadUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/mobile-upload?session=${sessionId}`
    : "";

  useEffect(() => {
    const updateSize = () => {
      setQrSize(window.innerWidth < 640 ? 160 : 200);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!open) {
      setIsWaiting(false);
      return;
    }

    // Polling para verificar se uma imagem foi enviada
    const checkForImage = async () => {
      try {
        const response = await fetch(`/api/check-upload?session=${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.imageData) {
            onImageReceived(data.imageData);
            onOpenChange(false);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar upload:", error);
      }
    };

    const interval = setInterval(checkForImage, 2000);
    return () => clearInterval(interval);
  }, [open, sessionId, onImageReceived, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-center">
            {t("home.qrcodeTitle")}
          </DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base">
            {t("home.qrcodeDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-3 sm:space-y-4 py-2">
          {/* QR Code */}
          <div className="bg-white p-2 sm:p-3 rounded-lg shadow-lg">
            <QRCodeSVG
              value={uploadUrl}
              size={qrSize}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Instruções */}
          <div className="w-full space-y-1.5 bg-muted p-2.5 sm:p-3 rounded-lg">
            <h4 className="font-semibold text-xs">
              Como usar:
            </h4>
            <ol className="text-[10px] sm:text-xs space-y-0.5 list-decimal list-inside text-muted-foreground leading-tight">
              <li>Abra a câmera do seu celular</li>
              <li>Aponte para o QR Code</li>
              <li>Toque na notificação para abrir o link</li>
              <li>Escolha ou tire uma foto</li>
              <li>A imagem aparecerá aqui</li>
            </ol>
          </div>

          {/* Status de aguardando */}
          {isWaiting && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>{t("home.waitingForImage")}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
