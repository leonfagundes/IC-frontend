"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Camera, Upload, CheckCircle2, X } from "lucide-react";
import Image from "next/image";

function MobileUploadContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Sessão inválida. Por favor, escaneie o QR Code novamente.");
    }

    // Encerrar sessão quando o usuário sai da página
    return () => {
      if (sessionId) {
        fetch("/api/mobile-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session: sessionId,
            action: "close",
          }),
        }).catch(err => console.error("Erro ao encerrar sessão:", err));
      }
    };
  }, [sessionId]);

  const handleFileChange = async (file: File | null) => {
    if (!file || !sessionId) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione uma imagem válida.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result as string;
      setPreview(imageData);

      // Enviar imagem para o servidor
      try {
        const response = await fetch("/api/mobile-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session: sessionId,
            imageData: imageData,
          }),
        });

        if (response.ok) {
          setIsUploaded(true);
          // Resetar após 2 segundos para permitir novo envio
          setTimeout(() => {
            setIsUploaded(false);
          }, 2000);
        } else {
          setError("Erro ao enviar imagem. Tente novamente.");
        }
      } catch (err) {
        setError("Erro ao enviar imagem. Verifique sua conexão.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setIsUploaded(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold">Sessão Inválida</h1>
          <p className="text-muted-foreground">
            Por favor, escaneie o QR Code novamente do seu computador.
          </p>
        </div>
      </div>
    );
  }

  if (isUploaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6">
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Imagem Enviada!</h1>
            <p className="text-muted-foreground">
              A imagem foi enviada com sucesso para o seu computador.
            </p>
          </div>
          {preview && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
              <Image
                src={preview}
                alt="Imagem enviada"
                fill
                className="object-contain"
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>
          )}
          <Button onClick={handleRemove} variant="outline" className="w-full">
            Enviar Outra Imagem
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Enviar Imagem</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Escolha uma foto da galeria ou tire uma nova foto
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {preview ? (
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
                style={{ transform: 'scaleX(-1)' }}
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Enviando para o computador...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full h-16 text-base"
              size="lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              Tirar Foto
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou
                </span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full h-16 text-base"
              size="lg"
            >
              <Upload className="h-5 w-5 mr-2" />
              Escolher da Galeria
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MobileUploadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Carregando...</div>}>
      <MobileUploadContent />
    </Suspense>
  );
}
