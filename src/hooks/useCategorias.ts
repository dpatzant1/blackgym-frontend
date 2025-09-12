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
      
      console.log('🔍 useCategorias - Iniciando fetch de categorías...');
      
      // Test directo con fetch antes del servicio (usando helper para evitar undefinedapi)
      try {
        const testResponse = await fetch(apiURL('api/categorias'));
        const testData = await testResponse.json();
        console.log('🧪 useCategorias - Test fetch directo:', testData);
      } catch (e) {
        console.warn('🧪 useCategorias - Test fetch directo falló:', e);
      }
      
      const response = await getCategorias({ limit: 50 });
      console.log('📥 useCategorias - Respuesta recibida:', response);
      
      if (response.data) {
        console.log('✅ useCategorias - Categorías desde response.data:', response.data);
        setCategorias(response.data);
      } else if (Array.isArray(response)) {
        console.log('✅ useCategorias - Categorías desde array directo:', response);
        setCategorias(response);
      }
      
    } catch (err: any) {
      console.error('❌ useCategorias - Error fetching categorias:', err);
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
