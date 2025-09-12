import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface PaymentProcessingProps {
  amount: string;
  cardNumber: string;
  onSuccess: () => void;
  onError: () => void;
}

const PaymentProcessing: React.FC<PaymentProcessingProps> = ({
  amount,
  cardNumber,
  onSuccess,
  onError
}) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { text: 'Validando información de la tarjeta...', icon: 'fas fa-credit-card' },
    { text: 'Verificando fondos disponibles...', icon: 'fas fa-university' },
    { text: 'Procesando transacción...', icon: 'fas fa-sync-alt fa-spin' },
    { text: 'Confirmando pago...', icon: 'fas fa-check-circle' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          // Simular éxito del pago (95% de probabilidad)
          const isSuccess = Math.random() > 0.05;
          
          setTimeout(() => {
            if (isSuccess) {
              onSuccess();
            } else {
              onError();
            }
          }, 500);
          
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onSuccess, onError]);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepTimer);
        return prev;
      });
    }, 1500);

    return () => clearInterval(stepTimer);
  }, [steps.length]);

  const maskedCardNumber = cardNumber.length >= 4 
    ? '**** **** **** ' + cardNumber.slice(-4)
    : cardNumber;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 border border-green-500/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-credit-card text-black text-2xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Procesando Pago</h3>
          <p className="text-gray-400">No cierres esta ventana</p>
        </div>

        {/* Información del pago */}
        <div className="bg-black rounded-lg p-4 mb-6 border border-green-500/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Monto:</span>
            <span className="text-white font-bold">{amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Tarjeta:</span>
            <span className="text-white font-mono">{maskedCardNumber}</span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Pasos del procesamiento */}
        <div className="space-y-4">
          {steps.map((stepItem, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 transition-all duration-500 ${
                index <= step ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < step ? 'bg-green-500 text-black' :
                index === step ? 'bg-green-500/20 text-green-500' :
                'bg-gray-700 text-gray-400'
              }`}>
                {index < step ? (
                  <i className="fas fa-check text-sm"></i>
                ) : (
                  <i className={`${stepItem.icon} text-sm`}></i>
                )}
              </div>
              <span className={`text-sm ${
                index <= step ? 'text-white' : 'text-gray-500'
              }`}>
                {stepItem.text}
              </span>
            </div>
          ))}
        </div>

        {/* Indicador de carga */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 bg-green-500 rounded-full animate-pulse`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Mensaje de seguridad */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            <i className="fas fa-shield-alt mr-1"></i>
            Conexión segura SSL • Simulación de pago
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
