# 🔄 GUÍA DE RESTAURACIÓN - Conexión con Base de Datos

## 📋 ANÁLISIS DEL PROBLEMA

### ✅ **Lo que estaba funcionando antes:**
- ✅ Backend completo en Node.js + Express + PostgreSQL/Supabase
- ✅ API funcionando en `http://localhost:3000`
- ✅ Servicios de API configurados (`src/services/productos.ts`)
- ✅ Cliente HTTP configurado (`src/lib/api-client.ts`)
- ✅ Tipos de TypeScript definidos (`src/types/api.ts`)

### 🎉 **EXCELENTES funcionalidades que agregó tu compañero:**
- ✅ **Modal de detalles de producto** (`ProductPreviewModal.tsx`) - ¡Muy profesional!
- ✅ **Filtro dropdown de categorías** (`CategoryDropdown.tsx`) - Con hover y animaciones
- ✅ **Buscador de productos** - Búsqueda en tiempo real
- ✅ **Carrito avanzado** - Con cantidades, fotos, total y control de stock
- ✅ **Sistema de inventario** - Manejo inteligente de stock en localStorage
- ✅ **MiniCart en header** - Con contador de productos y total
- ✅ **Página de carrito completa** (`CartPage.tsx`) - Con resumen y checkout
- ✅ **Panel de administración** (`AdminInventario.tsx`) - Para gestionar stock
- ✅ **Notificaciones toast** - UX profesional con react-hot-toast
- ✅ **Responsive design** - Funciona perfecto en móviles
- ✅ **Integración con Zustand** - Estado global del carrito bien implementado

### ❌ **Lo único que necesitamos cambiar:**
- ❌ **Forzó el uso de datos mock**: En `useProductos.ts` cambió `useMockData: true` por defecto
- ❌ **Productos estáticos**: Ahora usa `PRODUCTOS_REALES` de `src/data/productosReales.ts`
- ❌ **Mock Services**: Implementó `mockProductosService` que simula la API pero sin base de datos

### 🎯 **Lo que vamos a hacer (MANTENER TODO + Conectar API):**
1. **Mantener TODAS las funcionalidades que agregó tu compañero**
2. **Cambiar únicamente la fuente de datos (mock → API)**
3. **Asegurar que TODAS las funciones trabajen con productos de la base de datos**
4. **Mantener el sistema híbrido (API primero, mock como fallback)**
5. **Testing completo de TODAS las funcionalidades**

---

## 🚀 GUÍA DE RESTAURACIÓN POR FASES

### **FASE 1: Configuración del Entorno** 
*Duración estimada: 30 minutos*

#### 1.1 Crear archivo de variables de entorno
- [X] Crear archivo `.env` en la raíz del proyecto
- [X] Configurar URL de la API del backend
- [X] Verificar configuración del cliente HTTP

#### 1.2 Verificar backend funcionando
- [X] Confirmar que el backend está corriendo en `http://localhost:3000`
- [X] Probar endpoints básicos manualmente
- [X] Verificar conexión con base de datos

#### 1.3 Configurar cliente API
- [X] Verificar configuración de `api-client.ts`
- [X] Asegurar que use las variables de entorno correctamente
- [X] Testing de conexión básica

---

### **FASE 2: Restaurar Conexión con API Real**
*Duración estimada: 45 minutos*

#### 2.1 Modificar hook useProductos
- [X] Cambiar comportamiento por defecto: `useMockData: false`
- [X] Implementar fallback inteligente (API → mock solo si falla)
- [X] Mantener compatibilidad con modo desarrollo

#### 2.2 Actualizar componentes principales
- [X] **DynamicProductsSection**: Cambiar a `useMockData: false`
- [X] **TiendaPage**: Cambiar a `useMockData: false`
- [X] Verificar que los componentes manejen bien la carga

#### 2.3 Testing de productos dinámicos
- [X] Verificar carga de productos desde API en página principal
- [X] Verificar filtros por categoría en tienda ✅ **CORREGIDO** - CategoryDropdown y TiendaPage ahora usan categorías reales de API
- [X] Verificar búsqueda de productos ✅ **CORREGIDO** - Implementado filtrado local (backend no filtra correctamente)
- [X] Verificar paginación ✅ **FUNCIONA** - API maneja paginación correctamente

