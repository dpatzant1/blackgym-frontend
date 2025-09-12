import apiClient from '../lib/api-client';
import type { Categoria, Producto, PaginatedResponse } from '../types/api';

export interface CategoriasParams {
  page?: number;
  limit?: number;
  includeProducts?: boolean;
}

// Obtener todas las categorías
export const getCategorias = async (params: CategoriasParams = {}): Promise<PaginatedResponse<Categoria>> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.includeProducts) searchParams.append('includeProducts', 'true');

  const url = `/api/categorias?${searchParams.toString()}`;
  const response = await apiClient.get(url);
  return response.data;
};

// Obtener categoría por ID
export const getCategoria = async (id: number): Promise<Categoria> => {
  const response = await apiClient.get(`/api/categorias/${id}`);
  return response.data.data || response.data;
};

// Obtener productos por categoría
export const getProductosPorCategoria = async (categoriaId: number, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Producto>> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const response = await apiClient.get(`/api/categorias/${categoriaId}/productos?${searchParams.toString()}`);
  return response.data;
};
