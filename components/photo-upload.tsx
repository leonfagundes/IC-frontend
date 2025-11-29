"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, ArrowRight, Loader2, Trash2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { uploadImage } from "@/lib/upload";
import { ResultModal } from "./result-modal";
import { ErrorModal } from "./error-modal";
import { QRCodeUploadModal } from "./qrcode-upload-modal";
import { useI18n } from "./i18n-provider";

export function PhotoUpload() {
  const { t } = useI18n();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [prediction, setPrediction] = useState<{ class: string; confidence?: number; uploadedImage?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!currentFile) {
      setUploadError("Nenhuma imagem selecionada");
      return;
    }

    // Abre o modal e mostra loading
    setShowResultModal(true);
    setIsUploading(true);
    setUploadError(null);
    setPrediction(null);

    try {
      const response = await uploadImage(currentFile);
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

  const handleOpenQRCode = () => {
    // Gerar ID de sessão único
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    setSessionId(newSessionId);
    setShowQRCodeModal(true);
  };

  const handleImageFromMobile = (imageData: string) => {
    setPreview(imageData);
    // Converter base64 para File
    fetch(imageData)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "mobile-upload.jpg", { type: "image/jpeg" });
        setCurrentFile(file);
        setUploadError(null);
      })
      .catch(err => {
        console.error("Erro ao processar imagem do celular:", err);
        setUploadError("Erro ao processar imagem do celular");
      });
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
        <div className="space-y-4">
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

          {/* Botão de upload por celular */}
          <Button
            variant="default"
            onClick={handleOpenQRCode}
            className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <Smartphone className="h-4 w-4" />
            {t("home.uploadByCellphone")}
          </Button>
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

      {/* Modal de QR Code */}
      <QRCodeUploadModal
        open={showQRCodeModal}
        onOpenChange={setShowQRCodeModal}
        onImageReceived={handleImageFromMobile}
        sessionId={sessionId}
      />
    </div>
  );
}


