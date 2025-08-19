import React, { useState } from 'react';
import { useFormStore } from '../../store/formStore';
import { validateEmail } from '../../lib/api/email-validation';
import { Dropdown } from '../ui/dropdown';

interface GeneralDataScreenProps {
  currentScreen: number;
  totalScreens: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const GeneralDataScreen: React.FC<GeneralDataScreenProps> = ({
  currentScreen,
  totalScreens,
  onNext,
  onPrevious
}) => {
  const { emailResponse, setEmail, setGeneralData } = useFormStore();
  const [email, setLocalEmail] = useState(emailResponse?.email || '');
  const [gender, setGender] = useState(emailResponse?.gender || '');
  const [birthRange, setBirthRange] = useState(emailResponse?.birthRange || '');
  const [position, setPosition] = useState(emailResponse?.position || '');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Dropdown options
  const GENDER_CHOICES = [
    { value: "m", label: "Masculino" },
    { value: "f", label: "Feminino" },
    { value: "o", label: "Otro" },
  ];

  const BIRTH_RANGE_CHOICES = [
    { value: "1946-1964", label: "1946-1964" },
    { value: "1965-1980", label: "1965-1980" },
    { value: "1981-1996", label: "1981-1996" },
    { value: "1997-2012", label: "1997-2012" },
  ];

  const POSITION_CHOICES = [
    { value: "director", label: "Director" },
    { value: "manager", label: "Gerente" },
    { value: "supervisor", label: "Supervisor" },
    { value: "operator", label: "Operador" },
    { value: "other", label: "Otro" },
  ];

  const handleValidate = async () => {
    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un email válido');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const emailIsValid = await validateEmail(email);
      setIsValid(emailIsValid);
      
      if (!emailIsValid) {
        setError('El email no es válido');
      }
    } catch (error) {
      setError('Error al validar el email. Inténtalo de nuevo.');
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleNext = () => {
    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }
    
    if (!isValid) {
      setError('Debes validar el email antes de continuar');
      return;
    }

    if (!gender) {
      setError('Debes seleccionar tu género');
      return;
    }

    if (!birthRange) {
      setError('Debes seleccionar tu rango de nacimiento');
      return;
    }

    if (!position) {
      setError('Debes seleccionar tu posición');
      return;
    }
    
    setError('');
    setEmail(email, gender, birthRange, position);
    onNext();
  };

  const handleInputChange = (value: string) => {
    setLocalEmail(value);
    if (error) {
      setError('');
    }
    // Reset validation state when user changes input
    setIsValid(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-lg border border-border">
      <div className="text-center space-y-6">
        <div className="text-4xl">📧</div>
        <h2 className="text-3xl font-bold text-foreground">Datos Generales</h2>
        <p className="text-muted-foreground text-lg">
          Por favor, ingresa tus datos para continuar
        </p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              Pantalla {currentScreen + 1} de {totalScreens}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.min(Math.round(((currentScreen + 1) / totalScreens) * 100), 100)}% Completado
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(((currentScreen + 1) / totalScreens) * 100, 100)}%`,
                backgroundColor: 'var(--primary)'
              }}
            />
          </div>
        </div>
        
        <div className="text-left space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <div className="flex space-x-2">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors bg-background text-foreground placeholder:text-muted-foreground ${
                  error ? 'border-destructive' : 'border-input'
                }`}
                placeholder="Ingresa tu email"
              />
              <button
                onClick={handleValidate}
                disabled={isValidating || !email.trim()}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {isValidating ? 'Validando...' : 'Validar'}
              </button>
            </div>
            {error && (
              <p className="text-destructive text-sm mt-1">{error}</p>
            )}
            {isValid && !error && (
              <p className="text-green-600 text-sm mt-1">✅ Email válido - Puedes continuar</p>
            )}
          </div>

          <Dropdown
            id="gender"
            label="Género"
            value={gender}
            options={GENDER_CHOICES}
            onChange={(value) => {
              setGender(value);
              setGeneralData('gender', value);
              if (error) setError('');
            }}
            placeholder="Selecciona tu género"
            required
          />

          <Dropdown
            id="birthRange"
            label="Rango de Nacimiento"
            value={birthRange}
            options={BIRTH_RANGE_CHOICES}
            onChange={(value) => {
              setBirthRange(value);
              setGeneralData('birthRange', value);
              if (error) setError('');
            }}
            placeholder="Selecciona tu rango de nacimiento"
            required
          />

          <Dropdown
            id="position"
            label="Posición"
            value={position}
            options={POSITION_CHOICES}
            onChange={(value) => {
              setPosition(value);
              setGeneralData('position', value);
              if (error) setError('');
            }}
            placeholder="Selecciona tu posición"
            required
          />
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