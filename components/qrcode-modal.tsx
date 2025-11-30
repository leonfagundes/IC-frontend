"use client";

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  expiresAt?: Date;
}

export function QRCodeModal({ isOpen, onClose, sessionId, expiresAt }: QRCodeModalProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [showGuide, setShowGuide] = useState(true);
  
  // URL que o celular vai acessar
  const mobileUrl = `${window.location.origin}/mobile-upload/${sessionId}`;

  // Atualizar contador de tempo
  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = expiresAt.getTime() - now;
      
      if (remaining <= 0) {
        setTimeRemaining('Expirado');
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Smartphone className="h-5 w-5" />
            Enviar pelo Celular
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Escaneie o QR Code abaixo com seu celular para enviar imagens
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          {/* QR Code */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
            <QRCodeSVG
              value={mobileUrl}
              size={200}
              level="H"
              includeMargin
            />
          </div>

          {/* Tempo restante */}
          {expiresAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Sessão expira em: <strong>{timeRemaining}</strong></span>
            </div>
          )}

          {/* URL alternativa ou Guia */}
          <div className="w-full">
            {showGuide ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-center">Como vincular:</p>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Abra a câmera do seu celular</li>
                  <li>Aponte para o QR Code acima</li>
                  <li>Toque na notificação que aparecer</li>
                  <li>Selecione ou tire a foto desejada</li>
                </ol>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-2 text-center">
                  Ou acesse diretamente:
                </p>
                <div className="bg-muted p-3 rounded text-xs break-all text-center">
                  {mobileUrl}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setShowGuide(!showGuide)}
          >
            {showGuide ? 'Acessar diretamente' : 'Abrir guia'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
