// Armazenamento temporário em memória (em produção, usar Redis ou banco de dados)
interface SessionData {
  desktopSessionId: string;
  mobileSessionId?: string;
  imageData?: string;
  timestamp: number;
  active: boolean;
  expiresAt: number;
}

export const uploadSessions = new Map<string, SessionData>();

export function cleanOldSessions() {
  const now = Date.now();
  for (const [sessionId, session] of uploadSessions.entries()) {
    if (now > session.expiresAt || !session.active) {
      uploadSessions.delete(sessionId);
    }
  }
}
