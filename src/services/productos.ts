import apiClient from '../lib/api-client';
import type { Producto, ApiResponse, PaginatedResponse } from '../types/api';

export interface ProductosParams {
  page?: number;
  limit?: number;
  categoria?: number;
  search?: string;
}

// Obtener todos los productos con filtros opcionales
export const getProductos = async (params: ProductosParams = {}): Promise<PaginatedResponse<Producto>> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.categoria) searchParams.append('categoria', params.categoria.toString());
  if (params.search) searchParams.append('search', params.search);

  const response = await apiClient.get(`/api/productos?${searchParams.toString()}`);
  
  // La API devuelve: { success: true, data: { productos: [], pagination: {} } }
  // Necesitamos extraer productos y pagination del objeto data
  const apiData = response.data.data;
  return {
    data: apiData.productos || [],
    pagination: apiData.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
  };
};

// Búsqueda avanzada de productos
export const searchProductos = async (query: string): Promise<Producto[]> => {
  const response = await apiClient.get(`/api/productos/search?q=${encodeURIComponent(query)}`);
  return response.data.data || response.data;
};

// Obtener producto por ID
export const getProducto = async (id: number): Promise<Producto> => {
  const response = await apiClient.get(`/api/productos/${id}`);
  return response.data.data || response.data;
};

// Verificar stock de múltiples productos
export const checkStock = async (productos: { id: number; cantidad: number }[]): Promise<ApiResponse> => {
  const response = await apiClient.post('/api/productos/check-stock', { productos });
  return response.data;
};
