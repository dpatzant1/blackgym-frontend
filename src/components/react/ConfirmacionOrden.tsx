import React, { useState, useEffect } from 'react';
import { getOrden } from '../../services/ordenes';
import type { Orden } from '../../types/api';
import toast from 'react-hot-toast';

interface ConfirmacionOrdenProps {
  ordenId: string | null;
}

const ConfirmacionOrden: React.FC<ConfirmacionOrdenProps> = ({ ordenId }) => {
  const [orden, setOrden] = useState<Orden | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de la orden
  useEffect(() => {
    const cargarOrden = async () => {
      if (!ordenId) {
        setError('ID de orden no válido');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const ordenData = await getOrden(parseInt(ordenId));
        setOrden(ordenData);
      } catch (error) {
        setError('No se pudo cargar la información de la orden');
        toast.error('Error al cargar los detalles de la orden');
      } finally {
        setIsLoading(false);
      }
    };

    cargarOrden();
  }, [ordenId]);

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(price);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neon-green border-t-transparent mb-4"></div>
        <h2 className="text-xl font-semibold text-text-light">Cargando detalles de tu orden...</h2>
      </div>
    );
  }

  // Estado de error
  if (error || !orden) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
        <h2 className="text-2xl font-bold text-text-light mb-4">Error al cargar la orden</h2>
        <p className="text-light-gray mb-6">{error || 'No se encontró la orden especificada'}</p>
        <div className="space-x-4">
          <a 
            href="/tienda" 
            className="inline-block bg-neon-green text-primary-black px-6 py-3 rounded-lg font-semibold hover:bg-neon-green/90 transition-colors"
          >
            Volver a la Tienda
          </a>
          <a 
            href="/carrito" 
            className="inline-block bg-secondary-black text-text-light px-6 py-3 rounded-lg font-semibold border border-neon-green/30 hover:border-neon-green transition-colors"
          >
            Ver Carrito
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header de éxito */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-neon-green/20 rounded-full mb-6 success-animation">
          <i className="fas fa-check-circle text-4xl text-neon-green"></i>
        </div>
        <h1 className="text-4xl font-bold text-text-light mb-4">
          ¡Orden <span className="text-neon-green">Confirmada</span>!
        </h1>
        <p className="text-light-gray text-lg max-w-2xl mx-auto">
          Tu pedido ha sido procesado exitosamente. Te contactaremos pronto para coordinar la entrega.
        </p>
      </div>

      {/* Información de la orden */}
      <div className="bg-secondary-black rounded-lg p-6 shadow-lg border border-neon-green/20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Detalles de la orden */}
          <div>
            <h2 className="text-xl font-bold text-text-light mb-4 flex items-center">
              <i className="fas fa-receipt text-neon-green mr-3"></i>
              Detalles de la Orden
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-light-gray">Número de Orden:</span>
                <span className="text-neon-green font-bold">#{orden.id.toString().padStart(6, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-gray">Fecha:</span>
                <span className="text-text-light">{formatDate(orden.fecha)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-gray">Total:</span>
                <span className="text-neon-green font-bold text-lg">{formatPrice(orden.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-gray">Estado:</span>
                <span className="bg-neon-green/20 text-neon-green px-3 py-1 rounded-full text-sm font-medium">
                  Procesando
                </span>
              </div>
            </div>
          </div>

          {/* Información de envío */}
          <div>
            <h2 className="text-xl font-bold text-text-light mb-4 flex items-center">
              <i className="fas fa-shipping-fast text-neon-green mr-3"></i>
              Información de Envío
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-light-gray block">Cliente:</span>
                <span className="text-text-light font-medium">{orden.cliente}</span>
              </div>
              <div>
                <span className="text-light-gray block">Teléfono:</span>
                <span className="text-text-light">{orden.telefono}</span>
              </div>
              <div>
                <span className="text-light-gray block">Dirección:</span>
                <span className="text-text-light">{orden.direccion}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Próximos pasos */}
      <div className="bg-secondary-black rounded-lg p-6 shadow-lg border border-neon-green/20">
        <h2 className="text-xl font-bold text-text-light mb-4 flex items-center">
          <i className="fas fa-list-ol text-neon-green mr-3"></i>
          Próximos Pasos
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-primary-black rounded-lg border border-neon-green/10">
            <i className="fas fa-phone text-neon-green text-2xl mb-3"></i>
            <h3 className="text-text-light font-semibold mb-2">1. Confirmación</h3>
            <p className="text-light-gray text-sm">
              Te contactaremos en las próximas 2 horas para confirmar tu pedido
            </p>
          </div>
          <div className="text-center p-4 bg-primary-black rounded-lg border border-neon-green/10">
            <i className="fas fa-box text-neon-green text-2xl mb-3"></i>
            <h3 className="text-text-light font-semibold mb-2">2. Preparación</h3>
            <p className="text-light-gray text-sm">
              Preparamos tu pedido con el mayor cuidado y calidad
            </p>
          </div>
          <div className="text-center p-4 bg-primary-black rounded-lg border border-neon-green/10">
            <i className="fas fa-truck text-neon-green text-2xl mb-3"></i>
            <h3 className="text-text-light font-semibold mb-2">3. Entrega</h3>
            <p className="text-light-gray text-sm">
              Coordinamos la entrega en tu dirección en 1-3 días hábiles
            </p>
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="bg-gradient-to-r from-neon-green/10 to-secondary-black rounded-lg p-6 border border-neon-green/20">
        <div className="text-center">
          <h2 className="text-xl font-bold text-text-light mb-4">
            ¿Tienes alguna pregunta sobre tu orden?
          </h2>
          <p className="text-light-gray mb-6">
            Nuestro equipo está listo para ayudarte con cualquier consulta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`https://wa.me/50212345678?text=Hola,%20tengo%20una%20consulta%20sobre%20mi%20orden%20#${orden.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <i className="fab fa-whatsapp mr-2 text-lg"></i>
              WhatsApp
            </a>
            <a 
              href="tel:+50212345678"
              className="inline-flex items-center justify-center bg-neon-green text-primary-black px-6 py-3 rounded-lg font-semibold hover:bg-neon-green/90 transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>
              Llamar Ahora
            </a>
          </div>
        </div>
      </div>

      {/* Acciones adicionales */}
      <div className="text-center space-x-4">
        <a 
          href="/tienda" 
          className="inline-block bg-neon-green text-primary-black px-8 py-3 rounded-lg font-semibold hover:bg-neon-green/90 transition-colors"
        >
          <i className="fas fa-shopping-bag mr-2"></i>
          Seguir Comprando
        </a>
        <button 
          onClick={() => window.print()}
          className="inline-block bg-secondary-black text-text-light px-8 py-3 rounded-lg font-semibold border border-neon-green/30 hover:border-neon-green transition-colors"
        >
          <i className="fas fa-print mr-2"></i>
          Imprimir Orden
        </button>
      </div>

      {/* Mensaje adicional */}
      <div className="text-center p-4 bg-primary-black rounded-lg border border-neon-green/10">
        <p className="text-light-gray text-sm">
          <i className="fas fa-info-circle text-neon-green mr-2"></i>
          Guarda este número de orden: <strong className="text-neon-green">#{orden?.id.toString().padStart(6, '0')}</strong> para futuras referencias
        </p>
      </div>
    </div>
  );
};

export default ConfirmacionOrden;
