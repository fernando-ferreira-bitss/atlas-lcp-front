import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Função auxiliar para garantir que a URL sempre tenha protocolo
const getApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

  // Se a URL não tiver protocolo, adiciona https://
  if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    return `https://${baseUrl}`;
  }

  return baseUrl;
};

// Configuração base do cliente Axios
export const apiClient = axios.create({
  baseURL: `${getApiBaseUrl()}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar trailing slash automaticamente
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Adiciona trailing slash se não existir (exceto URLs com query params ou hash)
    if (config.url && !config.url.endsWith('/') && !config.url.includes('?') && !config.url.includes('#')) {
      config.url = `${config.url}/`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Request interceptor - adiciona token de autenticação
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor - trata erros globalmente
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    // Logout em caso de não autorizado
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Log de erros em desenvolvimento
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);
