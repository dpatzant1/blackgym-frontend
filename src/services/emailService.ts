// Servicio para notificaciones por email usando EmailJS SDK
import emailjs from '@emailjs/browser';
import type { Orden, OrdenCreate } from '../types/api';

// Configuración hardcodeada de EmailJS
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_9vl1dyx',
  TEMPLATE_ID: 'template_ewrt4yl',
  PUBLIC_KEY: '4z8qS_anG3ie06LQi',
  PRIVATE_KEY: 'AGdGYYtO9sQcg4VCUc296'
};

// Variable para controlar si EmailJS ya fue inicializado
let emailJSInitialized = false;

// Función para inicializar EmailJS
const initEmailJS = () => {
  if (emailJSInitialized) return true;
  
  try {
    emailjs.init({
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
      blockHeadless: true,
      limitRate: {
        id: 'blackgym-app',
        throttle: 5000, // 5 segundos entre emails
      },
    });
    emailJSInitialized = true;
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar EmailJS:', error);
    return false;
  }
};

// Inicializar EmailJS inmediatamente
initEmailJS();

// Interfaz para los parámetros del template
interface TemplateParams extends Record<string, unknown> {
  to_email: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_department: string;
  order_date: string;
  products_list: string;
  total_amount: string;
  message: string;
}

// Función para formatear productos para el email
const formatProductosParaEmail = (productos: Array<{ id: number; nombre: string; precio: number; cantidad: number }>): string => {
  if (!productos || productos.length === 0) {
    return 'No hay productos en esta orden.';
  }

  return productos
    .map(producto => `• ${producto.nombre} - Cantidad: ${producto.cantidad} - Q${producto.precio.toFixed(2)} c/u`)
    .join('\n');
};

// Función para enviar notificación de nueva orden
export const enviarNotificacionOrden = async (
  ordenCreada: Orden, 
  datosOriginales: OrdenCreate,
  productosDetalles: Array<{ id: number; nombre: string; precio: number; cantidad: number }>,
  emailCliente: string
): Promise<boolean> => {
  try {
    // Formatear los productos para el email
    const productosFormateados = formatProductosParaEmail(productosDetalles);
    
    // Crear mensaje personalizado
    const mensajeCompleto = `¡Hola ${ordenCreada.cliente}!

Gracias por tu compra en BLACK GYM. Tu orden ha sido procesada exitosamente.

📞 Si tienes preguntas, contáctanos:
• Email: info@blackgym.com  
• Teléfono: +502 2234-5678

¡Gracias por elegir BLACK GYM! 💪`;

    const templateParams: TemplateParams = {
      to_email: emailCliente,
      order_number: `${ordenCreada.id}`,
      customer_name: ordenCreada.cliente,
      customer_phone: ordenCreada.telefono,
      customer_address: ordenCreada.direccion,
      customer_city: datosOriginales.ciudad || 'No especificada',
      customer_department: datosOriginales.departamento || 'No especificado',
      order_date: new Date(ordenCreada.fecha || new Date()).toLocaleDateString('es-GT'),
      products_list: productosFormateados,
      total_amount: `Q${Number(ordenCreada.total || 0).toFixed(2)}`,
      message: mensajeCompleto
    };

    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID, 
      EMAILJS_CONFIG.TEMPLATE_ID, 
      templateParams
    );

    return true;

  } catch (error) {
    console.error('❌ Error al enviar notificación por email:', error);
    return false;
  }
};