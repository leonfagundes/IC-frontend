// Armazenamento temporário em memória (em produção, usar Redis ou banco de dados)
export const uploadSessions = new Map<string, { imageData?: string; timestamp: number }>();

// Limpar sessões antigas (mais de 10 minutos)
export function cleanOldSessions() {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [sessionId, session] of uploadSessions.entries()) {
    if (session.timestamp < tenMinutesAgo) {
      uploadSessions.delete(sessionId);
    }
  }
}
