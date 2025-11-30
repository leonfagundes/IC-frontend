import { NextRequest, NextResponse } from "next/server";
import { uploadSessions, cleanOldSessions } from "@/lib/session-storage";
import { v4 as uuidv4 } from "uuid";

const SESSION_DURATION = 5 * 60 * 1000; // 5 minutos

export async function POST(request: NextRequest) {
  try {
    cleanOldSessions();
    
    const body = await request.json();
    const { desktopSessionId, mobileSessionId, imageData, action } = body;

    // Conectar mobile ao desktop
    if (action === "connect") {
      if (!desktopSessionId) {
        return NextResponse.json(
          { error: "Desktop session ID is required" },
          { status: 400 }
        );
      }

      const now = Date.now();
      const newMobileSessionId = uuidv4();
      
      uploadSessions.set(desktopSessionId, {
        desktopSessionId,
        mobileSessionId: newMobileSessionId,
        timestamp: now,
        expiresAt: now + SESSION_DURATION,
        active: true,
      });

      return NextResponse.json({ 
        success: true, 
        mobileSessionId: newMobileSessionId 
      });
    }

    // Desconectar sessão
    if (action === "disconnect") {
      if (desktopSessionId) {
        uploadSessions.delete(desktopSessionId);
      } else if (mobileSessionId) {
        // Encontrar e remover por mobileSessionId
        for (const [key, session] of uploadSessions.entries()) {
          if (session.mobileSessionId === mobileSessionId) {
            uploadSessions.delete(key);
            break;
          }
        }
      }
      return NextResponse.json({ success: true });
    }

    // Enviar imagem do mobile
    if (action === "upload") {
      if (!mobileSessionId || !imageData) {
        return NextResponse.json(
          { error: "Mobile session ID and image data are required" },
          { status: 400 }
        );
      }

      // Encontrar sessão pelo mobileSessionId
      let targetSession = null;
      let targetKey = null;
      
      for (const [key, session] of uploadSessions.entries()) {
        if (session.mobileSessionId === mobileSessionId) {
          targetSession = session;
          targetKey = key;
          break;
        }
      }

      if (!targetSession || !targetSession.active) {
        return NextResponse.json(
          { error: "Session not found or expired" },
          { status: 404 }
        );
      }

      // Verificar se sessão não expirou
      if (Date.now() > targetSession.expiresAt) {
        uploadSessions.delete(targetKey!);
        return NextResponse.json(
          { error: "Session expired" },
          { status: 410 }
        );
      }

      // Atualizar sessão com a imagem
      const now = Date.now();
      uploadSessions.set(targetKey!, {
        ...targetSession,
        imageData,
        timestamp: now,
        expiresAt: now + SESSION_DURATION, // Renovar tempo
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in mobile-session API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
