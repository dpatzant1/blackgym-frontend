import { PRODUCTOS_REALES, CATEGORIAS } from '../data/productosReales';
import type { Producto, Categoria, PaginatedResponse } from '../types/api';

// Simula delay de red para realismo
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Convertir productos reales al formato de la API
const convertirProducto = (productoCompleto: typeof PRODUCTOS_REALES[0]): Producto => ({
  id: productoCompleto.id,
  nombre: productoCompleto.nombre,
  descripcion: productoCompleto.descripcion,
  precio: productoCompleto.precio,
  stock: productoCompleto.stock || 20, // Stock por defecto si no está definido
  imagen_url: productoCompleto.imagen_url,
  categoria: productoCompleto.categoria_nombre,
  marca: productoCompleto.marca,
  especificaciones: productoCompleto.especificaciones.ingredientes_principales,
  ingredientes: productoCompleto.especificaciones.ingredientes_principales,
  beneficios: productoCompleto.especificaciones.beneficios,
  uso: productoCompleto.especificaciones.modo_uso,
  precio_original: productoCompleto.precio_original,
  peso: productoCompleto.especificaciones.peso,
  sabores: productoCompleto.especificaciones.sabores
});

export const mockProductosService = {
  // Obtener productos con filtros
  async getProductos(params: {
    page?: number;
    limit?: number;
    categoria?: number | string; // Permitir ID numérico o nombre string
    search?: string;
  } = {}): Promise<PaginatedResponse<Producto>> {
    await delay(300); // Simular latencia de red

    const { page = 1, limit = 12, categoria, search } = params;
    
    let productos = [...PRODUCTOS_REALES];
    
    // Filtrar por categoría (si se pasa como string, buscar por nombre)
    if (categoria) {
      if (typeof categoria === 'string') {
        productos = productos.filter(p => p.categoria_nombre === categoria);
      } else {
        productos = productos.filter(p => p.categoria_id === categoria);
      }
    }
    
    // Filtrar por búsqueda
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase();
      productos = productos.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm) ||
        p.descripcion.toLowerCase().includes(searchTerm) ||
        p.categoria_nombre.toLowerCase().includes(searchTerm) ||
        p.marca.toLowerCase().includes(searchTerm) ||
        p.etiquetas.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = productos.slice(startIndex, endIndex);
    
    return {
      data: paginatedProducts.map(convertirProducto),
      pagination: {
        page,
        limit,
        total: productos.length,
        totalPages: Math.ceil(productos.length / limit),
        hasNext: endIndex < productos.length,
        hasPrev: page > 1
      }
    };
  },

  // Obtener producto por ID
  async getProducto(id: number): Promise<Producto | null> {
    await delay(150);
    
    const producto = PRODUCTOS_REALES.find(p => p.id === id);
    return producto ? convertirProducto(producto) : null;
  },

  // Búsqueda avanzada
  async searchProductos(query: string): Promise<Producto[]> {
    await delay(200);
    
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    const resultados = PRODUCTOS_REALES.filter(p => 
      p.nombre.toLowerCase().includes(searchTerm) ||
      p.descripcion.toLowerCase().includes(searchTerm) ||
      p.categoria_nombre.toLowerCase().includes(searchTerm) ||
      p.marca.toLowerCase().includes(searchTerm) ||
      p.etiquetas.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    return resultados.map(convertirProducto);
  },

  // Verificar stock
  async checkStock(productos: { id: number; cantidad: number }[]): Promise<{ success: boolean; message?: string; data?: any }> {
    await delay(100);
    
    const errores = [];
    
    for (const item of productos) {
      const producto = PRODUCTOS_REALES.find(p => p.id === item.id);
      if (!producto) {
        errores.push(`Producto con ID ${item.id} no encontrado`);
      } else if (producto.stock < item.cantidad) {
        errores.push(`${producto.nombre}: Stock insuficiente (disponible: ${producto.stock}, solicitado: ${item.cantidad})`);
      }
    }
    
    return {
      success: errores.length === 0,
      message: errores.length > 0 ? errores.join('. ') : 'Stock disponible para todos los productos',
      data: errores.length === 0 ? productos : null
    };
  }
};

export const mockCategoriasService = {
  // Obtener todas las categorías
  async getCategorias(): Promise<PaginatedResponse<Categoria>> {
    await delay(200);
    
    return {
      data: CATEGORIAS.map(cat => ({
        id: cat.id,
        nombre: cat.nombre,
        descripcion: cat.descripcion,
        imagen_url: '/suplementos-deportivos-proteinas-aminoacidos.webp' // Imagen por defecto
      })),
      pagination: {
        page: 1,
        limit: 50,
        total: CATEGORIAS.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    };
  },

  // Obtener categoría por ID
  async getCategoria(id: number): Promise<Categoria | null> {
    await delay(100);
    
    const categoria = CATEGORIAS.find(c => c.id === id);
    return categoria ? {
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      imagen_url: '/suplementos-deportivos-proteinas-aminoacidos.webp'
    } : null;
  },

  // Obtener productos por categoría
  async getProductosPorCategoria(categoriaId: number, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Producto>> {
    return mockProductosService.getProductos({
      ...params,
      categoria: categoriaId
    });
  }
};

// Función auxiliar para obtener detalles completos de un producto (para futuro uso)
export const getProductoCompleto = (id: number) => {
  return PRODUCTOS_REALES.find(p => p.id === id);
};
