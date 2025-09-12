# Guía de Desarrollo - BLACK GYM Tienda en Línea

## 📋 Información del Proyecto

**Estado Actual**: Migración completada de página estática a Astro + React + TailwindCSS
**Base de Datos**: PostgreSQL en Supabase (✅ Completado - 5 tablas)
**Backend**: Node.js + Express API (✅ Completado - Todos los endpoints listos)
**Frontend**: Astro + React + TailwindCSS (✅ Base completada)

### 🔧 Configuración del Backend
- **URL API**: `http://localhost:3000`
- **Endpoints disponibles**: Productos, Categorías, Órdenes (CRUD completo)
- **Autenticación**: No requerida
- **Base de datos**: 5 tablas (productos, categorias, ordenes, detalle_orden, producto_categoria)
- **Estado**: ✅ Backend completamente funcional

### 🎯 Alcance del Proyecto (Mínimo Viable)
- ✅ Página de tienda con productos dinámicos
- ✅ Filtros por categorías en página principal
- ✅ Templates reutilizables para mostrar productos por categoría
- ✅ Componentes reutilizables (ProductGrid, CategoryFilter, ProductCard)
- ✅ Carrito de compras (solo frontend - localStorage)
- ✅ Proceso de checkout y creación de órdenes
- ✅ Simulación de pago (validación básica de tarjeta)
- ✅ Notificaciones por email (integración con web3forms)
- ❌ No usuarios/login/registro
- ❌ No panel de administración
- ❌ No métodos de pago reales

---

## 🎯 Roadmap de Desarrollo (Actualizado)

### **FASE 1: Configuración y Conexión con API Backend** 
*Duración estimada: 1 día*

#### 1.1 Configuración del entorno
- [X] Instalar dependencias necesarias (`axios`, `@tanstack/react-query`)
- [X] Configurar variables de entorno para API local
- [X] Crear cliente HTTP para comunicación con `http://localhost:3000`
- [X] Configurar manejo de errores global

#### 1.2 Servicios de API
- [X] Crear servicio para productos (`GET /api/productos`, con filtros y búsqueda)
- [X] Crear servicio para categorías (`GET /api/categorias`)
- [X] Crear servicio para órdenes (`POST /api/ordenes`)
- [X] Crear servicio para productos por categoría (`GET /api/categorias/:id/productos`)
- [X] Implementar manejo de respuestas y errores

#### 1.3 Testing inicial de conexión
- [X] Probar conexión con API local (puerto 3000)
- [X] Verificar endpoints de productos y categorías
- [X] Validar estructura de respuestas del backend

---

### **FASE 2: Productos Dinámicos y Categorías**
*Duración estimada: 2 días*

#### 2.1 Reemplazar productos estáticos
- [X] Conectar sección Products con API (`GET /api/productos`)
- [X] Implementar loading states y skeleton loaders
- [X] Configurar Supabase Storage para imágenes de productos
- [X] Crear componente ProductCard dinámico

#### 2.2 Sistema de categorías y templates reutilizables
- [X] Obtener categorías desde API (`GET /api/categorias`)
- [X] Crear componente `ProductGrid` reutilizable para mostrar productos
- [X] Crear componente `CategoryFilter` para filtros dinámicos
- [ ] Implementar template dinámico para categorías usando parámetros de ruta
- [ ] Crear breadcrumbs dinámicos para navegación

#### 2.3 Rutas y templates dinámicos
- [X] Crear ruta `/tienda` - página principal con todos los productos
- [ ] Crear ruta `/tienda/categoria/[slug]` - template dinámico para categorías
- [X] Reutilizar `ProductGrid` en ambas rutas con diferentes datos
- [X] Implementar lógica para mostrar/ocultar filtros según la ruta
- [ ] Agregar paginación y búsqueda en componentes reutilizables

---

### **FASE 3: Carrito de Compras (Frontend Only)**
*Duración estimada: 2 días*

#### 3.1 Estado del carrito (LocalStorage)
- [X] Implementar Context/Zustand para estado del carrito
- [X] Funciones: agregar, quitar, actualizar cantidad, limpiar
- [X] Persistencia en localStorage (no base de datos)
- [X] Cálculo automático de totales

#### 3.2 Componentes del carrito
- [X] Botón "Agregar al carrito" en ProductCard
- [X] Mini-carrito en header con contador
- [X] Página completa del carrito (`/carrito`)
- [X] Componente de item del carrito con controles

