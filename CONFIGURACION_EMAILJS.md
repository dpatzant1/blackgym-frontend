# 📧 CONFIGURACIÓN EmailJS - Solución Gratuita para Emails

## 🎯 Por qué EmailJS

Web3Forms tiene limitaciones en su plan gratuito para emails transaccionales. **EmailJS es completamente gratuito** y perfecto para confirmaciones de compra.

## ⚡ Configuración EmailJS (Paso a paso)

### 1️⃣ Crear Cuenta en EmailJS

1. Ve a [https://www.emailjs.com](https://www.emailjs.com)
2. Regístrate gratis con tu email `patzanluis474@gmail.com`
3. Confirma tu email

### 2️⃣ Conectar tu Gmail

1. En el Dashboard de EmailJS → **Email Services**
2. Click **Add New Service**
3. Selecciona **Gmail** 
4. Autoriza tu cuenta `patzanluis474@gmail.com`
5. **Copia el Service ID** (ejemplo: `service_abc123`) service_9vl1dyx

### 3️⃣ Crear Template de Email

1. Ve a **Email Templates** → **Create New Template**
2. Usa este template (copia y pega):

```html
<h2>🛍️ Nueva Orden - BLACK GYM</h2>

<p><strong>Número de Orden:</strong> {{order_number}}</p>
<p><strong>Fecha:</strong> {{order_date}}</p>

<h3>👤 INFORMACIÓN DEL CLIENTE</h3>
<p><strong>Nombre:</strong> {{customer_name}}</p>
<p><strong>Teléfono:</strong> {{customer_phone}}</p>
<p><strong>Dirección:</strong> {{customer_address}}</p>
<p><strong>Ciudad:</strong> {{customer_city}}</p>
<p><strong>Departamento:</strong> {{customer_department}}</p>

<h3>🛒 PRODUCTOS ORDENADOS</h3>
<pre>{{products_list}}</pre>

<h3>💰 TOTAL</h3>
<p><strong>{{total_amount}}</strong></p>

<hr>
<p>{{message}}</p>

<p><em>Email enviado automáticamente por el sistema BLACK GYM</em></p>
```

3. **Settings del Template:**
   - **To Email:** `{{to_email}}`
   - **From Name:** `{{from_name}}`
   - **Subject:** `{{subject}}`

4. **Copia el Template ID** (ejemplo: `template_xyz789`) template_ewrt4yl

### 4️⃣ Obtener Public Key

1. Ve a **Account** → **General**
2. **Copia tu Public Key** (ejemplo: `user_def456`)

### 5️⃣ Configurar Variables de Entorno

Actualiza tu archivo `.env`:

```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=user_def456
```

### 6️⃣ Configurar Email de Destino

En el template, asegúrate que **To Email** esté configurado como:
- `{{to_email}}` (dinámico desde el código)
- O directamente: `patzanluis474@gmail.com`

## ✅ Límites Gratuitos de EmailJS

- **200 emails/mes** gratis
- Sin restricciones de contenido
- Perfecto para confirmaciones de compra
- No requiere tarjeta de crédito

## 🧪 Prueba Rápida

1. Configura las 3 variables en `.env`
2. Reinicia el servidor: `npm run dev`
3. Haz una compra de prueba
4. ¡El email llegará a `patzanluis474@gmail.com`!

## 🎉 Ventajas sobre Web3Forms

✅ **Completamente gratuito** para emails transaccionales  
✅ **Personalización total** del contenido  
✅ **200 emails/mes** incluidos  
✅ **Integración directa** con Gmail  
✅ **Templates profesionales** con HTML  
✅ **Sin limitaciones** de uso  

## 📞 Soporte

Si tienes problemas:
1. Verifica que las 3 variables estén correctas
2. Revisa los logs en la consola del navegador
3. Asegúrate que el template tenga los campos correctos

**EmailJS es la solución perfecta para BLACK GYM** 🚀
