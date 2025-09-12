import React, { useState, useEffect, useRef } from 'react';
import { obtenerSugerencias } from '../../services/busqueda';
import type { Producto } from '../../types/api';

interface SearchSuggestionsProps {
  searchTerm: string;
  onSelectSuggestion: (producto: Producto) => void;
  onSelectSearchTerm: (term: string) => void;
  isVisible: boolean;
  className?: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  searchTerm,
  onSelectSuggestion,
  onSelectSearchTerm,
  isVisible,
  className = ''
}) => {
  const [sugerencias, setSugerencias] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Si no hay término de búsqueda o es muy corto, limpiar sugerencias
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSugerencias([]);
      setIsLoading(false);
      return;
    }

    // Debounce para evitar demasiadas llamadas
    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const productos = await obtenerSugerencias(searchTerm, 6);
        setSugerencias(productos);
      } catch (error) {
        console.error('Error obteniendo sugerencias:', error);
        setSugerencias([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm]);

  if (!isVisible || (!isLoading && sugerencias.length === 0)) {
    return null;
  }

  return (
    <div className={`absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 max-h-96 overflow-y-auto ${className}`}>
      {isLoading ? (
        <div className="p-4 text-center">
          <i className="fas fa-spinner fa-spin text-green-500 mr-2"></i>
          <span className="text-gray-300">Buscando sugerencias...</span>
        </div>
      ) : (
        <>
          {/* Opción para buscar el término completo */}
          <button
            onClick={() => onSelectSearchTerm(searchTerm)}
            className="w-full p-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <i className="fas fa-search text-green-500"></i>
              <span className="text-white">
                Buscar "{searchTerm}"
              </span>
            </div>
          </button>

          {/* Lista de productos sugeridos */}
          {sugerencias.map((producto) => (
            <button
              key={producto.id}
              onClick={() => onSelectSuggestion(producto)}
              className="w-full p-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-10 h-10 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/equipos-gimnasio-profesionales.webp';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {producto.nombre}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    Q {producto.precio.toFixed(2)}
                    {producto.categoria && (
                      <span className="ml-2">• {producto.categoria}</span>
                    )}
                  </p>
                </div>
                <i className="fas fa-arrow-right text-gray-500 text-xs"></i>
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  );
};

export default SearchSuggestions;