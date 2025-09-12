import React from 'react';
import { useCart, useCartCount } from '../../stores/cartStore';

const MobileCartIcon: React.FC = () => {
  const { toggleCart } = useCart();
  const itemCount = useCartCount();

  return (
    <button
      onClick={toggleCart}
      className="md:hidden relative flex items-center justify-center w-10 h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-300 border border-gray-700 hover:border-green-500/50 group"
      aria-label={`Abrir carrito de compras - ${itemCount} productos`}
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
      
      {/* Efecto hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
    </button>
  );
};

export default MobileCartIcon;
