import axios from 'axios';
import { API_CONFIG } from '../config/api';

const api = axios.create({
  baseURL: "http://localhost:3002",
  withCredentials: true,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('unb-events-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('unb-events-token');
      localStorage.removeItem('unb-events-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
