import { NextRequest, NextResponse } from "next/server";
import { uploadSessions, cleanOldSessions } from "@/lib/session-storage";

export async function GET(request: NextRequest) {
  try {
    cleanOldSessions();
    
    const searchParams = request.nextUrl.searchParams;
    const desktopSessionId = searchParams.get("desktopSessionId");

    if (!desktopSessionId) {
      return NextResponse.json(
        { error: "Desktop session ID is required" },
        { status: 400 }
      );
    }

    const sessionData = uploadSessions.get(desktopSessionId);
    
    if (sessionData?.imageData) {
      const imageData = sessionData.imageData;
      
      // Limpar imageData mas manter sessão ativa
      const now = Date.now();
      uploadSessions.set(desktopSessionId, {
        ...sessionData,
        imageData: undefined,
        timestamp: now,
      });
      
      return NextResponse.json({ 
        imageData,
        hasConnection: !!sessionData.mobileSessionId 
      });
    }

    return NextResponse.json({ 
      imageData: null,
      hasConnection: !!sessionData?.mobileSessionId 
    });
  } catch (error) {
    console.error("Error in check-upload API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
