"use client";

import { useEffect, useState } from 'react';
import { Smartphone, X, Clock, Wifi, WifiOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Session } from '@/lib/types/session';

interface SessionCardProps {
  session: Session;
  onClose: () => void;
}

export function SessionCard({ session, onClose }: SessionCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Atualizar contador de tempo
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = session.expiresAt.toMillis() - now;
      
      if (remaining <= 0) {
        setTimeRemaining('00:00');
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [session.expiresAt]);

  // Status visual
  const getStatusInfo = () => {
    switch (session.status) {
      case 'pending':
        return {
          text: 'Aguardando conexão',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          icon: <WifiOff className="h-4 w-4" />
        };
      case 'active':
        return {
          text: 'Celular conectado',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          icon: <Wifi className="h-4 w-4" />
        };
      case 'expired':
        return {
          text: 'Sessão expirada',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          icon: <Clock className="h-4 w-4" />
        };
      case 'closed':
        return {
          text: 'Sessão encerrada',
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          icon: <X className="h-4 w-4" />
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className={`fixed top-20 right-4 w-64 shadow-lg z-40 ${statusInfo.bgColor}`}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Smartphone className={`h-4 w-4 ${statusInfo.color}`} />
            <h3 className="font-semibold text-xs">Sessão Mobile</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-5 w-5 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-1.5">
          {/* Status */}
          <div className={`flex items-center gap-1.5 text-xs ${statusInfo.color}`}>
            {statusInfo.icon}
            <span className="font-medium">{statusInfo.text}</span>
          </div>

          {/* Tempo restante */}
          {(session.status === 'pending' || session.status === 'active') && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Tempo:</span>
              <span className="font-mono font-semibold">{timeRemaining}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
