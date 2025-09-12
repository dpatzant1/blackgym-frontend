import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface PaymentFormData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolder: string;
}

interface PaymentFormProps {
  total: number;
  formattedTotal: string;
  onPaymentSuccess: (cardNumber: string) => void;
  onCancel: () => void;
  isProcessing: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  total,
  formattedTotal,
  onPaymentSuccess,
  onCancel,
  isProcessing
}) => {
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardHolder: ''
  });
  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});

  // Formatear número de tarjeta con espacios
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Detectar tipo de tarjeta
  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    return 'unknown';
  };

  // Validar número de tarjeta usando algoritmo de Luhn
  const validateCardNumber = (number: string) => {
    const num = number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(num)) return false;
    
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i), 10);
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatear según el campo
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      if (formattedValue.replace(/\s/g, '').length > 16) return;
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'cardHolder') {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    }

    setPaymentData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name as keyof PaymentFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentFormData> = {};

    // Validar número de tarjeta
    if (!paymentData.cardNumber.trim()) {
      newErrors.cardNumber = 'El número de tarjeta es requerido';
    } else if (!validateCardNumber(paymentData.cardNumber)) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }

    // Validar titular
    if (!paymentData.cardHolder.trim()) {
      newErrors.cardHolder = 'El nombre del titular es requerido';
    } else if (paymentData.cardHolder.length < 3) {
      newErrors.cardHolder = 'Nombre demasiado corto';
    }

    // Validar mes
    if (!paymentData.expiryMonth) {
      newErrors.expiryMonth = 'Mes requerido';
    }

    // Validar año
    if (!paymentData.expiryYear) {
      newErrors.expiryYear = 'Año requerido';
    } else {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const expYear = parseInt(paymentData.expiryYear);
      const expMonth = parseInt(paymentData.expiryMonth);
      
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        newErrors.expiryYear = 'Tarjeta expirada';
      }
    }

    // Validar CVV
    if (!paymentData.cvv.trim()) {
      newErrors.cvv = 'CVV requerido';
    } else if (paymentData.cvv.length < 3) {
      newErrors.cvv = 'CVV debe tener al menos 3 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    // Simular procesamiento de pago
    onPaymentSuccess(paymentData.cardNumber);
  };

  const cardType = getCardType(paymentData.cardNumber);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div className="bg-gray-900 rounded-lg p-6 border border-green-500/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <i className="fas fa-credit-card text-green-500 mr-3"></i>
            Información de Pago
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Resumen del pago */}
        <div className="bg-black rounded-lg p-4 mb-6 border border-green-500/10">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Total a pagar:</span>
            <span className="text-2xl font-bold text-green-500">{formattedTotal}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Número de tarjeta */}
          <div>
            <label htmlFor="cardNumber" className="block text-white font-medium mb-2">
              Número de Tarjeta <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black border ${
                  errors.cardNumber ? 'border-red-500' : 'border-green-500/30'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors pr-12`}
                placeholder="1234 5678 9012 3456"
                disabled={isProcessing}
              />
              {cardType !== 'unknown' && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <i className={`fab fa-cc-${cardType} text-xl ${
                    cardType === 'visa' ? 'text-blue-500' : 
                    cardType === 'mastercard' ? 'text-red-500' : 
                    'text-blue-400'
                  }`}></i>
                </div>
              )}
            </div>
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
            )}
          </div>

          {/* Titular de la tarjeta */}
          <div>
            <label htmlFor="cardHolder" className="block text-white font-medium mb-2">
              Nombre del Titular <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cardHolder"
              name="cardHolder"
              value={paymentData.cardHolder}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-black border ${
                errors.cardHolder ? 'border-red-500' : 'border-green-500/30'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors`}
              placeholder="NOMBRE COMO APARECE EN LA TARJETA"
              disabled={isProcessing}
            />
            {errors.cardHolder && (
              <p className="mt-1 text-sm text-red-500">{errors.cardHolder}</p>
            )}
          </div>

          {/* Fecha de expiración y CVV */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="expiryMonth" className="block text-white font-medium mb-2">
                Mes <span className="text-red-500">*</span>
              </label>
              <select
                id="expiryMonth"
                name="expiryMonth"
                value={paymentData.expiryMonth}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black border ${
                  errors.expiryMonth ? 'border-red-500' : 'border-green-500/30'
                } rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors`}
                disabled={isProcessing}
              >
                <option value="">MM</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              {errors.expiryMonth && (
                <p className="mt-1 text-sm text-red-500">{errors.expiryMonth}</p>
              )}
            </div>

            <div>
              <label htmlFor="expiryYear" className="block text-white font-medium mb-2">
                Año <span className="text-red-500">*</span>
              </label>
              <select
                id="expiryYear"
                name="expiryYear"
                value={paymentData.expiryYear}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black border ${
                  errors.expiryYear ? 'border-red-500' : 'border-green-500/30'
                } rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors`}
                disabled={isProcessing}
              >
                <option value="">AAAA</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {errors.expiryYear && (
                <p className="mt-1 text-sm text-red-500">{errors.expiryYear}</p>
              )}
            </div>

            <div>
              <label htmlFor="cvv" className="block text-white font-medium mb-2">
                CVV <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={paymentData.cvv}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black border ${
                  errors.cvv ? 'border-red-500' : 'border-green-500/30'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors`}
                placeholder="123"
                disabled={isProcessing}
              />
              {errors.cvv && (
                <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* Información de seguridad */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <i className="fas fa-shield-alt text-green-500 mt-1"></i>
              <div className="text-sm text-gray-300">
                <p className="font-medium text-white mb-1">Pago Seguro - Simulación</p>
                <p>Este es un formulario de prueba. No se realizará ningún cargo real a tu tarjeta.</p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-400 text-black py-3 px-6 rounded-lg font-semibold hover:from-green-400 hover:to-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <i className="fas fa-lock mr-2"></i>
                  Pagar {formattedTotal}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