#### 3.3 UX del carrito
- [X] Animaciones al agregar productos
- [X] Notificaciones toast
- [X] Validación de cantidad máxima
- [X] Diseño responsive para móviles

---

### **FASE 4: Proceso de Checkout y Órdenes**
*Duración estimada: 2 días*

#### 4.1 Página de checkout
- [X] Crear formulario de datos del cliente (nombre, teléfono, dirección)
- [X] Resumen de productos del carrito
- [X] Cálculo de total final
- [X] Validaciones de campos requeridos

#### 4.2 Simulación de pago
- [X] Formulario básico de tarjeta (número, mes/año, CVV)
- [X] Validación simple de formato de tarjeta
- [X] Animación de "procesando pago"
- [X] No integración real de pagos (solo simulación)

#### 4.3 Creación de orden
- [X] Conectar con API (`POST /api/ordenes`)
- [X] Enviar datos del cliente y productos del carrito
- [X] Limpiar carrito después de orden exitosa
- [X] Página de confirmación con número de orden

#### 4.4 Notificaciones por email
- [ ] Integrar con web3forms para notificación de nueva orden
- [ ] Enviar detalles de la orden al administrador
- [ ] Confirmación de orden al cliente (opcional)

---

### **FASE 5: Optimización y Pulido**
*Duración estimada: 1 día*

#### 5.1 Performance del sitio
- [ ] Implementar lazy loading de imágenes
- [ ] Optimizar consultas a API con React Query
- [ ] Minimizar re-renders innecesarios
- [ ] Optimizar bundle size

#### 5.2 UX/UI final
- [ ] Mejorar estados de loading
- [ ] Pulir animaciones y transiciones
- [ ] Verificar responsive design
- [ ] Mejorar accesibilidad básica

#### 5.3 SEO básico
- [ ] Meta tags dinámicos para productos
- [ ] Sitemap.xml
- [ ] Optimizar Core Web Vitals

---

### **FASE 6: Testing y Deployment**
*Duración estimada: 1 día*

#### 6.1 Testing completo
- [ ] Pruebas de flujo completo de compra
- [ ] Testing en diferentes dispositivos
- [ ] Verificar formularios y validaciones
- [ ] Probar con productos reales

#### 6.2 Preparar para producción
- [ ] Configurar build de producción
- [ ] Variables de entorno para API de producción
- [ ] Deploy en Vercel/Netlify
- [ ] Verificar funcionamiento en producción

---

## 🔧 Tecnologías y Dependencias a Agregar

### Frontend (a instalar)
- `axios` - Comunicación con API (`http://localhost:3000`)
- `@tanstack/react-query` - Manejo de estado de servidor y caché
- `zustand` o Context API - Estado global del carrito (localStorage)
- `react-hook-form` - Manejo de formularios de checkout
- `zod` - Validación de datos del formulario
- `react-hot-toast` - Notificaciones

### Integraciones externas
- **Supabase Storage** - Almacenamiento de imágenes de productos
- **Web3Forms** - Notificaciones por email (ya implementado)

### No se requiere
- ❌ Autenticación (NextAuth, Auth0, etc.)
- ❌ Pasarelas de pago (Stripe, PayPal, etc.)
- ❌ Base de datos para usuarios
- ❌ Sistema de roles/permisos

---

## 📊 Endpoints del Backend Disponibles

### Productos
```
GET    /api/productos                     - Listar todos (con filtros y paginación)
GET    /api/productos/search              - Búsqueda avanzada
GET    /api/productos/:id                 - Obtener por ID
POST   /api/productos/check-stock         - Verificar stock múltiple
```

### Categorías
```
GET    /api/categorias                    - Listar todas
GET    /api/categorias/:id                - Obtener por ID
GET    /api/categorias/:id/productos      - Productos por categoría
```

### Órdenes
```
GET    /api/ordenes                       - Listar órdenes
POST   /api/ordenes                       - Crear orden nueva
GET    /api/ordenes/:id                   - Obtener orden por ID
GET    /api/ordenes/stats                 - Estadísticas de órdenes
```

---

## 🏗️ Estructura de Datos

### Producto
```javascript
{
  id: number,
  nombre: string,
  descripcion: string,
  precio: number,
  stock: number,
  imagen_url: string
}
```

