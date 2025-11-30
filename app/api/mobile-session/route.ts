import { NextRequest, NextResponse } from "next/server";
import { uploadSessions, cleanOldSessions } from "@/lib/session-storage";

export async function POST(request: NextRequest) {
  try {
    cleanOldSessions();
    
    const body = await request.json();
    const { session, imageData, action } = body;

    if (!session) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Ativar sessão
    if (action === "activate") {
      uploadSessions.set(session, {
        timestamp: Date.now(),
        active: true,
      });
      return NextResponse.json({ success: true });
    }

    // Encerrar sessão
    if (action === "close") {
      uploadSessions.delete(session);
      return NextResponse.json({ success: true });
    }

    // Enviar imagem
    if (!imageData) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    // Verificar se a sessão existe e está ativa
    const existingSession = uploadSessions.get(session);
    if (!existingSession || !existingSession.active) {
      return NextResponse.json(
        { error: "Session not found or inactive" },
        { status: 404 }
      );
    }

    // Armazenar a imagem na sessão
    uploadSessions.set(session, {
      imageData,
      timestamp: Date.now(),
      active: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in mobile-session API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
