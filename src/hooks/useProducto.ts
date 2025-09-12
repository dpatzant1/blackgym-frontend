import { useState, useEffect } from 'react';
import { getProducto } from '../services/productos';
import type { Producto } from '../types/api';

interface UseProductoReturn {
  producto: Producto | null;
  isLoading: boolean;
  error: string | null;
}

export const useProducto = (id: number): UseProductoReturn => {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getProducto(id);
        setProducto(response);
      } catch (err: any) {
        setError(err.message || 'Error al cargar producto');
        setProducto(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProducto();
    }
  }, [id]);

  return {
    producto,
    isLoading,
    error
  };
};
