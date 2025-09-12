import React, { useState, useEffect } from 'react';
import ProductGrid from '../shop/ProductGrid';
import CategoryDropdown from './CategoryDropdown';
import { getProductos } from '../../services/productos';
import { useInicializarInventario } from '../../hooks/useInventario';
import type { Categoria, Producto } from '../../types/api';

const TiendaPage: React.FC = () => {
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch directo de categorías (manteniendo la implementación existente)
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasLoading, setCategoriasLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/categorias`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.categorias) {
          setCategorias(data.data.categorias);
        }
      } catch (error) {
        console.error('Error obteniendo categorías:', error);
      } finally {
        setCategoriasLoading(false);
      }
    };
    
    fetchCategorias();
  }, []);

  // Buscar el ID de la categoría seleccionada por nombre
  const selectedCategoryId = selectedCategoryName 
    ? categorias.find(cat => cat.nombre === selectedCategoryName)?.id 
    : undefined;


  // Estado para todos los productos cargados
  const [todosLosProductos, setTodosLosProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los productos al inicio o cuando cambia la categoría
  useEffect(() => {
    const cargarProductos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params: any = { page: 1, limit: 200 };
        if (selectedCategoryId) params.categoria = selectedCategoryId;
        const response = await getProductos(params);
        setTodosLosProductos(response.data);
      } catch (err: any) {
        setError('Error al cargar productos');
        setTodosLosProductos([]);
      } finally {
        setIsLoading(false);
      }
    };
    cargarProductos();
  }, [selectedCategoryId]);

  // Filtrado inteligente por texto y categoría
  const productosFiltrados = React.useMemo(() => {
    let filtrados = [...todosLosProductos];
    if (searchTerm.trim()) {
      const termino = searchTerm.trim().toLowerCase();
      filtrados = filtrados.filter(producto =>
        producto.nombre.toLowerCase().includes(termino) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(termino))
      );
    }
    // Filtro por categoría (si la API no lo filtra)
    if (selectedCategoryId) {
      filtrados = filtrados.filter(producto => {
        if (producto.categorias) {
          return producto.categorias.some((cat: any) => cat.id === selectedCategoryId);
        }
        // Fallback para legacy
        return producto.categoria && producto.categoria === selectedCategoryName;
      });
    }
    return filtrados;
  }, [todosLosProductos, searchTerm, selectedCategoryId, selectedCategoryName]);

  // Paginación local
  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(productosFiltrados.length / itemsPerPage));
  const paginados = productosFiltrados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const pagination = {
    page: currentPage,
    limit: itemsPerPage,
    total: productosFiltrados.length,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
  const hasSearchTerm = !!searchTerm.trim();
  const searchResultsCount = productosFiltrados.length;

  // Inicializar inventario con productos paginados
  useInicializarInventario(paginados);

  // Inicializar inventario con productos paginados
  useInicializarInventario(paginados);

  // Manejar selección de categoría
  const handleCategorySelect = (categoria: Categoria | null) => {
    setSelectedCategoryName(categoria ? categoria.nombre : '');
    setCurrentPage(1);
    // No limpiar searchTerm para mantener búsqueda con nueva categoría
  };

  // Manejar cambio en búsqueda
  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategoryName('');
    setCurrentPage(1);
  };

  // Contar productos por categoría (manteniendo implementación existente)
  const [conteoCategoria, setConteoCategoria] = useState<(Categoria & { count: number })[]>([]);
  
  useEffect(() => {
    const contarProductosPorCategoria = async () => {
      if (categorias.length === 0) return;
      
      const categoriasConConteo = await Promise.all(
        categorias.map(async (cat) => {
          try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/productos?categoria=${cat.id}&limit=1`);
            const data = await response.json();
            return {
              ...cat,
              count: data.data?.pagination?.total || 0
            };
          } catch (error) {
            console.error(`Error contando productos para categoría ${cat.nombre}:`, error);
            return {
              ...cat,
              count: 0
            };
          }
        })
      );
      
      setConteoCategoria(categoriasConConteo);
    };
    
    contarProductosPorCategoria();
  }, [categorias]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            NUESTRA <span className="text-green-500">TIENDA</span>
          </h1>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explora nuestra amplia selección de productos fitness de calidad profesional
          </p>
        </div>

        {/* Filtros y controles */}
        <div className="mb-8">
          <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              
              {/* Selector de categorías */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoría
                </label>
                <CategoryDropdown 
                  onCategorySelect={handleCategorySelect}
                  categories={conteoCategoria}
                  selectedCategory={selectedCategoryName ? categorias.find(cat => cat.nombre === selectedCategoryName) || null : null}
                />
              </div>

              {/* Barra de búsqueda */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Búsqueda global
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar en toda la tienda..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 pr-10 focus:border-green-500 focus:outline-none transition-colors duration-200"
                  />
                  <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                {hasSearchTerm && (
                  <p className="text-xs text-green-400 mt-1">
                    <i className="fas fa-globe mr-1"></i>
                    Búsqueda global activa
                  </p>
                )}
              </div>

              {/* El selector de vista ha sido eliminado */}

              {/* Información de resultados */}
              <div className="text-center md:text-right">
                <p className="text-gray-300 text-sm">
                  {isLoading ? (
                    <span>
                      <i className="fas fa-spinner fa-spin mr-1"></i>
                      {hasSearchTerm ? 'Buscando...' : 'Cargando...'}
                    </span>
                  ) : (
                    <>
                      {hasSearchTerm ? (
                        <>
                          <i className="fas fa-search mr-1 text-green-500"></i>
                          {searchResultsCount} resultado{searchResultsCount !== 1 ? 's' : ''} para "{searchTerm}"
                          {selectedCategoryName && (
                            <> en <strong className="text-green-500">{selectedCategoryName}</strong></>
                          )}
                        </>
                      ) : selectedCategoryName ? (
                        <>Mostrando {paginados.length} productos de <strong className="text-green-500">{selectedCategoryName}</strong></>
                      ) : (
                        <>Mostrando {paginados.length} productos</>
                      )}
                    </>
                  )}
                </p>
                {(selectedCategoryName || hasSearchTerm) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-green-500 hover:text-green-400 text-sm font-medium mt-1 transition-colors duration-200"
                  >
                    <i className="fas fa-times mr-1"></i>
                    Limpiar {hasSearchTerm && selectedCategoryName ? 'filtros' : hasSearchTerm ? 'búsqueda' : 'filtro'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="mb-8">
          <ProductGrid 
            productos={paginados}
            isLoading={isLoading}
            error={error || undefined}
            emptyMessage={
              hasSearchTerm && selectedCategoryName
                ? `No se encontraron productos para "${searchTerm}" en la categoría "${selectedCategoryName}"`
                : hasSearchTerm 
                ? `No se encontraron productos para "${searchTerm}"`
                : selectedCategoryName 
                ? `No se encontraron productos en la categoría "${selectedCategoryName}"`
                : "No hay productos disponibles"
            }
          />
        </div>

        {/* Paginación (placeholder para futuras implementaciones) */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <i className="fas fa-chevron-left mr-2"></i>
              Anterior
            </button>
            
            <span className="text-gray-300 px-4">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={!pagination.hasNext}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Siguiente
              <i className="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-xl p-8 border border-green-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-gray-300 mb-6">
              Contáctanos directamente y te ayudaremos a encontrar el producto perfecto para ti
            </p>
            <a
              href="https://wa.me/50250509724?text=Hola%2C%20me%20interesa%20conocer%20más%20sobre%20los%20productos%20de%20BLACK%20GYM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-400 text-black font-bold px-8 py-3 rounded-lg hover:from-green-400 hover:to-green-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <i className="fab fa-whatsapp text-xl"></i>
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiendaPage;
