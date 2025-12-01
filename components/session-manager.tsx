"use client";

import { useState, useEffect } from 'react';
import { SessionCard } from './session-card';
import { useSession } from '@/lib/hooks/useSession';

interface SessionManagerProps {
  children: React.ReactNode;
}

export function SessionManager({ children }: SessionManagerProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const { session, closeSession } = useSession(activeSessionId || undefined);

  // Expor função para criar sessão globalmente
  if (typeof window !== 'undefined') {
    (window as any).__setActiveSession = setActiveSessionId;
  }

  // Auto-fechar card quando sessão for encerrada
  useEffect(() => {
    if (session?.status === 'closed' || session?.status === 'expired') {
      setActiveSessionId(null);
    }
  }, [session?.status]);

  const handleCloseSession = async () => {
    if (activeSessionId) {
      await closeSession(activeSessionId);
      setActiveSessionId(null);
    }
  };

  return (
    <>
      {children}
      
      {/* SessionCard fixo no canto superior direito */}
      {session && activeSessionId && (
        <SessionCard
          session={session}
          onClose={handleCloseSession}
        />
      )}
    </>
  );
}
