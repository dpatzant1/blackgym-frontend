import React, { useState, useEffect } from 'react';
import { useCart } from '../../stores/cartStore';
import type { OrdenCreate } from '../../types/api';
import { createOrden } from '../../services/ordenes';
import { enviarNotificacionOrden } from '../../services/emailService';
import toast from 'react-hot-toast';
import DynamicProductImage from './DynamicProductImage';
import PaymentForm from './PaymentForm';
import PaymentProcessing from './PaymentProcessing';
import PaymentResult from './PaymentResult';

// Tipos para el formulario
interface FormData {
  cliente: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  codigoPostal: string;
  notas: string;
}

interface FormErrors {
  cliente?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
}

type PaymentStep = 'form' | 'payment' | 'processing' | 'result';

interface PaymentState {
  step: PaymentStep;
  cardNumber: string;
  transactionId: string;
  isSuccess: boolean;
  errorMessage: string;
}

const CheckoutForm: React.FC = () => {
  const { items, total, clearCart, isEmpty, formattedTotal, hasHydrated } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    cliente: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    codigoPostal: '',
    notas: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentState, setPaymentState] = useState<PaymentState>({
    step: 'form',
    cardNumber: '',
    transactionId: '',
    isSuccess: false,
    errorMessage: ''
  });

  // Redireccionar si el carrito está vacío (solo después de hidratación)
  useEffect(() => {
    if (hasHydrated && isEmpty) {
      toast.error('Tu carrito está vacío');
      setTimeout(() => {
        window.location.href = '/tienda';
      }, 1500);
    }
  }, [isEmpty, hasHydrated]);

  // Fallback: Si no se hidrata en 2 segundos, proceder de todos modos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasHydrated) {
        // fallback: continuar aunque no haya hidratado
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasHydrated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.cliente.trim()) {
      newErrors.cliente = 'El nombre es requerido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{8,15}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Teléfono debe tener entre 8 y 15 dígitos';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    }

    if (!formData.departamento.trim()) {
      newErrors.departamento = 'El departamento es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    if (isEmpty) {
      toast.error('El carrito está vacío');
      return;
    }

    // Proceder al paso de pago
    setPaymentState(prev => ({ ...prev, step: 'payment' }));
  };

  const handlePaymentSuccess = async (cardNumber: string) => {
    setPaymentState(prev => ({ 
      ...prev, 
      step: 'processing',
      cardNumber: cardNumber
    }));

    // Simular procesamiento
    setTimeout(async () => {
      try {
        // Generar ID de transacción simulado
        const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        // Preparar datos de la orden
        const orderData: OrdenCreate = {
          cliente: formData.cliente,
          telefono: formData.telefono,
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          departamento: formData.departamento,
          codigo_postal: formData.codigoPostal,
          notas: formData.notas,
          productos: items.map(item => ({
            id: item.id,
            cantidad: item.cantidad,
            precio_unitario: item.precio
          })),
          total: total
        };

        // Crear la orden
        const newOrder = await createOrden(orderData);
        
        if (newOrder && newOrder.id) {
          // Preparar datos de productos con detalles para el email
          const productosParaEmail = items.map(item => ({
            id: item.id,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad
          }));

          // Enviar notificación por email
          try {
            const emailEnviado = await enviarNotificacionOrden(
              newOrder,
              orderData,
              productosParaEmail,
              formData.email
            );
            
            // email enviado o no: no log en producción
          } catch (emailError) {
            // silencioso: fallo al enviar email
          }

          // Pago exitoso
          setPaymentState(prev => ({
            ...prev,
            step: 'result',
            isSuccess: true,
            transactionId: transactionId
          }));
          
          toast.success('¡Pago procesado exitosamente!');
          
          // Limpiar carrito después de mostrar resultado
          setTimeout(() => {
            clearCart();
          }, 3000);
        } else {
          throw new Error('Error al crear la orden');
        }
      } catch (error) {
        setPaymentState(prev => ({
          ...prev,
          step: 'result',
          isSuccess: false,
          errorMessage: 'Error del servidor'
        }));
        toast.error('Error al procesar la orden');
      }
    }, 4000); // 4 segundos de simulación de procesamiento
  };

  const handlePaymentCancel = () => {
    setPaymentState(prev => ({ ...prev, step: 'form' }));
  };

  const handlePaymentResultClose = () => {
    if (paymentState.isSuccess) {
      // Redireccionar a página de confirmación o tienda
      window.location.href = '/tienda';
    } else {
      // Volver al formulario de pago
      setPaymentState(prev => ({ ...prev, step: 'payment' }));
    }
  };

  const handlePaymentRetry = () => {
    setPaymentState(prev => ({ ...prev, step: 'payment' }));
  };

  // Loading state mientras se hidrata el carrito
  if (!hasHydrated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="text-gray-400">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  // Estado de carga durante el procesamiento
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="text-white mb-4">Procesando tu orden...</p>
          <p className="text-gray-400 text-sm">Por favor no cierres esta ventana</p>
        </div>
      </div>
    );
  }

  // Mensaje de carrito vacío
  if (isEmpty) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <i className="fas fa-shopping-cart text-gray-400 text-6xl mb-4"></i>
          <h2 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-400 mb-8">Agrega algunos productos antes de proceder al checkout</p>
          <a
            href="/tienda"
            className="inline-block bg-gradient-to-r from-green-500 to-green-400 text-black px-8 py-3 rounded-lg font-semibold hover:from-green-400 hover:to-green-300 transition-all"
          >
            Ir a la Tienda
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulario de datos del cliente */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-green-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-user-edit text-green-500 mr-3"></i>
              Datos de Envío
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cliente" className="block text-white font-medium mb-2">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cliente"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-black border ${
                      errors.cliente ? 'border-red-500' : 'border-green-500/30'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors`}
                    placeholder="Tu nombre completo"
                  />
                  {errors.cliente && (
                    <p className="mt-1 text-sm text-red-500">{errors.cliente}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-white font-medium mb-2">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-black border ${
                      errors.telefono ? 'border-red-500' : 'border-green-500/30'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors`}
                    placeholder="Número de teléfono"
                  />
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-500">{errors.telefono}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-black border ${
                      errors.email ? 'border-red-500' : 'border-green-500/30'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors`}
                    placeholder="Correo electrónico"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label htmlFor="direccion" className="block text-white font-medium mb-2">
                  Dirección Completa <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 bg-black border ${
                    errors.direccion ? 'border-red-500' : 'border-green-500/30'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none`}
                  placeholder="Calle, número, colonia, referencias..."
                />
                {errors.direccion && (
                  <p className="mt-1 text-sm text-red-500">{errors.direccion}</p>
                )}
              </div>

              {/* Ubicación */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ciudad" className="block text-white font-medium mb-2">
                    Ciudad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-black border ${
                      errors.ciudad ? 'border-red-500' : 'border-green-500/30'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors`}
                    placeholder="Tu ciudad"
                  />
                  {errors.ciudad && (
                    <p className="mt-1 text-sm text-red-500">{errors.ciudad}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="departamento" className="block text-white font-medium mb-2">
                    Departamento <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="departamento"
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-black border ${
                      errors.departamento ? 'border-red-500' : 'border-green-500/30'
                    } rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors`}
                  >
                    <option value="">Selecciona departamento</option>
                    <option value="Alta Verapaz">Alta Verapaz</option>
                    <option value="Baja Verapaz">Baja Verapaz</option>
                    <option value="Chimaltenango">Chimaltenango</option>
                    <option value="Chiquimula">Chiquimula</option>
                    <option value="El Progreso">El Progreso</option>
                    <option value="Escuintla">Escuintla</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Huehuetenango">Huehuetenango</option>
                    <option value="Izabal">Izabal</option>
                    <option value="Jalapa">Jalapa</option>
                    <option value="Jutiapa">Jutiapa</option>
                    <option value="Petén">Petén</option>
                    <option value="Quetzaltenango">Quetzaltenango</option>
                    <option value="Quiché">Quiché</option>
                    <option value="Retalhuleu">Retalhuleu</option>
                    <option value="Sacatepéquez">Sacatepéquez</option>
                    <option value="San Marcos">San Marcos</option>
                    <option value="Santa Rosa">Santa Rosa</option>
                    <option value="Sololá">Sololá</option>
                    <option value="Suchitepéquez">Suchitepéquez</option>
                    <option value="Totonicapán">Totonicapán</option>
                    <option value="Zacapa">Zacapa</option>
                  </select>
                  {errors.departamento && (
                    <p className="mt-1 text-sm text-red-500">{errors.departamento}</p>
                  )}
                </div>
              </div>

              {/* Campos opcionales */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="codigoPostal" className="block text-white font-medium mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Código postal (opcional)"
                  />
                </div>

                <div>
                  <label htmlFor="notas" className="block text-white font-medium mb-2">
                    Notas Adicionales
                  </label>
                  <input
                    type="text"
                    id="notas"
                    name="notas"
                    value={formData.notas}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Instrucciones especiales (opcional)"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Resumen de la orden */}
          <div className="lg:col-span-1 box-border overflow-hidden">
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-green-500/20 sticky top-8 w-full box-border overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-shopping-bag text-green-500 mr-3"></i>
              Resumen de Orden
            </h3>

            {/* Lista de productos */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-black rounded-lg border border-green-500/10">
                  <div className="w-12 h-12 rounded border border-green-500/20 overflow-hidden">
                    <DynamicProductImage
                      productId={item.id}
                      productName={item.nombre}
                      className="w-full h-full object-cover"
                      fallbackImage="/equipos-gimnasio-profesionales.webp"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{item.nombre}</h4>
                    <p className="text-xs text-gray-400">
                      Cantidad: {item.cantidad} × Q{Number(item.precio || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-green-500">
                    Q{Number((item.precio || 0) * (item.cantidad || 0)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-green-500/20 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total:</span>
                <span className="text-xl font-bold text-green-500">{formattedTotal}</span>
              </div>
            </div>

            {/* Botón de proceder al pago */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || isEmpty}
              className="w-full bg-gradient-to-r from-green-500 to-green-400 text-black py-3 px-6 rounded-lg font-semibold hover:from-green-400 hover:to-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <i className="fas fa-credit-card mr-2"></i>
                  Proceder al Pago
                </span>
              )}
            </button>

            <div className="mt-4 text-xs text-gray-400 text-center">
              <i className="fas fa-shield-alt mr-1"></i>
              Transacción segura y protegida
            </div>
          </div>
        </div>
      </div>

      {/* Modales de pago */}
      {paymentState.step === 'payment' && (
        <PaymentForm
          total={total}
          formattedTotal={formattedTotal}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
          isProcessing={false}
        />
      )}

      {paymentState.step === 'processing' && (
        <PaymentProcessing
          amount={formattedTotal}
          cardNumber={paymentState.cardNumber}
          onSuccess={() => setPaymentState(prev => ({ ...prev, step: 'result', isSuccess: true }))}
          onError={() => setPaymentState(prev => ({ ...prev, step: 'result', isSuccess: false }))}
        />
      )}

      {paymentState.step === 'result' && (
        <PaymentResult
          isSuccess={paymentState.isSuccess}
          amount={formattedTotal}
          cardNumber={paymentState.cardNumber}
          transactionId={paymentState.transactionId}
          errorMessage={paymentState.errorMessage}
          onClose={handlePaymentResultClose}
          onRetry={handlePaymentRetry}
        />
      )}
    </div>
  );
};

export default CheckoutForm;
