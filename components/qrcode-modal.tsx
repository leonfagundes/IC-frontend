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
import { useI18n } from './i18n-provider';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  expiresAt?: Date;
}

export function QRCodeModal({ isOpen, onClose, sessionId, expiresAt }: QRCodeModalProps) {
  const { t } = useI18n();
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
        setTimeRemaining(t('qrcode.expired'));
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
            {t('qrcode.title')}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {t('qrcode.description')}
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
              <span>{t('qrcode.sessionExpires')} <strong>{timeRemaining}</strong></span>
            </div>
          )}

          {/* URL alternativa ou Guia */}
          <div className="w-full">
            {showGuide ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-center">{t('qrcode.howToLink')}</p>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>{t('qrcode.step1')}</li>
                  <li>{t('qrcode.step2')}</li>
                  <li>{t('qrcode.step3')}</li>
                  <li>{t('qrcode.step4')}</li>
                </ol>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-2 text-center">
                  {t('qrcode.orAccessDirectly')}
                </p>
                <div className="bg-muted p-3 rounded text-[10px] sm:text-xs break-all text-center font-bold">
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
            {showGuide ? t('qrcode.accessDirectly') : t('qrcode.openGuide')}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {t('qrcode.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
