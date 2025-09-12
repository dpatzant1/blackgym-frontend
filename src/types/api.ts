// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Tipos para productos
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url: string;
  categoria?: string; // Categoría del producto (string legacy)
  categorias?: Categoria[]; // Array de categorías (nuevo formato API búsqueda)
  marca?: string; // Marca del producto
  especificaciones?: string[]; // Especificaciones técnicas
  ingredientes?: string[]; // Ingredientes del producto
  beneficios?: string[]; // Beneficios del producto
  uso?: string; // Instrucciones de uso
  precio_original?: number; // Precio antes de descuento
  descuento?: number; // Porcentaje de descuento
  nuevo?: boolean; // Si es producto nuevo
  destacado?: boolean; // Si es producto destacado
  peso?: string; // Peso o tamaño del producto
  sabores?: string[]; // Sabores disponibles
}

// Tipos para categorías
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
}

// Tipos para órdenes
export interface OrdenItem {
  id: number;
  cantidad: number;
  precio_unitario: number;
}

export interface OrdenCreate {
  cliente: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  codigo_postal: string;
  notas: string;
  total: number;
  productos: OrdenItem[];
}

export interface Orden {
  id: number;
  cliente: string;
  telefono: string;
  direccion: string;
  total: number;
  fecha: string;
}

// Tipos para errores de API
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Tipo para respuestas paginadas
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}
