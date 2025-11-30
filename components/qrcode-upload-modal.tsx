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
import { useMobileConnection } from "./mobile-connection-provider";
import { Loader2 } from "lucide-react";

interface QRCodeUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageReceived: (imageData: string) => void;
  desktopSessionId: string;
}

export function QRCodeUploadModal({
  open,
  onOpenChange,
  onImageReceived,
  desktopSessionId,
}: QRCodeUploadModalProps) {
  const { t } = useI18n();
  const { setIsConnected } = useMobileConnection();
  const [qrSize, setQrSize] = useState(200);
  
  // URL contém apenas o desktopSessionId
  const uploadUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/mobile-upload?desktopSessionId=${desktopSessionId}`
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
      return;
    }

    // Polling para verificar conexão e se uma imagem foi enviada
    const checkForUpdates = async () => {
      try {
        const response = await fetch(`/api/check-upload?desktopSessionId=${desktopSessionId}`);
        if (response.ok) {
          const data = await response.json();
          
          // Atualizar status de conexão
          if (data.hasConnection) {
            setIsConnected(true);
          }
          
          // Se recebeu imagem, processar
          if (data.imageData) {
            onImageReceived(data.imageData);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar upload:", error);
      }
    };

    const interval = setInterval(checkForUpdates, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [open, desktopSessionId, onImageReceived, setIsConnected]);

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
        </div>
      </DialogContent>
    </Dialog>
  );
}
