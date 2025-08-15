import React, { useState } from 'react';
import { useFormStore } from '../../store/formStore';

interface GuestCodeScreenProps {
  currentScreen: number;
  totalScreens: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const GuestCodeScreen: React.FC<GuestCodeScreenProps> = ({
  currentScreen,
  totalScreens,
  onNext,
  onPrevious
}) => {
  const { guestCodeResponse, setGuestCode } = useFormStore();
  const [guestCode, setLocalGuestCode] = useState(guestCodeResponse?.guestCode || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!guestCode.trim()) {
      setError('El código de invitado es obligatorio');
      return;
    }
    setError('');
    setGuestCode(guestCode);
    onNext();
  };

  const handleInputChange = (value: string) => {
    setLocalGuestCode(value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center space-y-6">
        <div className="text-4xl">🔐</div>
        <h2 className="text-3xl font-bold text-gray-900">Código de Invitado</h2>
        <p className="text-gray-600 text-lg">
          Por favor, ingresa tu código de invitado para continuar
        </p>
        
        <div className="text-left space-y-4">
          <div>
            <label htmlFor="guestCode" className="block text-sm font-medium text-gray-700 mb-2">
              Código de Invitado
            </label>
            <input
              id="guestCode"
              type="text"
              value={guestCode}
              onChange={(e) => handleInputChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ingresa tu código de invitado"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            onClick={onPrevious}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Anterior
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {currentScreen} de {totalScreens}
            </span>
            <button
              onClick={handleNext}
              className="text-white px-6 py-3 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 