**🛠️ CORRECCIONES REALIZADAS EN FASE 2:**
1. **CategoryDropdown**: Eliminadas categorías mock hardcodeadas
2. **TiendaPage**: Reemplazadas `CATEGORIAS_DISPONIBLES` por fetch directo de API
3. **Conteo de categorías**: Implementado conteo dinámico via llamadas específicas a API
4. **Filtros**: Corregido filtro por ID de categoría en lugar de nombre
5. **Hook useCategorias**: Problema identificado, temporalmente reemplazado por fetch directo
6. **Búsqueda de productos**: Implementado filtrado local (backend no filtra parámetro search)
7. **Logs limpios**: Comentados logs de debug para producción

**⚠️ NOTAS TÉCNICAS:**
- Hook `useCategorias` presenta problemas de ejecución (se queda en loading infinito)
- Solución temporal implementada: fetch directo en TiendaPage 
- Categorías ahora se cargan correctamente desde la API real
- **Búsqueda**: Backend no filtra correctamente el parámetro `search`, implementado filtrado local
- Filtros y conteo funcionan con datos reales de BD

---

### **FASE 3: Verificar TODAS las Funcionalidades con API Real**
*Duración estimada: 45 minutos*

#### 3.1 Testing de funcionalidades básicas
- [ ] **Homepage**: Productos cargando desde API en sección principal
- [ ] **Tienda**: Productos cargando desde API en página completa
- [ ] **ProductCard**: Mostrar stock real de la base de datos
- [ ] **ProductGrid**: Grid responsivo funcionando con productos de API

#### 3.2 Testing de funcionalidades avanzadas del carrito
- [ ] **MiniCart en header**: Contador y total con productos de API
- [ ] **Agregar al carrito**: Desde ProductCard con productos de la base de datos
- [ ] **Modal de detalles**: ProductPreviewModal con datos reales
- [ ] **Página de carrito completa**: CartPage con productos de API
- [ ] **Control de cantidades**: Botones +/- funcionando con stock real
- [ ] **Eliminación de productos**: Del carrito con restauración de stock
- [ ] **Cálculo de totales**: Precios reales de la base de datos

#### 3.3 Testing de filtros y búsqueda avanzada
- [ ] **CategoryDropdown**: Filtrar por categorías de la API
- [ ] **Búsqueda en tiempo real**: Buscar productos en la base de datos
- [ ] **Contador de productos por categoría**: Desde API
- [ ] **Filtros combinados**: Categoría + búsqueda funcionando juntos
- [ ] **Limpiar filtros**: Restablecer vista a todos los productos

#### 3.4 Testing de gestión de inventario
- [ ] **Sistema de stock**: Inventario sincronizado con productos de API
- [ ] **Panel de admin**: AdminInventario con productos de la base de datos
- [ ] **Verificación de stock**: Al agregar productos al carrito
- [ ] **Alertas de stock bajo**: Con datos reales de stock
- [ ] **Persistencia**: Inventario guardado en localStorage pero con datos de API

---

### **FASE 4: Testing Específico de Funcionalidades Premium**
*Duración estimada: 30 minutos*

#### 4.1 Modal de detalles de producto (ProductPreviewModal)
- [ ] **Abrir modal**: Desde botón "Ver detalles" en ProductCard
- [ ] **Información completa**: Datos del producto desde API (descripción, precio, stock)
- [ ] **Especificaciones**: Beneficios e ingredientes si están disponibles
- [ ] **Control de cantidad**: Selector de cantidad respetando stock real
- [ ] **Agregar al carrito**: Desde el modal con productos de la base de datos
- [ ] **Imágenes**: Carga correcta de imágenes de productos
- [ ] **Breadcrumbs**: Navegación con categoría real del producto

#### 4.2 Filtros y búsqueda avanzada
- [ ] **CategoryDropdown hover**: Animaciones y efectos visuales
- [ ] **Contador por categoría**: Número real de productos por categoría desde API
- [ ] **Búsqueda instantánea**: Resultados en tiempo real desde base de datos
- [ ] **Combinación de filtros**: Categoría + búsqueda + stock disponible
- [ ] **Resultados vacíos**: Mensajes apropiados cuando no hay productos
- [ ] **Performance**: Búsqueda rápida sin lag

