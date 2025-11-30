/**
 * Serviço simulado de API de IA para detecção de tumores cerebrais
 * Em produção, isso seria substituído por uma chamada real à API
 */

export interface AIResult {
  predicted_class: string;
  confidence: number;
  processing_time: number;
  timestamp: string;
}

/**
 * Simula o upload e processamento de imagem pela IA
 * @param file - Arquivo de imagem a ser processado
 * @returns Resultado da análise da IA
 */
export async function uploadToAI(file: File): Promise<AIResult> {
  // Simular tempo de processamento (1-3 segundos)
  const processingTime = Math.random() * 2000 + 1000;
  
  await new Promise(resolve => setTimeout(resolve, processingTime));

  // Simular diferentes resultados possíveis
  const possibleResults = [
    { predicted_class: 'glioma', confidence: 0.81 },
    { predicted_class: 'meningioma', confidence: 0.88 },
    { predicted_class: 'notumor', confidence: 0.97 },
    { predicted_class: 'pituitary', confidence: 0.96 },
  ];

  // Escolher um resultado aleatório
  const randomResult = possibleResults[Math.floor(Math.random() * possibleResults.length)];

  return {
    ...randomResult,
    processing_time: Math.round(processingTime),
    timestamp: new Date().toISOString()
  };
}

/**
 * Processa uma imagem e retorna o resultado da análise
 * Wrapper para manter compatibilidade com o código existente
 */
export async function processImage(file: File): Promise<AIResult> {
  return uploadToAI(file);
}
