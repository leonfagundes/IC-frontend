"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";

interface MobileConnectionContextType {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
}

const MobileConnectionContext = createContext<MobileConnectionContextType | undefined>(undefined);

export function MobileConnectionProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isConnected && sessionId) {
      // Limpar timeout anterior se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Configurar timeout de 5 minutos
      timeoutRef.current = setTimeout(async () => {
        try {
          await fetch("/api/mobile-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              session: sessionId,
              action: "close",
            }),
          });
        } catch (error) {
          console.error("Erro ao encerrar sessão:", error);
        }
        setIsConnected(false);
        setSessionId(null);
      }, 5 * 60 * 1000); // 5 minutos
    } else {
      // Limpar timeout se desconectado
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Encerrar sessão no servidor se houver
      if (sessionId) {
        fetch("/api/mobile-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session: sessionId,
            action: "close",
          }),
        }).catch(err => console.error("Erro ao encerrar sessão:", err));
        setSessionId(null);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isConnected, sessionId]);

  return (
    <MobileConnectionContext.Provider value={{ isConnected, setIsConnected, sessionId, setSessionId }}>
      {children}
    </MobileConnectionContext.Provider>
  );
}

export function useMobileConnection() {
  const context = useContext(MobileConnectionContext);
  if (context === undefined) {
    throw new Error("useMobileConnection must be used within a MobileConnectionProvider");
  }
  return context;
}
