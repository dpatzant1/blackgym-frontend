import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Producto } from '../types/api';
import toast from 'react-hot-toast';

// Tipos para el carrito
export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  imagen_url: string;
  cantidad: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  itemCount: number;
  hasHydrated: boolean;
}

interface CartActions {
  // Acciones del carrito
  addItem: (producto: Producto, cantidad?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, cantidad: number) => void;
  clearCart: () => void;
  
  // Acciones de UI
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Utilidades
  getItemQuantity: (id: number) => number;
  isInCart: (id: number) => boolean;
}

type CartStore = CartState & CartActions;

// Funciones auxiliares para cálculos
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.cantidad, 0);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      isOpen: false,
      total: 0,
      itemCount: 0,
      hasHydrated: false,

      // Agregar producto al carrito
      addItem: (producto: Producto, cantidad = 1) => {
        const { items } = get();
        
        // Verificar stock disponible del producto real
        const stockDisponible = producto.stock;
        if (stockDisponible < cantidad) {
          toast.error(`Solo hay ${stockDisponible} unidades disponibles`, {
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid #dc2626',
            },
            iconTheme: {
              primary: '#dc2626',
              secondary: '#ffffff',
            },
          });
          return;
        }

        const existingItem = items.find(item => item.id === producto.id);
        
        if (existingItem) {
          // Si ya existe, verificar que no exceda el stock
          const newQuantity = existingItem.cantidad + cantidad;
          if (newQuantity > stockDisponible) {
            toast.error(`No puedes agregar más de ${stockDisponible} unidades`, {
              duration: 3000,
              style: {
                background: '#1a1a1a',
                color: '#ffffff',
                border: '1px solid #dc2626',
              },
              iconTheme: {
                primary: '#dc2626',
                secondary: '#ffffff',
              },
            });
            return;
          }
          
          // Actualizar cantidad
          const updatedItems = items.map(item =>
            item.id === producto.id
              ? { ...item, cantidad: newQuantity, stock: producto.stock }
              : item
          );
          
          set({
            items: updatedItems,
            total: calculateTotal(updatedItems),
            itemCount: calculateItemCount(updatedItems),
          });
          
          toast.success(`${producto.nombre} actualizado en el carrito`, {
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid #00ff41',
            },
            iconTheme: {
              primary: '#00ff41',
              secondary: '#000000',
            },
          });
        } else {
          // Agregar nuevo item
          const newItem: CartItem = {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            imagen_url: producto.imagen_url,
            cantidad,
          };
          
          const updatedItems = [...items, newItem];
          
          set({
            items: updatedItems,
            total: calculateTotal(updatedItems),
            itemCount: calculateItemCount(updatedItems),
          });
          
          toast.success(`${producto.nombre} agregado al carrito`, {
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid #00ff41',
            },
            iconTheme: {
              primary: '#00ff41',
              secondary: '#000000',
            },
          });
        }
      },

      // Remover producto del carrito
      removeItem: (id: number) => {
        const { items } = get();
        const item = items.find(item => item.id === id);
        
        const updatedItems = items.filter(item => item.id !== id);
        
        set({
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        });
        
        if (item) {
          toast.success(`${item.nombre} eliminado del carrito`, {
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid #f59e0b',
            },
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#000000',
            },
          });
        }
      },

      // Actualizar cantidad de un producto
      updateQuantity: (id: number, cantidad: number) => {
        if (cantidad <= 0) {
          get().removeItem(id);
          return;
        }

        const { items } = get();
        const item = items.find(item => item.id === id);
        
        if (!item) return;

        // Verificar stock
        if (cantidad > item.stock) {
          toast.error(`Solo hay ${item.stock} unidades disponibles`, {
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid #dc2626',
            },
            iconTheme: {
              primary: '#dc2626',
              secondary: '#ffffff',
            },
          });
          return;
        }

        const updatedItems = items.map(item =>
          item.id === id ? { ...item, cantidad } : item
        );

        set({
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        });
      },

      // Limpiar carrito
      clearCart: () => {
        const { items } = get();
        
        set({
          items: [],
          total: 0,
          itemCount: 0,
        });
        
        toast.success('Carrito vaciado', {
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid #6b7280',
          },
          iconTheme: {
            primary: '#6b7280',
            secondary: '#ffffff',
          },
        });
      },

      // Toggle del carrito (abrir/cerrar)
      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      // Abrir carrito
      openCart: () => {
        set({ isOpen: true });
      },

      // Cerrar carrito
      closeCart: () => {
        set({ isOpen: false });
      },

      // Obtener cantidad de un producto específico
      getItemQuantity: (id: number) => {
        const { items } = get();
        const item = items.find(item => item.id === id);
        return item?.cantidad || 0;
      },

      // Verificar si un producto está en el carrito
      isInCart: (id: number) => {
        const { items } = get();
        return items.some(item => item.id === id);
      },
    }),
    {
      name: 'black-gym-cart', // nombre único para localStorage
      storage: createJSONStorage(() => localStorage),
      // Solo persistir el estado, no las acciones ni isOpen
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      }),
      // Recalcular valores después de hidratación
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.total = calculateTotal(state.items);
          state.itemCount = calculateItemCount(state.items);
          state.isOpen = false; // Siempre cerrar al cargar
          state.hasHydrated = true; // Marcar como hidratado
        }
      },
    }
  )
);

// Hook personalizado para facilitar el uso
export const useCart = () => {
  const store = useCartStore();
  
  return {
    // Estado
    items: store.items,
    isOpen: store.isOpen,
    total: store.total,
    itemCount: store.itemCount,
    hasHydrated: store.hasHydrated,
    
    // Acciones
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    
    // UI
    toggleCart: store.toggleCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    
    // Utilidades
    getItemQuantity: store.getItemQuantity,
    isInCart: store.isInCart,
    
    // Computed values
    isEmpty: store.items.length === 0,
    hasItems: store.items.length > 0,
    
    // Formateo de precio
    formattedTotal: new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(store.total),
  };
};

// Selector para optimizar re-renders
export const useCartCount = () => useCartStore(state => state.itemCount);
export const useCartTotal = () => useCartStore(state => state.total);
export const useCartIsOpen = () => useCartStore(state => state.isOpen);
