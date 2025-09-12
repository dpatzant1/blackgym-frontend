import axios from 'axios';

// Determinar baseURL de forma robusta:
// - preferir la variable inyectada por Vite en build: import.meta.env.VITE_API_URL
// - si no existe, permitir un override en runtime mediante window.__ENV?.VITE_API_URL
// - si tampoco existe, intentar inferir api.<host> (p.ej. api.blackgym.fit) como último recurso
// - si todo falla, dejar undefined para usar rutas relativas
const buildEnvBase = import.meta.env.VITE_API_URL;
let runtimeBase: string | undefined = undefined;

if (buildEnvBase) {
  runtimeBase = String(buildEnvBase).replace(/\/+$/, ''); // quitar slash final
}

// Si estamos en cliente, buscar un override runtime (puede ser inyectado por un pequeño script)
if (!runtimeBase && typeof window !== 'undefined') {
  try {
    const winAny = window as any;
    if (winAny.__ENV__ && winAny.__ENV__.VITE_API_URL) {
      runtimeBase = String(winAny.__ENV__.VITE_API_URL).replace(/\/+$/, '');
    }
  } catch (e) {
    // ignore
  }
}

// Intentar inferir api.<host> si no hay otra opción y estamos en navegador
if (!runtimeBase && typeof window !== 'undefined') {
  try {
    const host = window.location.hostname.replace(/^www\./, '');
    // No añadir doble subdominio si ya viene con api.
    runtimeBase = host.startsWith('api.') ? `${window.location.protocol}//${host}` : `${window.location.protocol}//api.${host}`;
  } catch (e) {
    // ignore
  }
}

const timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

// Configuración del cliente HTTP para la API
const apiClient = axios.create({
  baseURL: runtimeBase || undefined,
  timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug: mostrar la baseURL que se está usando en tiempo de ejecución (proporcionar detalles)
try {
  // eslint-disable-next-line no-console
  if (runtimeBase) {
    console.log('🔧 api-client baseURL (resolved):', runtimeBase);
  } else {
    console.log('🔧 api-client baseURL: (no baseURL resolvable) — usando rutas relativas (ej: /api/...)');
  }
} catch (e) {
  /* ignore in environments that restrict console */
}

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
