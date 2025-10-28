// Função para enviar imagem para a API
export async function uploadImage(file: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const API_ENDPOINT = 'http://127.0.0.1:8000/predict';

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao enviar imagem:', error);
    throw error;
  }
}

export async function uploadImageBase64(base64Image: string): Promise<any> {
  try {
    const API_ENDPOINT = 'http://127.0.0.1:8000/predict';

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao enviar imagem:', error);
    throw error;
  }
}
