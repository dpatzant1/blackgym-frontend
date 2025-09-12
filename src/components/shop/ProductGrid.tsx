import React from 'react';
import ProductCard from './ProductCard';
import type { Producto } from '../../types/api';

interface ProductGridProps {
  productos: Producto[];
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  productos, 
  isLoading = false, 
  error,
  emptyMessage = "No se encontraron productos"
}) => {
  // Mostrar error si existe
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h3 className="text-xl font-bold text-white mb-2">Error al cargar productos</h3>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-green-500 hover:bg-green-400 text-black font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // Mostrar skeleton loaders mientras carga
  if (isLoading) {
    return (
      <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCard key={index} producto={{} as Producto} isLoading={true} />
        ))}
      </div>
    );
  }

  // Mostrar mensaje de vacío si no hay productos
  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <i className="fas fa-box-open text-gray-500 text-4xl mb-4"></i>
          <h3 className="text-xl font-bold text-white mb-2">{emptyMessage}</h3>
          <p className="text-gray-400">Intenta ajustar tus filtros o vuelve más tarde.</p>
        </div>
      </div>
    );
  }

  // Mostrar grid de productos
  return (
    <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
};

export default ProductGrid;
