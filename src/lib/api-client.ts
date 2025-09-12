import axios from 'axios';

// Configuración del cliente HTTP para la API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    
    // Manejo de errores específicos
    if (error.response?.status === 404) {
      console.error('🔍 Recurso no encontrado');
    } else if (error.response?.status >= 500) {
      console.error('🚨 Error del servidor');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 No se puede conectar con el servidor');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
