import { useState, useEffect, useCallback } from 'react';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  updateDoc, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Session, SessionStatus } from '@/lib/types/session';

const SESSION_DURATION_MS = 5 * 60 * 1000; // 5 minutos

export const useSession = (sessionId?: string) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Criar nova sessão (desktop)
  const createSession = useCallback(async (): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const newSessionId = generateSessionId();
      const now = Timestamp.now();
      const expiresAt = Timestamp.fromMillis(now.toMillis() + SESSION_DURATION_MS);
      
      const newSession: Omit<Session, 'id'> = {
        status: 'pending',
        createdAt: now,
        expiresAt,
        desktopConnected: true,
        mobileConnected: false,
        lastUpdateAt: now
      };

      await setDoc(doc(db, 'sessions', newSessionId), newSession);
      setLoading(false);
      
      return newSessionId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar sessão';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  // Conectar como mobile
  const connectMobile = useCallback(async (sessionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const sessionRef = doc(db, 'sessions', sessionId);
      const sessionSnap = await getDoc(sessionRef);
      
      if (!sessionSnap.exists()) {
        throw new Error('Sessão não encontrada');
      }

      const sessionData = sessionSnap.data() as Session;
      
      // Verificar se sessão expirou
      if (sessionData.expiresAt.toMillis() < Date.now()) {
        await updateDoc(sessionRef, {
          status: 'expired',
          lastUpdateAt: serverTimestamp()
        });
        throw new Error('Sessão expirada');
      }

      // Conectar mobile
      await updateDoc(sessionRef, {
        mobileConnected: true,
        status: 'active',
        lastUpdateAt: serverTimestamp()
      });
      
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao conectar mobile';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  // Encerrar sessão
  const closeSession = useCallback(async (sessionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const sessionRef = doc(db, 'sessions', sessionId);
      await updateDoc(sessionRef, {
        status: 'closed',
        lastUpdateAt: serverTimestamp()
      });
      
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao encerrar sessão';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  // Listener para mudanças em tempo real
  useEffect(() => {
    if (!sessionId) {
      setSession(null);
      return;
    }

    setLoading(true);
    const sessionRef = doc(db, 'sessions', sessionId);

    const unsubscribe = onSnapshot(
      sessionRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Omit<Session, 'id'>;
          setSession({ ...data, id: snapshot.id });
          
          // Verificar expiração
          if (data.status !== 'expired' && data.status !== 'closed') {
            if (data.expiresAt.toMillis() < Date.now()) {
              updateDoc(sessionRef, {
                status: 'expired',
                lastUpdateAt: serverTimestamp()
              });
            }
          }
        } else {
          setSession(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [sessionId]);

  return {
    session,
    loading,
    error,
    createSession,
    connectMobile,
    closeSession
  };
};

// Gera um ID único para a sessão
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
