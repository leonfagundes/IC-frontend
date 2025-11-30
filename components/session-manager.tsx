"use client";

import { useState } from 'react';
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
      {session && (session.status === 'pending' || session.status === 'active') && (
        <SessionCard
          session={session}
          onClose={handleCloseSession}
        />
      )}
    </>
  );
}
