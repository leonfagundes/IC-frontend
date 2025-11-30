"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "desktop-session-id";

/**
 * Hook para gerenciar o ID de sessão único do desktop.
 * Cada usuário que entra no site recebe um UUID único.
 * O ID persiste durante a sessão do navegador.
 */
export function useSessionId() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tentar recuperar ID existente do sessionStorage
    let existingId = sessionStorage.getItem(SESSION_KEY);
    
    // Se não existir, gerar novo UUID
    if (!existingId) {
      existingId = uuidv4();
      sessionStorage.setItem(SESSION_KEY, existingId);
    }
    
    setSessionId(existingId);
    setIsLoading(false);
  }, []);

  return { sessionId, isLoading };
}
