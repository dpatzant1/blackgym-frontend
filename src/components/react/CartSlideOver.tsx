import React from 'react';
import { useCart } from '../../stores/cartStore';
import type { CartItem } from '../../stores/cartStore';

const CartSlideOver: React.FC = () => {
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    formattedTotal, 
    itemCount,
    isEmpty 
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(price);
  };

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/equipos-gimnasio-profesionales.webp';
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />
      
      {/* Panel deslizante */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-2xl z-[60] border-l border-gray-700 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header del carrito */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <i className="fas fa-shopping-cart text-green-500 mr-2"></i>
            Tu Carrito ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
            aria-label="Cerrar carrito"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Contenido del carrito */}
        <div className="flex flex-col h-[calc(100vh-80px)]">
          
          {isEmpty ? (
            // Carrito vacío
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="text-center">
                <i className="fas fa-shopping-cart text-gray-500 text-4xl mb-4"></i>
                <h3 className="text-lg font-medium text-white mb-2">Tu carrito está vacío</h3>
                <p className="text-gray-400 mb-6">Agrega algunos productos increíbles</p>
                <button
                  onClick={closeCart}
                  className="bg-gradient-to-r from-green-500 to-green-400 text-black font-medium px-6 py-2 rounded-lg hover:from-green-400 hover:to-green-300 transition-all duration-300"
                >
                  Continuar comprando
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-365px)] md:max-h-[calc(100vh-320px)] [&::-webkit-scrollbar]:w-2
                     [&::-webkit-scrollbar-track]:bg-gray-700
                     [&::-webkit-scrollbar-track]:rounded
                     [&::-webkit-scrollbar-thumb]:bg-green-500
                     [&::-webkit-scrollbar-thumb]:rounded
                     [&::-webkit-scrollbar-thumb:hover]:bg-green-400"
                    style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(16, 185, 129, 0.2) rgba(55, 65, 81, 0)',
                    }}>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 group hover:border-green-500/30 transition-colors duration-300">
                      <div className="flex space-x-4">
                        {/* Imagen del producto */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.imagen_url || '/equipos-gimnasio-profesionales.webp'}
                            alt={item.nombre}
                            className="w-16 h-16 object-cover rounded-md"
                            onError={handleImageError}
                          />
                        </div>
                        
                        {/* Información del producto */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm mb-1 truncate">{item.nombre}</h4>
                          <p className="text-green-500 font-bold text-sm mb-2">{formatPrice(item.precio)}</p>
                          
                          {/* Controles de cantidad */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item, item.cantidad - 1)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors duration-200"
                                aria-label="Disminuir cantidad"
                              >
                                <i className="fas fa-minus text-xs"></i>
                              </button>
                              
                              <span className="text-white font-medium min-w-[2rem] text-center">
                                {item.cantidad}
                              </span>
                              
                              <button
                                onClick={() => handleQuantityChange(item, item.cantidad + 1)}
                                disabled={item.cantidad >= item.stock}
                                className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Aumentar cantidad"
                              >
                                <i className="fas fa-plus text-xs"></i>
                              </button>
                            </div>
                            
                            {/* Botón eliminar */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-red-300 p-1 rounded transition-colors duration-200"
                              aria-label="Eliminar producto"
                            >
                              <i className="fas fa-trash text-sm"></i>
                            </button>
                          </div>
                          
                          {/* Stock warning */}
                          {item.cantidad >= item.stock && (
                            <p className="text-amber-400 text-xs mt-1">
                              <i className="fas fa-exclamation-triangle mr-1"></i>
                              Stock máximo alcanzado
                            </p>
                          )}
                        </div>
                        
                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-white font-bold text-sm">
                            {formatPrice(item.precio * item.cantidad)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Footer con total y acciones */}
              <div className="border-t border-gray-700 p-4 space-y-3 bg-gray-900">
                {/* Botón limpiar carrito */}
                <button
                  onClick={clearCart}
                  className="w-full text-gray-400 hover:text-white text-sm py-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Vaciar carrito
                </button>
                
                {/* Total */}
                <div className="flex justify-between items-center py-2 border-t border-gray-700">
                  <span className="text-lg font-bold text-white">Total:</span>
                  <span className="text-xl font-bold text-green-500">{formattedTotal}</span>
                </div>
                
                {/* Botones de acción - Dos botones lado a lado */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {/* Botón Ver Carrito */}
                  <a
                    href="/carrito"
                    onClick={() => closeCart()}
                    className="inline-flex items-center justify-center space-x-1 border border-green-500 text-green-500 font-medium py-2.5 px-3 rounded-lg hover:bg-green-500 hover:text-black transition-all duration-300 text-sm"
                  >
                    <i className="fas fa-shopping-cart text-sm"></i>
                    <span>Ver Carrito</span>
                  </a>
                  
                  {/* Botón Checkout */}
                  <button
                    onClick={() => {
                      window.location.href = '/checkout';
                      closeCart();
                    }}
                    className="inline-flex items-center justify-center space-x-1 bg-gradient-to-r from-green-500 to-green-400 text-black font-bold py-2.5 px-3 rounded-lg hover:from-green-400 hover:to-green-300 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                  >
                    <i className="fas fa-credit-card text-sm"></i>
                    <span>Checkout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSlideOver;