#### 4.3 Sistema de carrito avanzado
- [ ] **MiniCart responsive**: Vista móvil y desktop con datos reales
- [ ] **Página de carrito completa**: Diseño profesional con productos de API
- [ ] **Control de stock en tiempo real**: Verificación con base de datos
- [ ] **Notificaciones toast**: Mensajes profesionales al agregar/quitar
- [ ] **Persistencia inteligente**: Carrito guardado pero validado con API
- [ ] **Cálculos precisos**: Totales correctos con precios de la base de datos

#### 4.4 Panel de administración (BONUS)
- [ ] **AdminInventario**: Funcionando con productos de la API
- [ ] **Edición de stock**: Actualización en localStorage (simular API)
- [ ] **Filtros admin**: Por categoría y stock bajo con datos reales
- [ ] **Sincronización**: Cambios reflejados inmediatamente en tienda

---

### **FASE 5: Optimización y Configuración Final**
*Duración estimada: 20 minutos*

#### 5.1 Configurar modo híbrido inteligente
- [ ] Implementar sistema de fallback automático (API → mock)
- [ ] Configurar logs para identificar cuando se usa API vs mock
- [ ] Agregar indicadores visuales del estado de conexión
- [ ] Testing de reconexión automática

#### 5.2 Optimización de rendimiento
- [ ] **Carga de imágenes**: Lazy loading y fallbacks
- [ ] **Caché inteligente**: React Query para productos frecuentes
- [ ] **Debounce en búsqueda**: Evitar múltiples requests
- [ ] **Loading states**: Skeleton loaders profesionales

#### 5.3 Configuración para desarrollo vs producción
- [ ] Variables de entorno para diferentes entornos
- [ ] Configuración de URL de API para producción
- [ ] Documentación de configuración
- [ ] Testing en modo producción

---

### **FASE 6: Verificación Final y Documentación**
*Duración estimada: 15 minutos*

#### 6.1 Testing completo de TODAS las funcionalidades
- [ ] **Flujo de compra completo**: Homepage → Tienda → Modal → Carrito → Checkout
- [ ] **Testing de todas las funcionalidades premium**:
  - [ ] Modal de detalles de producto funcionando con API
  - [ ] Filtros dropdown con categorías de la base de datos
  - [ ] Búsqueda en tiempo real desde API
  - [ ] Carrito avanzado con productos reales
  - [ ] MiniCart en header con datos de la base de datos
  - [ ] Panel de administración con inventario real
  - [ ] Notificaciones toast en todas las acciones
- [ ] **Testing de compatibilidad**: Diferentes navegadores y dispositivos
- [ ] **Testing de rendimiento**: Carga rápida y sin lag

#### 6.2 Verificación de integración completa
- [ ] **Base de datos → API → Frontend**: Flujo completo funcionando
- [ ] **Consistency checks**: Precios, stock, categorías correctas
- [ ] **Error handling**: Manejo elegante de errores de conexión
- [ ] **Fallback system**: Mock data cuando API no está disponible
- [ ] **Real-time updates**: Cambios de stock reflejados inmediatamente

#### 6.3 Documentación final
- [ ] Actualizar README con todas las funcionalidades
- [ ] Documentar variables de entorno necesarias
- [ ] Crear guía de uso para el panel de administración
- [ ] Documentar todas las funcionalidades premium implementadas
- [ ] Marcar TODAS las fases como completadas

---

## 🔧 ARCHIVOS A MODIFICAR

### **Archivos Principales (Obligatorios)**
```
📁 Raíz del proyecto
├── .env                                    ← CREAR
├── .env.example                           ← CREAR

📁 src/hooks/
├── useProductos.ts                        ← MODIFICAR (cambiar useMockData default)

📁 src/components/shop/
├── DynamicProductsSection.tsx             ← MODIFICAR (quitar useMockData: true)

📁 src/components/react/
├── TiendaPage.tsx                         ← MODIFICAR (quitar useMockData: true)
```

### **Archivos de Apoyo (Opcionales)**
```
📁 src/lib/
├── api-client.ts                          ← VERIFICAR (ya está bien)

📁 src/services/
├── productos.ts                           ← VERIFICAR (ya está bien)

📁 src/types/
├── api.ts                                 ← VERIFICAR (ya está bien)
```

---

## ⚙️ CONFIGURACIÓN NECESARIA

### **Variables de Entorno (.env)**
```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# Development Mode
VITE_USE_MOCK_DATA=false
VITE_NODE_ENV=development

# Production Configuration (para futuro)
# VITE_API_URL=https://tu-api-produccion.com
```

