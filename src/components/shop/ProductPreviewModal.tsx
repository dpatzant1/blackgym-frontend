import React, { useState } from 'react';
import { useCart } from '../../stores/cartStore';
import type { Producto } from '../../types/api';

interface ProductPreviewModalProps {
  product: Producto | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  if (!isOpen || !product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    onClose();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/equipos-gimnasio-profesionales.webp';
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full z-10"
            aria-label="Cerrar vista previa"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
          
          <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
            {/* Imagen del producto */}
            <div className="md:w-1/2 p-6 flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                <div className="relative w-full max-h-[70vh] flex items-center justify-center">
                  <img
                    src={product.imagen_url || '/equipos-gimnasio-profesionales.webp'}
                    alt={product.nombre}
                    style={{
                      maxHeight: window.innerWidth < 768 ? '24vh' : '70vh'
                    }}
                    onError={handleImageError}
                  />

                  {product.precio_original && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      OFERTA
                    </div>
                  )}
                </div>
            </div>
            
            {/* Información del producto */}
            <div className="md:w-1/2 p-6 overflow-y-auto">
              <div className="space-y-4">
                {/* Navegación tipo breadcrumb */}
                <div className="text-xs text-gray-400 mb-2">
                  <span className="text-green-500 hover:underline cursor-pointer">Home</span>
                  <span className="mx-2">/</span>
                  <span className="hover:underline cursor-pointer">{product.categoria || 'Categoría'}</span>
                </div>
                
                {/* Nombre del producto */}
                <h2
                  className="text-2xl md:text-3xl font-bold text-white leading-tight"
                  style={{
                  fontSize:
                    window.innerWidth < 768
                    ? '1.2rem'
                    : undefined
                  }}
                >
                  {product.nombre}
                </h2>
                
                {/* Precio */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-500">
                    {formatPrice(product.precio)}
                  </span>
                  {product.precio_original && (
                    <span className="text-gray-400 line-through text-lg">
                      {formatPrice(product.precio_original)}
                    </span>
                  )}
                </div>
                
                
                {/* Descripción */}
                {/* <p className="hidden md:block text-gray-300 text-sm md:text-base">
                  {product.descripcion}
                </p> */}

                <div className="border-t border-gray-700 my-4 pt-4">
                  {/* Características */}
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex flex-col">
                      <span className="text-gray-400">Marca:</span>
                      <span className="text-white font-medium">{product.marca || 'GNC'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400">Disponibilidad:</span>
                      <span className={product.stock > 10 ? 'text-green-500 font-medium' : 'text-amber-500 font-medium'}>
                        {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Especificaciones si están disponibles */}
                  {product.especificaciones && (
                    <div className="mb-6">
                      <h3 className="text-white font-bold text-lg mb-2">Especificaciones:</h3>
                      <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                        {product.beneficios && product.beneficios.map((beneficio, index) => (
                          <li key={index}>{beneficio}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Ingredientes si están disponibles */}
                  {product.ingredientes && product.ingredientes.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-white font-bold text-lg mb-2">Ingredientes principales:</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.ingredientes.map((ingrediente, index) => (
                          <span key={index} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
                            {ingrediente}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Selector de cantidad y botón de agregar al carrito */}
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-medium">Cantidad:</span>
                      <div className="flex items-center bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
                        <button
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:text-green-400"
                        >
                          <i className="fas fa-minus text-sm"></i>
                        </button>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max={product.stock}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="w-16 h-10 text-center bg-gray-700 text-white border-0 font-medium text-lg focus:outline-none focus:bg-gray-600 transition-colors [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                          />
                        </div>
                        <button
                          onClick={incrementQuantity}
                          disabled={quantity >= product.stock}
                          className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:text-green-400"
                        >
                          <i className="fas fa-plus text-sm"></i>
                        </button>
                      </div>
                      <span className="text-gray-400 text-sm">
                        (máx. {product.stock})
                      </span>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="flex sm:flex-row gap-3">
                      <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-400 text-black font-bold py-3 px-6 rounded-lg hover:from-green-400 hover:to-green-300 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center"
                      >
                        <i className="fas fa-shopping-cart mr-2"></i>
                        Agregar
                      </button>
                      
                      <a
                        href="https://wa.me/50250509724?text=Hola%2C%20me%20interesa%20conocer%20más%20sobre%20este%20producto%20en%20BLACK%20GYM"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center space-x-2 border border-green-500 text-green-500 font-medium py-3 px-6 rounded-lg hover:bg-green-500 hover:text-black transition-all duration-300 text-base"
                      >
                        <i className="fab fa-whatsapp text-lg"></i>
                        <span>Consultar</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPreviewModal;
