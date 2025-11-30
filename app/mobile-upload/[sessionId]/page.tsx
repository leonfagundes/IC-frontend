"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Upload, CheckCircle2, AlertCircle, Loader2, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/hooks/useSession';
import { uploadToAI } from '@/lib/services/ai-service';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function MobileUploadPage() {
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const router = useRouter();
  const { session, loading, error, connectMobile, closeSession } = useSession(sessionId);
  
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showClosedModal, setShowClosedModal] = useState(false);

  // Conectar ao mobile quando a página carregar
  useEffect(() => {
    if (sessionId && !session) {
      connectMobile(sessionId).catch((err) => {
        console.error('Erro ao conectar mobile:', err);
      });
    }
  }, [sessionId, session, connectMobile]);

  // Monitorar status da sessão
  useEffect(() => {
    if (session?.status === 'closed' || session?.status === 'expired') {
      setShowClosedModal(true);
    }
  }, [session?.status]);

  // Handler de upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!session || session.status !== 'active') {
      alert('Sessão não está ativa');
      return;
    }

    setUploading(true);

    try {
      const files = Array.from(e.target.files);
      
      for (const file of files) {
        // Converter para base64
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Salvar no Firestore para sincronizar com desktop
        await addDoc(collection(db, 'images'), {
          sessionId,
          filename: file.name,
          dataUrl,
          uploadedAt: serverTimestamp(),
          processed: false
        });

        // Simular upload para API de IA (opcional)
        await uploadToAI(file);
        setUploadedFiles(prev => [...prev, file.name]);
      }
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      alert('Erro ao enviar imagem');
    } finally {
      setUploading(false);
      // Limpar input
      e.target.value = '';
    }
  };

  // Encerrar sessão pelo mobile
  const handleEndSession = async () => {
    if (!sessionId) return;
    try {
      await closeSession(sessionId);
      setShowClosedModal(true);
    } catch (err) {
      console.error('Erro ao encerrar sessão:', err);
    }
  };

  // Redirecionar para home após fechar modal
  const handleModalClose = () => {
    setShowClosedModal(false);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Conectando...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="p-6 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro</h2>
          <p className="text-muted-foreground mb-4">
            {error || 'Sessão não encontrada'}
          </p>
          <Button onClick={() => router.push('/')}>
            Ir para Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Smartphone className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Upload Mobile</h1>
            <p className="text-muted-foreground">
              Envie suas imagens de ressonância magnética
            </p>
          </div>

          {/* Status Card */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Status da Sessão</h3>
                <p className="text-sm text-muted-foreground">
                  {session.status === 'active' ? '✓ Conectado' : 'Aguardando...'}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleEndSession}
                disabled={session.status !== 'active'}
              >
                Encerrar Sessão
              </Button>
            </div>
          </Card>

          {/* Upload Area */}
          <Card className="p-8">
            <div className="text-center mb-6">
              <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">
                Selecione suas imagens
              </h2>
              <p className="text-sm text-muted-foreground">
                Você pode enviar várias imagens ou tirar uma foto
              </p>
            </div>

            <div className="space-y-3">
              {/* Botão Selecionar da Galeria */}
              <label className="block">
                <div className="w-full py-4 px-6 rounded-lg border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Selecionar da Galeria
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={uploading || session.status !== 'active'}
                  className="hidden"
                />
              </label>

              {/* Botão Tirar Foto */}
              <label className="block">
                <div className="w-full py-4 px-6 rounded-lg border-2 border-green-600 bg-green-600 text-white hover:bg-green-700 font-semibold text-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Tirar Foto
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  disabled={uploading || session.status !== 'active'}
                  className="hidden"
                />
              </label>
            </div>

            {uploading && (
              <div className="mt-4 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground mt-2">Enviando...</p>
              </div>
            )}
          </Card>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <Card className="p-6 mt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Imagens Enviadas ({uploadedFiles.length})
              </h3>
              <ul className="space-y-2">
                {uploadedFiles.map((filename, index) => (
                  <li
                    key={index}
                    className="text-sm bg-muted p-3 rounded flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="truncate">{filename}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Sessão Encerrada */}
      <Dialog open={showClosedModal} onOpenChange={handleModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sessão Encerrada</DialogTitle>
            <DialogDescription>
              A sessão de upload mobile foi {session.status === 'expired' ? 'expirada' : 'encerrada'}.
              Você será redirecionado para a página inicial.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleModalClose}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