### **Variables de Entorno Ejemplo (.env.example)**
```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# Development Mode
VITE_USE_MOCK_DATA=false
VITE_NODE_ENV=development
```

---

## 🎯 CAMBIOS ESPECÍFICOS NECESARIOS

### **1. Hook useProductos.ts**
```typescript
// CAMBIAR ESTA LÍNEA:
useMockData?: boolean; // Por defecto usará datos mock (true)

// POR ESTA:
useMockData?: boolean; // Por defecto usará API real (false)

// Y CAMBIAR ESTA LÓGICA:
if (params.useMockData !== false) {

// POR ESTA:
if (params.useMockData === true) {
```

### **2. DynamicProductsSection.tsx**
```typescript
// CAMBIAR:
const { productos, isLoading, error } = useProductos({ 
  limit: 8,
  useMockData: true // Forzar uso de datos mock
});

// POR:
const { productos, isLoading, error } = useProductos({ 
  limit: 8
  // Sin useMockData para usar API por defecto
});
```

### **3. TiendaPage.tsx**
```typescript
// CAMBIAR:
const { productos, isLoading, error, pagination } = useProductos({
  categoria: selectedCategoryName || undefined,
  search: searchTerm,
  page: currentPage,
  limit: 12,
  useMockData: true // Forzar uso de datos mock
});

// POR:
const { productos, isLoading, error, pagination } = useProductos({
  categoria: selectedCategoryName || undefined,
  search: searchTerm,
  page: currentPage,
  limit: 12
  // Sin useMockData para usar API por defecto
});
```

---

## 🚨 PUNTOS CRÍTICOS A VERIFICAR

### **Backend debe estar funcionando**
- [ ] Puerto 3000 libre
- [ ] Base de datos conectada
- [ ] Endpoints respondiendo correctamente
- [ ] CORS configurado para puerto 4321

### **Frontend debe poder conectarse**
- [ ] Variables de entorno configuradas
- [ ] Cliente HTTP configurado correctamente
- [ ] Manejo de errores funcionando
- [ ] Fallback a mock si API falla

### **Productos compatibles**
- [ ] Estructura de productos igual entre API y mock
- [ ] Imágenes accesibles
- [ ] Precios y stock correctos
- [ ] Categorías coincidentes

---

## 🔍 COMANDOS DE TESTING

### **Backend (Terminal 1)**
```bash
cd /ruta/al/backend
npm run dev
# Debe mostrar: Server running on http://localhost:3000
```

### **Testing de API**
```bash
# Probar conexión básica
curl http://localhost:3000/health

# Probar productos
curl http://localhost:3000/api/productos

# Probar categorías
curl http://localhost:3000/api/categorias
```

### **Frontend (Terminal 2)**
```bash
cd /ruta/al/frontend
npm run dev
# Debe mostrar: Local: http://localhost:4321/
```

---

## 📊 ESTIMACIÓN TOTAL

**⏱️ Tiempo total estimado: 3 horas**
- **Fase 1**: 30 minutos (Configuración del entorno)
- **Fase 2**: 45 minutos (Restaurar conexión API)
- **Fase 3**: 45 minutos (Testing de TODAS las funcionalidades)
- **Fase 4**: 30 minutos (Testing funcionalidades premium)
- **Fase 5**: 20 minutos (Optimización)
- **Fase 6**: 20 minutos (Testing final y documentación)

---

## ✅ CHECKLIST DE ÉXITO

### **Al finalizar deberías tener TODAS estas funcionalidades con datos de la base de datos:**

#### 🏪 **Tienda y Productos**
- [ ] ✅ Productos cargando desde base de datos en homepage
- [ ] ✅ Productos cargando desde base de datos en página de tienda
- [ ] ✅ ProductCard mostrando información real (stock, precios, imágenes)
- [ ] ✅ ProductGrid responsivo con productos de la API

#### 🔍 **Búsqueda y Filtros**
- [ ] ✅ CategoryDropdown con categorías de la base de datos
- [ ] ✅ Filtros por categoría funcionando con API
- [ ] ✅ Búsqueda de productos en tiempo real desde base de datos
- [ ] ✅ Contador de productos por categoría (números reales)
- [ ] ✅ Combinación de filtros funcionando perfectamente