### Categoría
```javascript
{
  id: number,
  nombre: string,
  descripcion: string,
  imagen_url: string
}
```

### Orden (para crear)
```javascript
{
  cliente: string,
  telefono: string,
  direccion: string,
  total: number,
  productos: [
    {
      id: number,
      cantidad: number,
      precio_unitario: number
    }
  ]
}
```

---

## 📝 Notas Importantes

### ✅ Simplificaciones del Proyecto
1. **Sin autenticación**: No hay usuarios, login, ni registro
2. **Carrito solo frontend**: Se almacena en localStorage, no en BD
3. **Pago simulado**: Solo validación básica de formato de tarjeta
4. **Sin panel admin**: No se requiere gestión desde interfaz web
5. **Backend completo**: Todos los endpoints necesarios ya están listos

### 🎯 Funcionalidades Core (Mínimas)
1. **Tienda de productos**: Mostrar productos dinámicos desde API
2. **Filtros por categoría**: Navegación y filtrado por categorías
3. **Carrito funcional**: Agregar/quitar productos, calcular totales
4. **Checkout**: Formulario + simulación de pago + crear orden
5. **Notificaciones**: Email via web3forms para nuevas órdenes

### 🔄 Flujo de Compra Simplificado
1. Usuario navega productos en `/tienda` (todos los productos)
2. Puede filtrar por categorías o ir a `/tienda/categoria/equipos-fuerza`
3. Agrega productos al carrito (localStorage) usando componente reutilizable
4. Va a checkout y llena datos
5. "Paga" con tarjeta simulada
6. Se crea orden en BD via API
7. Se envía notificación por email
8. Página de confirmación
9. Carrito se limpia

### 🧩 Arquitectura de Componentes (Buenas Prácticas)
- **ProductCard**: Componente reutilizable para mostrar producto individual
- **ProductGrid**: Grid responsivo reutilizable para cualquier lista de productos
- **CategoryFilter**: Filtros dinámicos (se oculta en páginas de categoría específica)
- **CartContext**: Estado global del carrito compartido
- **Template dinámico**: `/tienda/categoria/[slug]` reutiliza ProductGrid con datos filtrados
- **Breadcrumbs**: Navegación dinámica según la ruta actual

### ⚠️ Consideraciones Técnicas
- **API local**: `http://localhost:3000` (desarrollo)
- **Imágenes**: Subir a Supabase Storage cuando se tengan productos reales
- **Datos de prueba**: Backend tiene endpoints para testing
- **Estado global**: Context API o Zustand para carrito
- **Persistencia**: Solo localStorage para carrito, BD solo para órdenes

---

## 🚀 Estimación Total de Tiempo

**Total estimado**: 7-8 días de desarrollo
- **Fase 1**: 1 día (Configuración y API)
- **Fase 2**: 2 días (Productos dinámicos)
- **Fase 3**: 2 días (Carrito)
- **Fase 4**: 2 días (Checkout y órdenes)
- **Fase 5**: 1 día (Optimización)
- **Fase 6**: 1 día (Testing y deployment)

---

## 🎓 Objetivos Académicos Cumplidos

✅ **Migración tecnológica**: HTML/CSS/JS → Astro/React/Tailwind
✅ **Backend moderno**: Node.js + Express + PostgreSQL
✅ **Base de datos relacional**: Diseño normalizado con relaciones
✅ **API RESTful**: Endpoints completos con CRUD
✅ **Frontend reactivo**: Componentes dinámicos y reutilizables
✅ **Arquitectura de componentes**: Buenas prácticas de React (reutilización, separación de responsabilidades)
✅ **Routing dinámico**: Templates con parámetros de ruta
✅ **Estado global**: Context API para manejo de carrito
✅ **E-commerce funcional**: Carrito + checkout + órdenes
✅ **Integración completa**: Frontend ↔ Backend ↔ Base de datos

---

## 🚀 Próximos Pasos

1. **Confirmar inicio**: Esperar confirmación para comenzar Fase 1
2. **Preparar entorno**: Asegurar que API backend esté corriendo
3. **Cargar datos de prueba**: Productos y categorías para testing
4. **Comenzar desarrollo**: Seguir guía fase por fase

---

*Guía actualizada según requerimientos específicos del proyecto académico BLACK GYM*
