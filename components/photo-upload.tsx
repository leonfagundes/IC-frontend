"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { uploadImage } from "@/api/upload";
import { ResultModal } from "./result-modal";

export function PhotoUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [prediction, setPrediction] = useState<{ class: string; confidence?: number } | null>(null);
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
      
      // Extrai a classe predita e confiança da resposta
      // Ajuste conforme o formato real da sua API
      const predictedClass = response.predicted_class || response.class || response.prediction;
      const confidence = response.confidence || response.probability;
      
      setPrediction({
        class: predictedClass,
        confidence: confidence
      });
      
    } catch (error) {
      setUploadError(
        error instanceof Error 
          ? error.message 
          : "Erro ao enviar imagem. Tente novamente."
      );
      setShowResultModal(false); // Fecha o modal em caso de erro
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
            relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-colors duration-200
            ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"
            }
          `}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Clique para selecionar ou arraste uma imagem
              </p>
              <p className="text-sm text-muted-foreground">
                PNG ou JPG até 10MB
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

      {/* Botões de ação */}
      {preview && (
        <div className="space-y-3">
          {uploadError && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {uploadError}
            </div>
          )}
          
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleClick}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Escolher outra imagem
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar
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
      />
    </div>
  );
}


