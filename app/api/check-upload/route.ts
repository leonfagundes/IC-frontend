import { NextRequest, NextResponse } from "next/server";
import { uploadSessions, cleanOldSessions } from "@/lib/session-storage";

export async function GET(request: NextRequest) {
  try {
    cleanOldSessions();
    
    const searchParams = request.nextUrl.searchParams;
    const session = searchParams.get("session");

    if (!session) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const sessionData = uploadSessions.get(session);
    
    if (sessionData?.imageData) {
      const imageData = sessionData.imageData;
      // Limpar a imagem da sessão após recuperá-la
      uploadSessions.delete(session);
      return NextResponse.json({ imageData });
    }

    return NextResponse.json({ imageData: null });
  } catch (error) {
    console.error("Error in check-upload API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
