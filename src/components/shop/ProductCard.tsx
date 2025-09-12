import React, { useState } from 'react';
import type { Producto } from '../../types/api';
import { useCart } from '../../stores/cartStore';
import ProductPreviewModal from './ProductPreviewModal';

interface ProductCardProps {
  producto: Producto;
  isLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ producto, isLoading = false }) => {
  const { addItem, isInCart, getItemQuantity } = useCart();
  // Usar el stock real de la base de datos
  const stockActual = producto.stock;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  if (isLoading) {
    return <ProductCardSkeleton />;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(price);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/equipos-gimnasio-profesionales.webp'; // Imagen por defecto
  };

  const handleAddToCart = () => {
    addItem(producto);
  };
  
  const openPreview = () => {
    setIsPreviewOpen(true);
  };
  
  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  const itemQuantity = getItemQuantity(producto.id);
  const productInCart = isInCart(producto.id);

  return (
    <>
      <div className="product-card group bg-gray-900 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-800 hover:border-green-500/50">
        <div 
          className="product-image relative overflow-visible cursor-pointer"
          onClick={openPreview}
        >
          <img 
            src={producto.imagen_url || '/equipos-gimnasio-profesionales.webp'} 
            alt={`${producto.nombre} - BLACK GYM`}
            className="w-full h-48 object-contain transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={handleImageError}
          />
            {/* 
            <div className="product-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 text-white">
              <div className="flex items-center space-x-2">
              <i className="fas fa-boxes text-green-500 text-sm"></i>
              <span className="text-xs font-medium">Stock: {stockActual}</span>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-black/60 rounded-full p-3 text-white">
              <i className="fas fa-search text-green-500 text-lg"></i>
              </div>
            </div>
            </div>
            */}
        </div>
      
        <div className="product-content p-4">
          <h3 
            className="text-lg font-bold text-white mb-2 group-hover:text-green-500 transition-colors line-clamp-2 cursor-pointer"
            onClick={openPreview}
          >
            {producto.nombre}
          </h3>
          
            {/* <p className="text-gray-400 text-sm mb-3 leading-relaxed line-clamp-2">
            {producto.descripcion || 'Producto de calidad profesional para tu entrenamiento.'}
            </p> */}
          
          <div className="flex items-center justify-between mb-3">
            <div className="price-info">
              <span className="text-xl font-bold text-green-500">
                {formatPrice(producto.precio)}
              </span>
            </div>
            
            <div className="stock-info">
              {stockActual > 0 ? (
                <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">
                  En stock ({stockActual})
                </span>
              ) : (
                <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded-full">
                  Agotado
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={openPreview}
              className="py-2.5 px-3 rounded-lg font-medium transition-all duration-300 text-sm 
                border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <i className="fas fa-search text-sm mr-1"></i>
              Ver detalles
            </button>
            
            <button 
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-300 text-sm relative overflow-hidden ${
                stockActual > 0 
                  ? 'bg-gradient-to-r from-green-500 to-green-400 text-black hover:from-green-400 hover:to-green-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              disabled={stockActual === 0}
            >
              {stockActual > 0 ? (
                <div className="flex items-center justify-center space-x-2">
                  <i className={`fas text-sm transition-all duration-300 ${
                    productInCart ? 'fa-check' : 'fa-shopping-cart'
                  }`}></i>
                  <span>{productInCart ? `(${itemQuantity})` : 'Agregar'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <i className="fas fa-times-circle text-sm"></i>
                  <span>Sin stock</span>
                </div>
              )}
              
              {/* Efecto hover */}
              {stockActual > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de vista previa */}
      <ProductPreviewModal 
        product={{
          ...producto,
          stock: stockActual
        }} 
        isOpen={isPreviewOpen} 
        onClose={closePreview} 
      />
    </>
  );
};

// Skeleton loader para estado de carga
const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="product-card bg-gray-900 rounded-lg overflow-hidden shadow-xl animate-pulse border border-gray-800">
      <div className="h-48 bg-gray-800"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-800 rounded mb-2"></div>
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-800 rounded"></div>
          <div className="h-4 bg-gray-800 rounded w-3/4"></div>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div className="h-6 bg-gray-800 rounded w-16"></div>
          <div className="h-5 bg-gray-800 rounded w-14"></div>
        </div>
        <div className="h-10 bg-gray-800 rounded"></div>
      </div>
    </div>
  );
};

export default ProductCard;
