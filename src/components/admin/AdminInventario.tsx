import React, { useState, useEffect } from 'react';
import { useInventario } from '../../hooks/useInventario';
import { PRODUCTOS_REALES } from '../../data/productosReales';
import type { Producto } from '../../types/api';

interface InventarioItem extends Producto {
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  ultimaActualizacion: string;
}

const AdminInventario: React.FC = () => {
  const {
    inventario,
    actualizarStock,
    getProductosBajoStock,
    resetearInventario
  } = useInventario();
  
  const [inventarioCompleto, setInventarioCompleto] = useState<InventarioItem[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [mostrarSoloBajoStock, setMostrarSoloBajoStock] = useState(false);

  // Inicializar inventario con productos reales si está vacío
  useEffect(() => {
    const inventarioLS = localStorage.getItem('black_gym_inventario');
    
    if (!inventarioLS || JSON.parse(inventarioLS).length === 0) {
      // Inicializar con productos reales
      const stockInicial = {
        'Vitaminas y Salud': 50,
        'Proteínas': 30,
        'Snacks': 25,
        'Pérdida y Control de Peso': 20,
        'Productos Herbales': 15,
        'Nutrición Vida Activa': 35,
        'Belleza y Bienestar': 20,
        'Enzimas y Digestión': 15,
        'Accesorios': 10
      };

      const nuevoInventario = PRODUCTOS_REALES.map((producto: Producto) => ({
        ...producto,
        stockActual: stockInicial[producto.categoria as keyof typeof stockInicial] || 20,
        stockMinimo: 5,
        stockMaximo: (stockInicial[producto.categoria as keyof typeof stockInicial] || 20) * 2,
        ultimaActualizacion: new Date().toISOString()
      }));

      localStorage.setItem('black_gym_inventario', JSON.stringify(nuevoInventario));
      setInventarioCompleto(nuevoInventario);
    } else {
      setInventarioCompleto(JSON.parse(inventarioLS));
    }
  }, []);

  // Actualizar inventario cuando cambie
  useEffect(() => {
    if (inventario.length > 0) {
      setInventarioCompleto(inventario);
    }
  }, [inventario]);

  const productosBajoStock = getProductosBajoStock();
  const categorias = [...new Set(inventarioCompleto.map(p => p.categoria))];

  const inventarioFiltrado = inventarioCompleto.filter(producto => {
    const cumpleCategoria = filtroCategoria === 'todas' || producto.categoria === filtroCategoria;
    const cumpleBajoStock = !mostrarSoloBajoStock || producto.stockActual <= producto.stockMinimo;
    return cumpleCategoria && cumpleBajoStock;
  });

  const handleStockChange = (id: number, nuevoStock: number) => {
    actualizarStock(id, Math.max(0, nuevoStock));
    
    // Actualizar estado local
    setInventarioCompleto(prev => prev.map(item =>
      item.id === id 
        ? { ...item, stockActual: Math.max(0, nuevoStock), ultimaActualizacion: new Date().toISOString() }
        : item
    ));
  };

  const getStockStatus = (item: InventarioItem) => {
    if (item.stockActual === 0) return 'sin-stock';
    if (item.stockActual <= item.stockMinimo) return 'bajo-stock';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sin-stock': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'bajo-stock': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sin-stock': return 'Sin Stock';
      case 'bajo-stock': return 'Stock Bajo';
      default: return 'Normal';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            <i className="fas fa-boxes text-green-500 mr-4"></i>
            GESTIÓN DE <span className="text-green-500">INVENTARIO</span>
          </h1>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Administra el stock de productos desde el frontend - Solo para demostración
          </p>
        </div>

        {/* Alertas de stock bajo */}
        {productosBajoStock.length > 0 && (
          <div className="mb-8 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <h3 className="text-yellow-500 font-bold text-xl mb-4">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Productos con Stock Bajo ({productosBajoStock.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productosBajoStock.map(producto => (
                <div key={producto.id} className="flex items-center space-x-3">
                  <img 
                    src={producto.imagen_url || '/placeholder-product.jpg'} 
                    alt={producto.nombre}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{producto.nombre}</p>
                    <p className="text-yellow-500 text-sm">Stock: {producto.stockActual}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controles */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filtro por categoría */}
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-green-500"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>

            {/* Filtro bajo stock */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={mostrarSoloBajoStock}
                onChange={(e) => setMostrarSoloBajoStock(e.target.checked)}
                className="rounded text-green-500 focus:ring-green-500"
              />
              <span>Solo productos con stock bajo</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Total productos: {inventarioFiltrado.length}
            </div>
            
            <button
              onClick={() => {
                if (confirm('¿Estás seguro de resetear todo el inventario?')) {
                  resetearInventario();
                  window.location.reload();
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <i className="fas fa-undo mr-2"></i>
              Resetear Inventario
            </button>
          </div>
        </div>

        {/* Tabla de inventario */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Stock Actual
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {inventarioFiltrado.map((producto) => {
                  const status = getStockStatus(producto);
                  return (
                    <tr key={producto.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={producto.imagen_url || '/placeholder-product.jpg'} 
                            alt={producto.nombre}
                            className="w-12 h-12 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-white">{producto.nombre}</div>
                            <div className="text-sm text-gray-400 truncate max-w-xs">{producto.descripcion}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">{producto.categoria}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-500">
                          Q{producto.precio.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          value={producto.stockActual}
                          onChange={(e) => handleStockChange(producto.id, parseInt(e.target.value) || 0)}
                          className="bg-gray-800 border border-gray-700 text-white px-3 py-1 rounded w-20 text-center focus:outline-none focus:border-green-500"
                        />
                        <div className="text-xs text-gray-400 mt-1">
                          Min: {producto.stockMinimo} | Max: {producto.stockMaximo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStockChange(producto.id, producto.stockActual + 10)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            title="Agregar 10 unidades"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleStockChange(producto.id, Math.max(0, producto.stockActual - 5))}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            title="Reducir 5 unidades"
                          >
                            -5
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {inventarioFiltrado.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <i className="fas fa-box-open text-4xl mb-4"></i>
            <p>No hay productos que coincidan con los filtros seleccionados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInventario;
