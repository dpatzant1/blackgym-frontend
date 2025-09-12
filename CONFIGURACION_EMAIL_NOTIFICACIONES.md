# Configuración de Notificaciones por Email - Web3Forms

## Descripción
El sistema de checkout de BLACK GYM utiliza Web3Forms para enviar notificaciones por email de confirmación de pedidos automáticamente después de un pago exitoso.

## Configuración

### 1. Obtener Clave de Acceso Web3Forms

1. Ve a [https://web3forms.com](https://web3forms.com)
2. Regístrate con tu email (es gratuito)
3. Crea un nuevo formulario
4. Copia tu Access Key

### 2. Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`
2. Actualiza la variable `PUBLIC_WEB3FORMS_ACCESS_KEY` con tu clave:

```bash
PUBLIC_WEB3FORMS_ACCESS_KEY=tu_clave_de_web3forms_aqui
```

### 3. Email de Destino

Por defecto, Web3Forms enviará las notificaciones al email asociado con tu cuenta de Web3Forms. Este será el email del administrador/propietario de BLACK GYM.

### 4. Funcionalidades Implementadas

✅ **Envío Automático**: El email se envía automáticamente después de cada pago exitoso
✅ **Contenido Completo**: Incluye todos los detalles de la orden:
   - Número de orden único
   - Información del cliente
   - Productos ordenados con precios
   - Total de la compra
   - Información de entrega

✅ **Diseño Profesional**: Email formateado con emojis y estructura clara
✅ **Información de Contacto**: Incluye datos de contacto de BLACK GYM
✅ **Manejo de Errores**: Si el email falla, la orden se completa de todos modos

## Ejemplo de Email Enviado

```
¡Hola [Nombre del Cliente]!

Tu orden en BLACK GYM ha sido procesada exitosamente...

🛍️ DETALLES DE TU ORDEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Número de Orden: #1234
📅 Fecha: [Fecha completa]

👤 INFORMACIÓN DE ENTREGA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Información completa del cliente]

🛒 PRODUCTOS ORDENADOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Lista detallada de productos]

💰 RESUMEN DE PAGO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: Q[Total]
Estado del pago: Completado

¡Gracias por elegir BLACK GYM! 💪
```

## Estructura del Código

- **`src/services/emailService.ts`**: Servicio principal de envío de emails
- **`src/components/react/CheckoutForm.tsx`**: Integración en el flujo de checkout
- **Integración**: El email se envía después de crear la orden exitosamente

## Logs y Debugging

El sistema incluye logs detallados en la consola:
- ✅ Email enviado exitosamente
- ⚠️ Advertencias de configuración
- ❌ Errores de envío

## Consideraciones

- **Gratuito**: Web3Forms es gratuito hasta 1000 emails/mes
- **Sin Backend**: No requiere servidor backend para emails
- **Confiable**: Service de terceros establecido y confiable
- **GDPR Compliant**: Cumple con regulaciones de privacidad
