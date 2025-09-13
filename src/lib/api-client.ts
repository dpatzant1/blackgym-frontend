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

    //Descomentar para producción
    runtimeBase = host.startsWith('api.') ? `${window.location.protocol}//${host}` : `${window.location.protocol}//api.${host}`
    
    //Comentar para producción
    //runtimeBase =  `http://localhost:3000/`;
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
// No logs in production: baseURL resolution is silent here.

// Interceptor para requests
apiClient.interceptors.request.use(
    (config) => {
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
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
