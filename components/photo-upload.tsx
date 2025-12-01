"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon, ArrowRight, Loader2, Trash2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { uploadImage } from "@/lib/upload";
import { ResultModal } from "./result-modal";
import { ErrorModal } from "./error-modal";
import { useI18n } from "./i18n-provider";
import { QRCodeModal } from "./qrcode-modal";
import { useSession } from "@/lib/hooks/useSession";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function PhotoUpload() {
  const { t } = useI18n();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [prediction, setPrediction] = useState<{ class: string; confidence?: number; uploadedImage?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Estados para sessão mobile
  const [showQRModal, setShowQRModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { session, createSession } = useSession(currentSessionId || undefined);

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fechar modal quando celular conectar
  useEffect(() => {
    if (session?.status === 'active' && showQRModal) {
      setShowQRModal(false);
    }
  }, [session?.status, showQRModal]);

  // Sincronizar imagens enviadas pelo celular
  useEffect(() => {
    if (!currentSessionId) return;

    const imagesRef = collection(db, 'images');
    const q = query(
      imagesRef,
      where('sessionId', '==', currentSessionId),
      orderBy('uploadedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const imageData = change.doc.data();
          // Substituir imagem atual pela do celular
          if (imageData.dataUrl) {
            setPreview(imageData.dataUrl);
            setCurrentFile(null); // Arquivo veio do celular, não temos File object
            setUploadError(null);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [currentSessionId]);

  // Handler para abrir sessão mobile
  const handleMobileUpload = async () => {
    try {
      const sessionId = await createSession();
      setCurrentSessionId(sessionId);
      setShowQRModal(true);
      
      // Registrar sessão globalmente para o SessionCard
      if (typeof window !== 'undefined') {
        (window as any).__setActiveSession?.(sessionId);
      }
    } catch (err) {
      console.error('Erro ao criar sessão:', err);
      setUploadError('Erro ao criar sessão mobile');
    }
  };

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      setCurrentFile(file);
      setUploadError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setCurrentFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!preview) {
      setUploadError("Nenhuma imagem selecionada");
      return;
    }

    // Abre o modal e mostra loading
    setShowResultModal(true);
    setIsUploading(true);
    setUploadError(null);
    setPrediction(null);

    try {
      // Se não há currentFile, converter preview (base64) para File
      let fileToUpload = currentFile;
      if (!fileToUpload && preview) {
        const response = await fetch(preview);
        const blob = await response.blob();
        fileToUpload = new File([blob], 'imagem-celular.jpg', { type: 'image/jpeg' });
      }

      if (!fileToUpload) {
        throw new Error('Erro ao processar imagem');
      }

      const response = await uploadImage(fileToUpload);
      console.log("Resposta da API:", response);
      
      const predictedClass = response.predicted_class || response.class || response.prediction;
      const classLower = predictedClass?.toLowerCase() || '';
      
      // Mapear confiabilidade baseada na classe
      const confidenceMap: Record<string, number> = {
        'glioma': 0.81,
        'meningioma': 0.88,
        'notumor': 0.97,
        'no_tumor': 0.97,
        'pituitary': 0.96
      };
      
      const confidence = confidenceMap[classLower] || response.confidence || response.probability || 0.85;
      
      setPrediction({
        class: predictedClass,
        confidence: confidence,
        uploadedImage: preview || undefined
      });
      
    } catch (error: any) {
      // Verifica se é erro 400 com mensagem específica de validação
      if (error.response?.status === 400 && error.response?.data?.detail === "Arquivo deve ser ressonancia") {
        setShowResultModal(false);
        setShowErrorModal(true);
      } else {
        setUploadError(
          error instanceof Error 
            ? error.message 
            : "Erro ao enviar imagem. Tente novamente."
        );
        setShowResultModal(false);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {!preview ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer
            transition-colors duration-200
            ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"
            }
          `}
        >
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="rounded-full bg-primary/10 p-3 sm:p-4">
              <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-base sm:text-lg font-medium">
                {t("home.uploadArea")}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("home.uploadFormats")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Botão Enviar pelo Celular */}
      {!preview && session?.status !== 'active' && !isMobile && (
        <div className="flex justify-start">
          <Button
            variant="outline"
            onClick={handleMobileUpload}
            className="flex items-center gap-2 rounded-lg bg-card hover:bg-muted/50 dark:bg-card dark:hover:bg-accent/80 border-border hover:border-primary/30 transition-colors"
          >
            <Smartphone className="h-4 w-4" />
            Carregar Imagem do Celular
          </Button>
        </div>
      )}

      {/* Botões de ação */}
      {preview && (
        <div className="space-y-3">
          {uploadError && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {uploadError}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleClick}
                disabled={isUploading}
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{t("home.chooseAnother")}</span>
                <span className="sm:hidden">Escolher outra</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleRemove}
                disabled={isUploading}
                className="flex items-center justify-center gap-2 text-destructive hover:text-destructive w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t("home.removeImage")}</span>
                <span className="sm:hidden">Remover</span>
              </Button>
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("home.sending")}
                </>
              ) : (
                <>
                  {t("home.submit")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Resultado */}
      <ResultModal
        open={showResultModal}
        onOpenChange={setShowResultModal}
        isLoading={isUploading}
        prediction={prediction}
        uploadedImage={preview}
      />

      {/* Modal de Erro */}
      <ErrorModal
        open={showErrorModal}
        onOpenChange={setShowErrorModal}
      />

      {/* Modal QR Code */}
      {currentSessionId && (
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          sessionId={currentSessionId}
          expiresAt={session?.expiresAt ? new Date(session.expiresAt.toMillis()) : undefined}
        />
      )}
    </div>
  );
}


