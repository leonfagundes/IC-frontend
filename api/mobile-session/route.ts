import { NextRequest, NextResponse } from "next/server";
import { uploadSessions, cleanOldSessions } from "@/lib/session-storage";

export async function POST(request: NextRequest) {
  try {
    cleanOldSessions();
    
    const body = await request.json();
    const { session, imageData } = body;

    if (!session || !imageData) {
      return NextResponse.json(
        { error: "Session ID and image data are required" },
        { status: 400 }
      );
    }

    // Armazenar a imagem na sessão
    uploadSessions.set(session, {
      imageData,
      timestamp: Date.now(),
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
