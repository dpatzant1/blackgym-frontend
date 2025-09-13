import React from 'react';
import { useCart } from '../../stores/cartStore';
import type { CartItem } from '../../stores/cartStore';
import DynamicProductImage from './DynamicProductImage';

const CartPage: React.FC = () => {
  const { 
    items, 
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

  const proceedToCheckout = () => {
    window.location.href = '/checkout';
  };

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              <i className="fas fa-shopping-cart text-green-500 mr-4"></i>
              TU <span className="text-green-500">CARRITO</span>
            </h1>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </div>

          {/* Carrito vacío */}
          <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 p-12">
            <div className="text-center">
              <div className="mb-8">
                <i className="fas fa-shopping-cart text-gray-500 text-6xl mb-4"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Parece que aún no has agregado productos a tu carrito. 
                ¡Explora nuestra selección de equipos y suplementos de calidad profesional!
              </p>
              
              <div className="space-y-4">
                <a
                  href="/#productos"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-400 text-black font-bold px-8 py-3 rounded-lg hover:from-green-400 hover:to-green-300 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-dumbbell"></i>
                  <span>Ver Productos</span>
                </a>
                
                <div className="text-gray-500">o</div>
                
                <a
                  href="/tienda"
                  className="inline-flex items-center space-x-2 border border-green-500 text-green-500 font-medium px-8 py-3 rounded-lg hover:bg-green-500 hover:text-black transition-all duration-300"
                >
                  <i className="fas fa-store"></i>
                  <span>Explorar Tienda</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
            <i className="fas fa-shopping-cart text-green-500 mr-2 md:mr-4"></i>
            TU <span className="text-green-500">CARRITO</span>
          </h1>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-base md:text-lg">
            {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden w-full max-w-full">
              <div className="p-4 md:p-6 border-b border-gray-700">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h2 className="text-lg md:text-xl font-bold text-white">
                    Productos Seleccionados
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200 self-start sm:self-auto"
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Vaciar carrito
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-700 max-h-[770px] overflow-y-auto [&::-webkit-scrollbar]:w-2
                     [&::-webkit-scrollbar-track]:bg-gray-700
                     [&::-webkit-scrollbar-track]:rounded
                     [&::-webkit-scrollbar-thumb]:bg-green-500
                     [&::-webkit-scrollbar-thumb]:rounded
                     [&::-webkit-scrollbar-thumb:hover]:bg-green-400"
                    style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(16, 185, 129, 0.2) rgba(55, 65, 81, 0)',
                    }}>
                {items.map((item, index) => (
                  <div key={item.id} className="p-4 md:p-6 hover:bg-gray-800/50 transition-colors duration-200">
                    {/* Layout móvil y desktop diferente */}
                    <div className="block md:hidden">
                      {/* Layout móvil - Vertical */}
                      <div className="space-y-3">
                        {/* Header móvil - Imagen, nombre y precio */}
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-600">
                              <DynamicProductImage
                                productId={item.id}
                                productName={item.nombre}
                                className="w-full h-full object-cover"
                                fallbackImage="/equipos-gimnasio-profesionales.webp"
                              />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{item.nombre}</h3>
                            <p className="text-green-500 font-bold text-base">
                              {formatPrice(item.precio)}
                              <span className="text-gray-400 text-xs ml-1">c/u</span>
                            </p>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 hover:text-red-300 p-1 rounded transition-colors duration-200"
                            title="Eliminar producto"
                          >
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        </div>
                        
                        {/* Controles móvil */}
                        <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-xs">Cantidad:</span>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleQuantityChange(item, item.cantidad - 1)}
                                className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors duration-200"
                              >
                                <i className="fas fa-minus text-xs"></i>
                              </button>
                              
                              <input
                                type="number"
                                min="1"
                                max={item.stock}
                                value={item.cantidad}
                                onChange={(e) => {
                                  const newQuantity = parseInt(e.target.value) || 1;
                                  handleQuantityChange(item, newQuantity);
                                }}
                                className="w-12 text-center bg-gray-800 text-white border border-gray-600 rounded px-1 py-1 text-sm"
                              />
                              
                              <button
                                onClick={() => handleQuantityChange(item, item.cantidad + 1)}
                                disabled={item.cantidad >= item.stock}
                                className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <i className="fas fa-plus text-xs"></i>
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-white font-bold text-base">
                              {formatPrice(item.precio * item.cantidad)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Stock: {item.stock}
                            </p>
                          </div>
                        </div>
                        
                        {/* Warning de stock móvil */}
                        {item.cantidad >= item.stock && (
                          <p className="text-amber-400 text-xs bg-amber-500/10 p-2 rounded">
                            <i className="fas fa-exclamation-triangle mr-1"></i>
                            Stock máximo alcanzado
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Layout desktop - Horizontal */}
                    <div className="hidden md:flex md:space-x-4">
                      {/* Imagen del producto */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-600">
                          <DynamicProductImage
                            productId={item.id}
                            productName={item.nombre}
                            className="w-full h-full object-cover"
                            fallbackImage="/equipos-gimnasio-profesionales.webp"
                          />
                        </div>
                      </div>
                      
                      {/* Información del producto */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold mb-1">{item.nombre}</h3>
                        <p className="text-green-500 font-bold text-lg mb-2">
                          {formatPrice(item.precio)}
                          <span className="text-gray-400 text-sm ml-2">c/u</span>
                        </p>
                        
                        {/* Controles de cantidad desktop */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm">Cantidad:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item, item.cantidad - 1)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors duration-200"
                              >
                                <i className="fas fa-minus text-xs"></i>
                              </button>
                              
                              <input
                                type="number"
                                min="1"
                                max={item.stock}
                                value={item.cantidad}
                                onChange={(e) => {
                                  const newQuantity = parseInt(e.target.value) || 1;
                                  handleQuantityChange(item, newQuantity);
                                }}
                                className="w-16 text-center bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                              />
                              
                              <button
                                onClick={() => handleQuantityChange(item, item.cantidad + 1)}
                                disabled={item.cantidad >= item.stock}
                                className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <i className="fas fa-plus text-xs"></i>
                              </button>
                            </div>
                          </div>
                          
                          {/* Stock disponible */}
                          <div className="text-xs text-gray-500">
                            Stock: {item.stock}
                          </div>
                        </div>
                        
                        {/* Warning de stock desktop */}
                        {item.cantidad >= item.stock && (
                          <p className="text-amber-400 text-xs mt-2">
                            <i className="fas fa-exclamation-triangle mr-1"></i>
                            Stock máximo alcanzado
                          </p>
                        )}
                      </div>
                      
                      {/* Subtotal y eliminar desktop */}
                      <div className="text-right space-y-2">
                        <p className="text-white font-bold text-lg">
                          {formatPrice(item.precio * item.cantidad)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300 p-2 rounded transition-colors duration-200"
                          title="Eliminar producto"
                        >
                          <i className="fas fa-trash text-sm"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón continuar comprando */}
            <div className="text-center">
              <a
                href="/#productos"
                className="inline-flex items-center space-x-2 text-green-500 hover:text-green-400 font-medium transition-colors duration-200"
              >
                <i className="fas fa-arrow-left"></i>
                <span>Continuar comprando</span>
              </a>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1 w-full box-border overflow-hidden">
            <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 lg:sticky lg:top-8 w-full box-border overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-700">
                <h3 className="text-lg md:text-xl font-bold text-white">
                  <i className="fas fa-receipt text-green-500 mr-2"></i>
                  Resumen del Pedido
                </h3>
              </div>
              
              <div className="p-4 md:p-6 space-y-4">
                {/* Desglose de productos */}
                <div className="space-y-2 md:space-y-3 overflow-y-auto max-h-72
                    [&::-webkit-scrollbar]:w-2
                     [&::-webkit-scrollbar-track]:bg-gray-700
                     [&::-webkit-scrollbar-track]:rounded
                     [&::-webkit-scrollbar-thumb]:bg-green-500
                     [&::-webkit-scrollbar-thumb]:rounded
                     [&::-webkit-scrollbar-thumb:hover]:bg-green-400"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'rgba(16, 185, 129, 0.2) rgba(55, 65, 81, 0)',
                    }}>
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs md:text-sm gap-2">
                      <span className="text-gray-400 truncate flex-1 min-w-0">
                        {item.nombre} x{item.cantidad}
                      </span>
                      <span className="text-white font-medium flex-shrink-0">
                        {formatPrice(item.precio * item.cantidad)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-base md:text-lg font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-green-500 text-lg md:text-xl">{formattedTotal}</span>
                  </div>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="p-4 md:p-6 border-t border-gray-700 space-y-3">
                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-gradient-to-r from-green-500 to-green-400 text-black font-bold py-3 rounded-lg hover:from-green-400 hover:to-green-300 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                  <i className="fas fa-credit-card mr-2"></i>
                  Proceder al Checkout
                </button>
                
                <a
                  href="https://wa.me/50250509724?text=Hola%2C%20me%20interesa%20realizar%20una%20compra%20en%20BLACK%20GYM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 border border-green-500 text-green-500 font-medium py-3 rounded-lg hover:bg-green-500 hover:text-black transition-all duration-300 text-sm md:text-base"
                >
                  <i className="fab fa-whatsapp text-lg"></i>
                  <span className="hidden sm:inline">Consultar por WhatsApp</span>
                  <span className="sm:hidden">WhatsApp</span>
                </a>
              </div>
              
              {/* Información adicional */}
              <div className="p-4 md:p-6 bg-gray-800/50">
                <div className="space-y-3 text-xs text-gray-400">
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fas fa-shield-alt text-green-500 text-sm"></i>
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fas fa-truck text-green-500 text-sm"></i>
                    <span>Envío a todo el país</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fas fa-phone text-green-500 text-sm"></i>
                    <span>Soporte especializado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
