import { useState, useEffect } from 'react';
import type { Producto } from '../types/api';

interface InventarioItem extends Producto {
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  ultimaActualizacion: string;
}

interface UseInventarioReturn {
  inventario: InventarioItem[];
  actualizarStock: (id: number, nuevoStock: number) => void;
  reducirStock: (id: number, cantidad: number) => boolean;
  aumentarStock: (id: number, cantidad: number) => void;
  obtenerStock: (id: number) => number;
  verificarDisponibilidad: (id: number, cantidadSolicitada: number) => boolean;
  getProductoConStock: (id: number) => InventarioItem | undefined;
  getProductosBajoStock: () => InventarioItem[];
  resetearInventario: () => void;
}

const INVENTARIO_KEY = 'black_gym_inventario';

// Stock inicial por defecto para productos
const STOCK_INICIAL = {
  vitaminas: 50,
  proteinas: 30,
  snacks: 25,
  perdida_peso: 20,
  herbales: 15,
  vida_activa: 35,
  belleza: 20,
  enzimas: 15,
  accesorios: 10
};

const obtenerStockInicial = (categoria: string): number => {
  const key = categoria.toLowerCase().replace(/[^a-z]/g, '_') as keyof typeof STOCK_INICIAL;
  return STOCK_INICIAL[key] || 20;
};

export const useInventario = (): UseInventarioReturn => {
  const [inventario, setInventario] = useState<InventarioItem[]>([]);

  // Cargar inventario desde localStorage al inicializar
  useEffect(() => {
    const inventarioGuardado = localStorage.getItem(INVENTARIO_KEY);
    if (inventarioGuardado) {
      try {
        const inventarioParsed = JSON.parse(inventarioGuardado);
        setInventario(inventarioParsed);
      } catch (error) {
        localStorage.removeItem(INVENTARIO_KEY);
      }
    }
  }, []);

  // Guardar inventario en localStorage cuando cambie
  const guardarInventario = (nuevoInventario: InventarioItem[]) => {
    setInventario(nuevoInventario);
    localStorage.setItem(INVENTARIO_KEY, JSON.stringify(nuevoInventario));
  };

  // Inicializar inventario con productos
  const inicializarInventario = (productos: Producto[]) => {
    const inventarioExistente = localStorage.getItem(INVENTARIO_KEY);
    if (inventarioExistente) return; // Ya está inicializado

    const nuevoInventario: InventarioItem[] = productos.map(producto => ({
      ...producto,
      stockActual: obtenerStockInicial(producto.categoria || 'otros'),
      stockMinimo: 5,
      stockMaximo: obtenerStockInicial(producto.categoria || 'otros') * 2,
      ultimaActualizacion: new Date().toISOString()
    }));

    guardarInventario(nuevoInventario);
  };

  const actualizarStock = (id: number, nuevoStock: number) => {
    const inventarioActualizado = inventario.map(item => 
      item.id === id 
        ? { 
            ...item, 
            stockActual: Math.max(0, nuevoStock),
            ultimaActualizacion: new Date().toISOString()
          }
        : item
    );
    guardarInventario(inventarioActualizado);
  };

  const reducirStock = (id: number, cantidad: number): boolean => {
    const item = inventario.find(i => i.id === id);
    if (!item || item.stockActual < cantidad) {
      return false; // No hay suficiente stock
    }

    actualizarStock(id, item.stockActual - cantidad);
    return true;
  };

  const aumentarStock = (id: number, cantidad: number) => {
    const item = inventario.find(i => i.id === id);
    if (!item) return;

    const nuevoStock = Math.min(item.stockActual + cantidad, item.stockMaximo);
    actualizarStock(id, nuevoStock);
  };

  const obtenerStock = (id: number): number => {
    const item = inventario.find(i => i.id === id);
    return item?.stockActual || 0;
  };

  const verificarDisponibilidad = (id: number, cantidadSolicitada: number): boolean => {
    const stock = obtenerStock(id);
    return stock >= cantidadSolicitada;
  };

  const getProductoConStock = (id: number): InventarioItem | undefined => {
    return inventario.find(i => i.id === id);
  };

  const getProductosBajoStock = (): InventarioItem[] => {
    return inventario.filter(item => item.stockActual <= item.stockMinimo);
  };

  const resetearInventario = () => {
    localStorage.removeItem(INVENTARIO_KEY);
    setInventario([]);
  };

  return {
    inventario,
    actualizarStock,
    reducirStock,
    aumentarStock,
    obtenerStock,
    verificarDisponibilidad,
    getProductoConStock,
    getProductosBajoStock,
    resetearInventario
  };
};

// Hook para inicializar inventario con productos mock
export const useInicializarInventario = (productos: Producto[]) => {
  const { inventario } = useInventario();

  useEffect(() => {
    if (productos.length > 0 && inventario.length === 0) {
      const inventarioExistente = localStorage.getItem(INVENTARIO_KEY);
      if (!inventarioExistente) {
        const nuevoInventario: InventarioItem[] = productos.map(producto => ({
          ...producto,
          stockActual: obtenerStockInicial(producto.categoria || 'otros'),
          stockMinimo: 5,
          stockMaximo: obtenerStockInicial(producto.categoria || 'otros') * 2,
          ultimaActualizacion: new Date().toISOString()
        }));

        localStorage.setItem(INVENTARIO_KEY, JSON.stringify(nuevoInventario));
      }
    }
  }, [productos, inventario]);
};
