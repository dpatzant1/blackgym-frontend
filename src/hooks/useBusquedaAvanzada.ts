import { useState, useEffect, useMemo } from 'react';
import { buscarProductosPaginados, obtenerSugerencias } from '../services/busqueda';
import { useProductos } from './useProductos';
import type { Producto } from '../types/api';

interface UseBusquedaAvanzadaParams {
  searchTerm: string;
  selectedCategory?: number;
  page?: number;
  limit?: number;
  enableSuggestions?: boolean;
  debounceMs?: number;
}

interface UseBusquedaAvanzadaReturn {
  productos: Producto[];
  sugerencias: Producto[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  hasSearchTerm: boolean;
  searchResultsCount: number;
}

export const useBusquedaAvanzada = (params: UseBusquedaAvanzadaParams): UseBusquedaAvanzadaReturn => {
  const {
    searchTerm,
    selectedCategory,
    page = 1,
    limit = 12,
    enableSuggestions = false,
    debounceMs = 300
  } = params;

  // Estados para búsqueda
  const [searchResults, setSearchResults] = useState<Producto[]>([]);
  const [sugerencias, setSugerencias] = useState<Producto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchPagination, setSearchPagination] = useState<any>(null);

  // Hook original para cuando no hay búsqueda
  const { 
    productos: productosNormales, 
    isLoading: loadingNormal, 
    error: errorNormal,
    pagination: paginationNormal
  } = useProductos({
    categoria: selectedCategory,
    page,
    limit
  });

  // Determinar si hay término de búsqueda válido
  const hasSearchTerm = useMemo(() => {
    return Boolean(searchTerm && searchTerm.trim().length >= 2);
  }, [searchTerm]);

  // Debounce para el término de búsqueda
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Función para realizar búsqueda paginada
  const performSearch = async (term: string, currentPage: number) => {
    if (!term || term.trim().length < 2) {
      setSearchResults([]);
      setSearchPagination(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await buscarProductosPaginados(term, currentPage, limit, true);
      
      let filteredProducts = response.productos;

      // Aplicar filtro de categoría si está seleccionado
      if (selectedCategory) {
        filteredProducts = response.productos.filter(producto =>
          producto.categorias && 
          producto.categorias.some((cat: any) => cat.id === selectedCategory)
        );
      }

      setSearchResults(filteredProducts);
      setSearchPagination(response.pagination);
    } catch (error: any) {
      setSearchError(error.message || 'Error al buscar productos');
      setSearchResults([]);
      setSearchPagination(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Función para obtener sugerencias
  const getSuggestions = async (term: string) => {
    if (!enableSuggestions || !term || term.trim().length < 2) {
      setSugerencias([]);
      return;
    }

    try {
      const suggestions = await obtenerSugerencias(term, 8);
      setSugerencias(suggestions);
    } catch (error) {
      setSugerencias([]);
    }
  };

  // Efecto para búsqueda principal
  useEffect(() => {
    if (hasSearchTerm) {
      performSearch(debouncedSearchTerm, page);
    } else {
      setSearchResults([]);
      setSearchPagination(null);
      setSearchError(null);
    }
  }, [debouncedSearchTerm, page, selectedCategory, limit]);

  // Efecto para sugerencias (más rápido, sin debounce)
  useEffect(() => {
    if (enableSuggestions) {
      getSuggestions(searchTerm);
    }
  }, [searchTerm, enableSuggestions]);

  // Determinar qué datos devolver
  const productos = hasSearchTerm ? searchResults : productosNormales;
  const isLoading = hasSearchTerm ? isSearching : loadingNormal;
  const error = hasSearchTerm ? searchError : errorNormal;
  const pagination = hasSearchTerm ? searchPagination : paginationNormal;

  return {
    productos,
    sugerencias,
    isLoading,
    isSearching,
    error,
    pagination,
    hasSearchTerm,
    searchResultsCount: hasSearchTerm ? searchResults.length : productosNormales.length
  };
};