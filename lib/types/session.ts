import { Timestamp } from 'firebase/firestore';

export type SessionStatus = 'pending' | 'active' | 'closed' | 'expired';

export interface Session {
  id?: string;
  status: SessionStatus;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  desktopConnected: boolean;
  mobileConnected: boolean;
  lastUpdateAt: Timestamp;
}

export interface UploadedImage {
  id: string;
  sessionId: string;
  filename: string;
  uploadedAt: Timestamp;
  processedByAI?: boolean;
  aiResult?: {
    hasTumor: boolean;
    confidence: number;
    tumorType?: string;
  };
}
