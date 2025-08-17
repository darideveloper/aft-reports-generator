import React, { useState } from 'react';
import { useFormStore } from '../../store/formStore';
import { validateInvitationCode } from '../../lib/api/invitation-code';

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
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleValidate = async () => {
    if (!guestCode.trim()) {
      setError('El código de invitado es obligatorio');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const codeIsValid = await validateInvitationCode(guestCode);
      setIsValid(codeIsValid);
      
      if (!codeIsValid) {
        setError('El código de invitado no es válido');
      }
    } catch (error) {
      setError('Error al validar el código. Inténtalo de nuevo.');
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleNext = () => {
    if (!guestCode.trim()) {
      setError('El código de invitado es obligatorio');
      return;
    }
    
    if (!isValid) {
      setError('Debes validar el código antes de continuar');
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
    // Reset validation state when user changes input
    setIsValid(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-lg border border-border">
      <div className="text-center space-y-6">
        <div className="text-4xl">🔐</div>
        <h2 className="text-3xl font-bold text-foreground">Código de Invitado</h2>
        <p className="text-muted-foreground text-lg">
          Por favor, ingresa tu código de invitado para continuar
        </p>
        
        <div className="text-left space-y-4">
          <div>
            <label htmlFor="guestCode" className="block text-sm font-medium text-foreground mb-2">
              Código de Invitado
            </label>
            <div className="flex space-x-2">
              <input
                id="guestCode"
                type="text"
                value={guestCode}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors bg-background text-foreground placeholder:text-muted-foreground ${
                  error ? 'border-destructive' : 'border-input'
                }`}
                placeholder="Ingresa tu código de invitado"
              />
              <button
                onClick={handleValidate}
                disabled={isValidating || !guestCode.trim()}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {isValidating ? 'Validando...' : 'Validar'}
              </button>
            </div>
            {error && (
              <p className="text-destructive text-sm mt-1">{error}</p>
            )}
            {isValid && !error && (
              <p className="text-green-600 text-sm mt-1">✅ Código válido - Puedes continuar</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            onClick={onPrevious}
            className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Anterior
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {currentScreen} de {totalScreens}
            </span>
            <button
              onClick={handleNext}
              disabled={!isValid}
              className="px-6 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              onMouseEnter={(e) => {
                if (isValid) {
                  e.currentTarget.style.backgroundColor = 'var(--secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (isValid) {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                }
              }}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 