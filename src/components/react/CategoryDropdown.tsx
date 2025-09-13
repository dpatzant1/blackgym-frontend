import React, { useState, useRef, useEffect } from 'react';
import { useCategorias } from '../../hooks/useCategorias';
import type { Categoria } from '../../types/api';

interface CategoryDropdownProps {
  onCategorySelect?: (categoria: Categoria | null) => void;
  selectedCategory?: Categoria | null;
  categories?: (Categoria & { count?: number })[];
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ 
  onCategorySelect, 
  selectedCategory,
  categories: propCategories 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { categorias: hookCategorias, isLoading } = useCategorias();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Usar categorías del prop o del hook
  const categorias = propCategories || hookCategorias;

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (categoria: Categoria) => {
    onCategorySelect?.(categoria);
    setIsOpen(false);
  };

  const handleShowAll = () => {
    onCategorySelect?.(null);
    setIsOpen(false);
  };

  // Simular categorías basadas en las imágenes que me mostraste
  const mockCategorias = [
    { 
      id: 1, 
      nombre: 'Proteínas', 
      descripcion: 'Suplementos proteínicos para desarrollo muscular',
      imagen_url: '/suplementos-deportivos-proteinas-aminoacidos.webp'
    },
    { 
      id: 2, 
      nombre: 'Nutrición Vida Activa', 
      descripcion: 'Suplementos para estilo de vida saludable',
      imagen_url: '/suplementos-deportivos-proteinas-aminoacidos.webp'
    },
    { 
      id: 3, 
      nombre: 'Pérdida y Control de Peso', 
      descripcion: 'Productos para manejo de peso corporal',
      imagen_url: '/suplementos-deportivos-proteinas-aminoacidos.webp'
    },
    { 
      id: 4, 
      nombre: 'Vitaminas y Salud', 
      descripcion: 'Suplementos vitamínicos y de salud',
      imagen_url: '/suplementos-deportivos-proteinas-aminoacidos.webp'
    },
    { 
      id: 5, 
      nombre: 'Belleza y Bienestar', 
      descripcion: 'Productos para belleza y bienestar integral',
      imagen_url: '/accesorios-entrenamiento-ropa-deportiva.webp'
    },
    { 
      id: 6, 
      nombre: 'Productos Herbales', 
      descripcion: 'Suplementos naturales y herbales',
      imagen_url: '/suplementos-deportivos-proteinas-aminoacidos.webp'
    },
    { 
      id: 7, 
      nombre: 'Niños y Adolescentes', 
      descripcion: 'Productos especializados para jóvenes',
      imagen_url: '/suplementos-deportivos-proteinas-aminoacidos.webp'
    },
    { 
      id: 8, 
      nombre: 'Snacks', 
      descripcion: 'Snacks y barras nutritivas',
      imagen_url: '/suplementos-deportivos-proteinas-aminoacidos.webp'
    },
    { 
      id: 9, 
      nombre: 'Enzimas y Digestión', 
      descripcion: 'Productos para salud digestiva',
      imagen_url: '/suplementos-deportivos-proteinas-aminoacidos.webp'
    },
    { 
      id: 10, 
      nombre: 'Accesorios', 
      descripcion: 'Accesorios para entrenamiento',
      imagen_url: '/accesorios-entrenamiento-ropa-deportiva.webp'
    }
  ];

  // Usar categorías desde la API (priorizando API sobre mock)
  // console.log('🏷️ CategoryDropdown - Categorías desde API:', categorias.length, categorias);
  const categoriasToShow = categorias;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg transition-all duration-300 border border-gray-700 hover:border-green-500/50 group min-w-[200px] justify-between"
      >
        <div className="flex items-center space-x-2">
          <i className="fas fa-list text-green-500 group-hover:text-green-400"></i>
          <span className="font-medium">
            {selectedCategory ? selectedCategory.nombre : 'Categorías'}
          </span>
        </div>
        <i className={`fas fa-chevron-down transition-transform duration-200 text-sm ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 w-80 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 z-50 max-h-96 overflow-y-auto
                     [&::-webkit-scrollbar]:w-2
                     [&::-webkit-scrollbar-track]:bg-gray-700
                     [&::-webkit-scrollbar-track]:rounded
                     [&::-webkit-scrollbar-thumb]:bg-green-500
                     [&::-webkit-scrollbar-thumb]:rounded
                     [&::-webkit-scrollbar-thumb:hover]:bg-green-400"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(16, 185, 129, 0.2) rgba(55, 65, 81, 0)',
          }}
          onMouseLeave={() => setIsOpen(false)}
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Cargando categorías...
            </div>
          ) : (
            <div className="py-2">
              {/* Opción "Todas las categorías" */}
              <button
                onClick={handleShowAll}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 transition-colors duration-200 text-left group"
              >
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-th text-black text-sm"></i>
                </div>
                <div>
                  <div className="text-white font-medium group-hover:text-green-500">
                    Todas las categorías
                  </div>
                  <div className="text-gray-400 text-xs">
                    Ver todos los productos
                  </div>
                </div>
                <i className="fas fa-chevron-right text-gray-500 ml-auto"></i>
              </button>

              <div className="border-t border-gray-700 my-2"></div>

              {/* Lista de categorías */}
              {categoriasToShow.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => handleCategoryClick(categoria)}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 transition-colors duration-200 text-left group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-400 rounded flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-tag text-black text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium group-hover:text-green-500 truncate">
                      {categoria.nombre}
                    </div>
                    <div className="text-gray-400 text-xs truncate">
                      {categoria.descripcion}
                    </div>
                  </div>
                  <i className="fas fa-chevron-right text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
