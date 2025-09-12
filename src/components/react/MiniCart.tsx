import React from 'react';
import { useCart, useCartCount } from '../../stores/cartStore';

const MiniCart: React.FC = () => {
  const { toggleCart, formattedTotal, isEmpty } = useCart();
  const itemCount = useCartCount();

  return (
    <button
      onClick={toggleCart}
      className="relative flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-gray-700 hover:border-green-500/50 group"
      aria-label={`Carrito de compras - ${itemCount} productos`}
    >
      <div className="relative">
        <i className="fas fa-shopping-cart text-lg group-hover:text-green-500 transition-colors duration-300"></i>
        
        {/* Badge del contador */}
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-black text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center animate-pulse">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </div>
      
      <div className="hidden sm:flex flex-col items-start">
        <span className="text-xs text-gray-400">Carrito</span>
        <span className="text-sm font-medium text-green-500">
          {isEmpty ? 'Q0.00' : formattedTotal}
        </span>
      </div>
      
      {/* Indicador visual para pantallas móviles */}
      <div className="sm:hidden">
        {!isEmpty && (
          <span className="text-xs text-green-500 font-medium">
            {formattedTotal}
          </span>
        )}
      </div>
      
      {/* Efecto hover */}
      <div className="absolute top-0 left-0 right-0 bottom-0 !ml-0 bg-gradient-to-r from-green-500/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" style={{ marginLeft: '0 !important' }}></div>
    </button>
  );
};

export default MiniCart;
