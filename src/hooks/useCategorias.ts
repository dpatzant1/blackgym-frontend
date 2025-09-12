import { useState, useEffect } from 'react';
import { getCategorias } from '../services/categorias';
import type { Categoria } from '../types/api';
import apiURL from '../lib/api-url';

interface UseCategoriasReturn {
  categorias: Categoria[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCategorias = (): UseCategoriasReturn => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Test directo con fetch antes del servicio (usando helper para evitar undefinedapi)
      try {
        const testResponse = await fetch(apiURL('api/categorias'));
        await testResponse.json();
      } catch (e) {
        // silencioso: test fallback
      }
      
      const response = await getCategorias({ limit: 50 });
      
      if (response.data) {
        setCategorias(response.data);
      } else if (Array.isArray(response)) {
        setCategorias(response);
      }
      
    } catch (err: any) {
  // Error manejado arriba (silencioso en producción)
      setError(err.message || 'Error al cargar categorías');
      setCategorias([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    categorias,
    isLoading,
    error,
    refetch: fetchCategorias
  };
};
