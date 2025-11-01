import axios from 'axios';

const REQUEST_TIMEOUT = 120000;

const apiClient = axios.create({
  baseURL: 'https://ic-backend-3zk0.onrender.com/',
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post('/predict', formData);
  return data;
}
