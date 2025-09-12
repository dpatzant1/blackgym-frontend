import { useState, useEffect } from 'react';

/**
 * Hook para aplicar debounce a un valor
 * Útil para búsquedas en tiempo real sin sobrecargar la API
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};