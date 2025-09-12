import apiClient from '../lib/api-client';
import type { Orden, OrdenCreate, ApiResponse, PaginatedResponse } from '../types/api';

export interface OrdenesParams {
  page?: number;
  limit?: number;
}

// Crear nueva orden
export const createOrden = async (ordenData: OrdenCreate): Promise<Orden> => {
  const response = await apiClient.post('/api/ordenes', ordenData);
  return response.data.data || response.data;
};

// Obtener todas las órdenes
export const getOrdenes = async (params: OrdenesParams = {}): Promise<PaginatedResponse<Orden>> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const response = await apiClient.get(`/api/ordenes?${searchParams.toString()}`);
  return response.data;
};

// Obtener orden por ID
export const getOrden = async (id: number): Promise<Orden> => {
  const response = await apiClient.get(`/api/ordenes/${id}`);
  return response.data.data || response.data;
};

// Obtener estadísticas de órdenes
export const getEstadisticasOrdenes = async (): Promise<ApiResponse> => {
  const response = await apiClient.get('/api/ordenes/stats');
  return response.data;
};
