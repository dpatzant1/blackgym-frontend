import React from 'react';

interface PaymentResultProps {
  isSuccess: boolean;
  amount: string;
  cardNumber: string;
  transactionId?: string;
  errorMessage?: string;
  onClose: () => void;
  onRetry?: () => void;
}

const PaymentResult: React.FC<PaymentResultProps> = ({
  isSuccess,
  amount,
  cardNumber,
  transactionId,
  errorMessage,
  onClose,
  onRetry
}) => {
  const maskedCardNumber = cardNumber.length >= 4 
    ? '**** **** **** ' + cardNumber.slice(-4)
    : cardNumber;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 border border-green-500/20">
        {isSuccess ? (
          /* Pago Exitoso */
          <>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <i className="fas fa-check text-black text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">¡Pago Exitoso!</h3>
              <p className="text-gray-400">Tu transacción ha sido procesada correctamente</p>
            </div>

            {/* Detalles de la transacción */}
            <div className="bg-black rounded-lg p-4 mb-6 border border-green-500/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Monto pagado:</span>
                <span className="text-green-500 font-bold text-lg">{amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tarjeta:</span>
                <span className="text-white font-mono">{maskedCardNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">ID Transacción:</span>
                <span className="text-white font-mono text-sm">{transactionId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fecha:</span>
                <span className="text-white">{new Date().toLocaleDateString('es-GT')}</span>
              </div>
            </div>

            {/* Mensaje de confirmación */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <i className="fas fa-info-circle text-green-500 mt-1"></i>
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Pago confirmado</p>
                  <p className="text-gray-300">
                    Recibirás un email de confirmación con los detalles de tu pedido.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-500 to-green-400 text-black py-3 px-6 rounded-lg font-semibold hover:from-green-400 hover:to-green-300 transition-all"
            >
              <i className="fas fa-check mr-2"></i>
              Continuar
            </button>
          </>
        ) : (
          /* Pago Fallido */
          <>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-times text-red-500 text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pago Rechazado</h3>
              <p className="text-gray-400">No se pudo procesar tu transacción</p>
            </div>

            {/* Detalles del error */}
            <div className="bg-black rounded-lg p-4 mb-6 border border-red-500/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Monto:</span>
                <span className="text-white font-bold">{amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tarjeta:</span>
                <span className="text-white font-mono">{maskedCardNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Motivo:</span>
                <span className="text-red-400">{errorMessage || 'Fondos insuficientes'}</span>
              </div>
            </div>

            {/* Sugerencias */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <i className="fas fa-lightbulb text-yellow-500 mt-1"></i>
                <div className="text-sm">
                  <p className="text-white font-medium mb-2">Sugerencias:</p>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Verifica los datos de tu tarjeta</li>
                    <li>• Asegúrate de tener fondos suficientes</li>
                    <li>• Contacta a tu banco si el problema persiste</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-400 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-400 hover:to-blue-300 transition-all"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Reintentar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
