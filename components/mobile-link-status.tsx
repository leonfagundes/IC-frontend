"use client";

import { useEffect, useState } from "react";
import { Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileConnection } from "./mobile-connection-provider";

const SESSION_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

export function MobileLinkStatus() {
  const { isConnected, setIsConnected, sessionId, setSessionId } = useMobileConnection();
  const [timeRemaining, setTimeRemaining] = useState(SESSION_DURATION);

  useEffect(() => {
    if (!isConnected) {
      setTimeRemaining(SESSION_DURATION);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1000;
        
        // Quando o tempo acabar, desconectar
        if (newTime <= 0) {
          setIsConnected(false);
          setSessionId(null);
          
          // Notificar o servidor para encerrar a sessão
          if (sessionId) {
            fetch("/api/mobile-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                desktopSessionId: sessionId,
                action: "disconnect",
              }),
            }).catch(err => console.error("Erro ao encerrar sessão:", err));
          }
          
          return SESSION_DURATION;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, sessionId, setIsConnected, setSessionId]);

  const handleDisconnect = () => {
    setIsConnected(false);
    setSessionId(null);
    
    // Notificar o servidor para encerrar a sessão
    if (sessionId) {
      fetch("/api/mobile-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          desktopSessionId: sessionId,
          action: "disconnect",
        }),
      }).catch(err => console.error("Erro ao encerrar sessão:", err));
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isConnected) return null;

  return (
    <div className="fixed top-16 right-4 z-40 animate-in slide-in-from-top-5 duration-300">
      <div className="bg-green-50 dark:bg-green-950 border-2 border-green-500 rounded-lg shadow-lg p-3 flex items-center gap-3 min-w-[200px]">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative">
            <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-green-700 dark:text-green-300">
              Celular vinculado
            </span>
            <span className="text-xs text-green-600 dark:text-green-400 font-mono">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100"
          onClick={handleDisconnect}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
