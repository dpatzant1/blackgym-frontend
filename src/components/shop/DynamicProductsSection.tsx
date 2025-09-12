import React from 'react';
import ProductGrid from './ProductGrid';
import { useProductos } from '../../hooks/useProductos';

const DynamicProductsSection: React.FC = () => {
  // Usar API real por defecto
  const { productos, isLoading, error } = useProductos({ 
    limit: 8
    // Sin useMockData para usar API por defecto
  });

  return (
    <section id="productos" className="products py-20 md:py-32 ">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="section-header text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            NUESTROS <span className="text-green-500">PRODUCTOS</span>
          </h2>
          <div className="section-line w-24 h-1 bg-green-500 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Descubre nuestra amplia gama de productos fitness de las mejores marcas internacionales
          </p>
        </div>
        
        {/* Grid dinámico de productos */}
        <div className="mb-12">
          <ProductGrid 
            productos={productos}
            isLoading={isLoading}
            error={error || undefined}
            emptyMessage="Próximamente tendremos productos disponibles"
          />
        </div>
        
        {/* Call to Action */}
        <div className="text-center">
            <a 
            href="/tienda" 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-400 text-black font-bold px-8 py-4 rounded-full hover:from-green-400 hover:to-green-300 transition-all duration-300 shadow-lg hover:shadow-xl mb-[15px] md:mb-0 md:mr-4 "
            >
            <i className="fas fa-store"></i>
            <span>VER TODOS LOS PRODUCTOS</span>
            </a>
          
          <a 
            href="https://wa.me/50250509724?text=Hola%2C%20me%20interesa%20conocer%20más%20sobre%20sus%20productos%20de%20BLACK%20GYM" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-transparent border-2 border-green-500 text-green-500 font-bold px-8 py-4 rounded-full hover:bg-green-500 hover:text-black transition-all duration-300"
          >
            <i className="fab fa-whatsapp text-xl"></i>
            <span>¡CONSULTA POR WHATSAPP!</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default DynamicProductsSection;
