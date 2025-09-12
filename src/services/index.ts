// Exportar todos los servicios desde un punto central
export * from './productos';
export * from './categorias';
export * from './ordenes';

// Re-exportar tipos importantes
export type { 
  Producto, 
  Categoria, 
  Orden, 
  OrdenCreate, 
  ApiResponse, 
  PaginatedResponse 
} from '../types/api';