#### 🛒 **Sistema de Carrito Avanzado**
- [ ] ✅ MiniCart en header con productos de la base de datos
- [ ] ✅ Carrito funcionando con productos reales de la API
- [ ] ✅ Control de cantidades con stock real de la base de datos
- [ ] ✅ Cálculos de totales con precios reales
- [ ] ✅ Página de carrito completa (CartPage) con productos de API
- [ ] ✅ Persistencia en localStorage pero validada con base de datos

#### 🔧 **Funcionalidades Premium**
- [ ] ✅ Modal de detalles (ProductPreviewModal) con datos reales
- [ ] ✅ Sistema de inventario sincronizado con API
- [ ] ✅ Panel de administración (AdminInventario) con productos reales
- [ ] ✅ Notificaciones toast profesionales en todas las acciones
- [ ] ✅ Stock sincronizado entre carrito e inventario
- [ ] ✅ Responsive design perfecto en móviles y desktop

#### 🔄 **Sistema Híbrido**
- [ ] ✅ Conexión prioritaria con API de la base de datos
- [ ] ✅ Fallback automático a mock data si API no está disponible
- [ ] ✅ Logs claros que indican qué fuente de datos se está usando
- [ ] ✅ Reconexión automática cuando API vuelve a estar disponible

### **Señales de que TODAS las funcionalidades están trabajando correctamente:**
- [ ] 🟢 **API Connection**: Console logs "API Response: 200 /api/productos"
- [ ] 🟢 **Productos reales**: IDs numéricos, precios y stock de la base de datos
- [ ] 🟢 **Imágenes**: Cargando correctamente desde rutas reales
- [ ] 🟢 **Filtros dinámicos**: Categorías obtenidas desde API
- [ ] 🟢 **Búsqueda funcional**: Resultados en tiempo real desde base de datos
- [ ] 🟢 **Modal de detalles**: Abre con información completa y real
- [ ] 🟢 **Carrito avanzado**: Todas las funciones (agregar, quitar, cambiar cantidad)
- [ ] 🟢 **Stock real**: Se actualiza en tiempo real al usar el carrito
- [ ] 🟢 **Totales correctos**: Cálculos precisos con precios de la base de datos
- [ ] 🟢 **Panel admin**: Funciona con productos reales de la API
- [ ] 🟢 **Responsive**: Perfecto en móviles, tablets y desktop
- [ ] 🟢 **Notificaciones**: Toast messages profesionales en todas las acciones

### **Señales de problemas:**
- [ ] 🔴 **Connection errors**: "ECONNREFUSED" o "Network Error" persistentes
- [ ] 🔴 **Productos mock**: IDs como strings o datos hardcodeados
- [ ] 🔴 **Categorías estáticas**: Lista fija no obtenida desde API
- [ ] 🔴 **Stock desincronizado**: No se actualiza o valores incorrectos
- [ ] 🔴 **Modal vacío**: No carga información o muestra datos genéricos
- [ ] 🔴 **Carrito desconectado**: No respeta stock real o precios incorrectos

---

## 🚀 SIGUIENTES PASOS

### **Una vez restaurada TODA la funcionalidad:**
1. **Testing exhaustivo** de todas las funcionalidades premium
2. **Optimización de rendimiento** para cargas rápidas
3. **Deploy del backend** a producción 
4. **Configuración de variables de entorno** para producción
5. **Documentación completa** de todas las funcionalidades implementadas
6. **Capacitación** sobre el panel de administración
7. **Backup** del proyecto funcionando completamente

### **Funcionalidades que quedarán listas para usar:**
- ✅ **Tienda completa** con productos dinámicos de la base de datos
- ✅ **Sistema de búsqueda y filtros** profesional
- ✅ **Carrito de compras avanzado** con todas las funciones
- ✅ **Modal de detalles** con información completa
- ✅ **Panel de administración** para gestión de inventario
- ✅ **Sistema responsive** perfecto para móviles
- ✅ **Notificaciones elegantes** en toda la experiencia
- ✅ **Sistema híbrido** con fallback inteligente

---

*Guía actualizada el 9 de septiembre de 2025*
*Estado: ⏳ Pendiente de implementación*

**💡 Nota Importante:** Esta guía está diseñada para **MANTENER TODO el excelente trabajo de tu compañero** mientras restaura la conexión con tu base de datos. Al final tendrás una tienda completamente funcional con todas las funcionalidades premium conectadas a datos reales.

**🎯 Objetivo:** Combinar lo mejor de ambos mundos - tu backend sólido + las funcionalidades premium de tu compañero = Una tienda profesional completa.
