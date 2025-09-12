import { useState, useEffect } from 'react';
import { getProductos } from '../services/productos';
import { mockProductosService } from '../services/mockServices';
import type { Producto, PaginatedResponse } from '../types/api';

interface UseProductosParams {
  categoria?: number | string; // Permitir filtrar por ID o nombre
  search?: string;
  limit?: number;
  page?: number;
  useMockData?: boolean; // Por defecto usará API real (false)
}

interface UseProductosReturn {
  productos: Producto[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  refetch: () => void;
}

export const useProductos = (params: UseProductosParams = {}): UseProductosReturn => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseProductosReturn['pagination']>(null);

  const fetchProductos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let response: PaginatedResponse<Producto>;
      
      // Priorizar API real, fallback a mock solo si falla
      if (params.useMockData === true) {
        // Solo usar mock si explícitamente se solicita
        response = await mockProductosService.getProductos({
          categoria: params.categoria,
          search: params.search,
          limit: params.limit || 12,
          page: params.page || 1
        });
      } else {
        // Intentar API real primero
        try {
          console.log('🚀 Intentando conectar con API real...');
          response = await getProductos({
            categoria: typeof params.categoria === 'string' ? undefined : params.categoria,
            search: params.search,
            limit: params.limit || 12,
            page: params.page || 1
          });
          console.log('✅ API real conectada exitosamente');
        } catch (apiError) {
          console.warn('⚠️ API no disponible, usando datos mock como fallback:', apiError);
          response = await mockProductosService.getProductos({
            categoria: params.categoria,
            search: params.search,
            limit: params.limit || 12,
            page: params.page || 1
          });
        }
      }

      // Manejar respuesta
      if (response.data) {
        setProductos(response.data);
        if (response.pagination) {
          const pagination = response.pagination;
          setPagination({
            ...pagination,
            hasNext: pagination.hasNext ?? pagination.page < pagination.totalPages,
            hasPrev: pagination.hasPrev ?? pagination.page > 1
          });
        }
      } else if (Array.isArray(response)) {
        // Si la respuesta es directamente un array
        setProductos(response);
      }
      
    } catch (err: any) {
      console.error('Error fetching productos:', err);
      setError(err.message || 'Error al cargar productos');
      setProductos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [params.categoria, params.search, params.limit, params.page]);

  return {
    productos,
    isLoading,
    error,
    pagination,
    refetch: fetchProductos
  };
};
