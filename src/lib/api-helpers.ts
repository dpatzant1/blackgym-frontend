import type { ApiError } from '../types/api';

// Función helper para manejar errores de API
export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Error de respuesta del servidor
    return {
      message: error.response.data?.message || error.response.data?.error || 'Error del servidor',
      status: error.response.status,
      code: error.response.data?.code
    };
  } else if (error.request) {
    // Error de red/conexión
    return {
      message: 'No se pudo conectar con el servidor. Verifica tu conexión.',
      code: 'NETWORK_ERROR'
    };
  } else {
    // Error desconocido
    return {
      message: error.message || 'Ha ocurrido un error inesperado',
      code: 'UNKNOWN_ERROR'
    };
  }
};

// Función helper para validar respuestas de API
export const validateApiResponse = <T>(response: any): T => {
  if (!response) {
    throw new Error('Respuesta vacía del servidor');
  }
  
  // Si la respuesta tiene estructura de éxito/error
  if (response.hasOwnProperty('success')) {
    if (!response.success) {
      throw new Error(response.message || response.error || 'Error en la respuesta');
    }
    return response.data;
  }
  
  // Si la respuesta es directa
  return response;
};

// Función helper para formatear parámetros de URL
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
};
