import axios from 'axios';

const REQUEST_TIMEOUT = 180000; 
const SIMULATE_DELAY = false; 
const DELAY_TIME = 100000; 

const apiClient = axios.create({
  // baseURL: 'https://ic-backend-3zk0.onrender.com/',
  baseURL: 'http://72.61.33.18:8002/',
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  if (SIMULATE_DELAY) {
    await new Promise(resolve => setTimeout(resolve, DELAY_TIME));
  }

  const { data } = await apiClient.post('/predict', formData);
  return data;
}
