import apiClient from '../lib/api-client';
import type { Producto } from '../types/api';

// Interfaces para los parámetros de búsqueda
export interface BusquedaBasicaParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface BusquedaGlobalParams {
  q: string;
  max?: number; // máximo 100, default 50
}

export interface BusquedaAvanzadaParams {
  q: string;
  page?: number;
  limit?: number;
}

// Interfaces para las respuestas
export interface BusquedaResponse {
  success: boolean;
  message: string;
  productos: Producto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  searchTerm: string;
}

export interface BusquedaGlobalResponse {
  success: boolean;
  message: string;
  productos: Producto[];
  total: number;
  searchTerm: string;
  maxResults: number;
}

/**
 * Búsqueda básica con paginación
 * Busca en nombre y descripción
 */
export const busquedaBasica = async (params: BusquedaBasicaParams): Promise<BusquedaResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.append('q', params.q);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const response = await apiClient.get(`/api/productos/search?${searchParams.toString()}`);
  return response.data;
};

/**
 * Búsqueda global sin paginación
 * Perfecta para autocompletado y sugerencias
 */
export const busquedaGlobal = async (params: BusquedaGlobalParams): Promise<BusquedaGlobalResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.append('q', params.q);
  if (params.max) searchParams.append('max', params.max.toString());

  const response = await apiClient.get(`/api/productos/search/global?${searchParams.toString()}`);
  return response.data;
};

/**
 * Búsqueda avanzada con paginación
 * Busca en nombre, descripción Y categorías
 */
export const busquedaAvanzada = async (params: BusquedaAvanzadaParams): Promise<BusquedaResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.append('q', params.q);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const response = await apiClient.get(`/api/productos/search/advanced?${searchParams.toString()}`);
  return response.data;
};

/**
 * Función de conveniencia para obtener sugerencias rápidas
 * Ideal para autocompletado
 */
export const obtenerSugerencias = async (termino: string, maxResultados: number = 10): Promise<Producto[]> => {
  if (!termino || termino.trim().length < 2) {
    return [];
  }

  try {
    const response = await busquedaGlobal({
      q: termino.trim(),
      max: maxResultados
    });
    return response.productos;
  } catch (error) {
    console.error('Error obteniendo sugerencias:', error);
    return [];
  }
};

/**
 * Función para búsqueda con resultados paginados
 * Ideal para página de resultados
 */
export const buscarProductosPaginados = async (
  termino: string, 
  pagina: number = 1, 
  limite: number = 12,
  avanzada: boolean = true
): Promise<BusquedaResponse> => {
  if (!termino || termino.trim().length < 2) {
    throw new Error('El término de búsqueda debe tener al menos 2 caracteres');
  }

  const params = {
    q: termino.trim(),
    page: pagina,
    limit: limite
  };

  // Usar búsqueda avanzada por defecto (incluye categorías)
  return avanzada ? busquedaAvanzada(params) : busquedaBasica(params);
};