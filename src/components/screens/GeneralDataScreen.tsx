import React, { useState } from 'react'
import { useFormStore } from '../../store/formStore'
import { validateEmail } from '../../lib/api/email-validation'
import { fetchProgress } from '../../lib/api/progress'
import { Dropdown } from '../ui/dropdown'
import Swal from 'sweetalert2'

interface GeneralDataScreenProps {
  currentScreen: number
  totalScreens: number
  onNext: () => void
  onPrevious: () => void
}

export const GeneralDataScreen: React.FC<GeneralDataScreenProps> = ({
  currentScreen,
  totalScreens,
  onNext,
  onPrevious,
}) => {
  const { emailResponse, setEmail, setGeneralData, survey, loadSavedProgress } =
    useFormStore()
  const [email, setLocalEmail] = useState(emailResponse?.email || '')
  const [name, setName] = useState(emailResponse?.name || '')
  const [gender, setGender] = useState(emailResponse?.gender || '')
  const [birthRange, setBirthRange] = useState(emailResponse?.birthRange || '')
  const [position, setPosition] = useState(emailResponse?.position || '')
  const [error, setError] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [isFetchingProgress, setIsFetchingProgress] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [hasValidated, setHasValidated] = useState(false)

  // Sync local state when emailResponse changes (e.g., after loading saved progress)
  React.useEffect(() => {
    console.log({ emailResponse })
    if (emailResponse) {
      if (emailResponse.email !== email)
        setLocalEmail(emailResponse.email || '')
      if (emailResponse.name !== name) setName(emailResponse.name || '')
      if (emailResponse.gender !== gender) setGender(emailResponse.gender || '')
      if (emailResponse.birthRange !== birthRange)
        setBirthRange(emailResponse.birthRange || '')
      if (emailResponse.position !== position)
        setPosition(emailResponse.position || '')
      if (emailResponse.email) {
        setIsValid(true)
        setHasValidated(true)
      }
    }
  }, [emailResponse])

  // Dropdown options
  const GENDER_CHOICES = [
    { value: 'm', label: 'Masculino' },
    { value: 'f', label: 'Feminino' },
    { value: 'o', label: 'Otro' },
  ]

  const BIRTH_RANGE_CHOICES = [
    { value: '1946-1964', label: '1946-1964' },
    { value: '1965-1980', label: '1965-1980' },
    { value: '1981-1996', label: '1981-1996' },
    { value: '1997-2012', label: '1997-2012' },
  ]

  const POSITION_CHOICES = [
    { value: 'analista', label: 'Analista' },
    { value: 'asesor', label: 'Asesor' },
    { value: 'auxiliar', label: 'Auxiliar' },
    { value: 'contralor', label: 'Contralor' },
    { value: 'coordinador', label: 'Coordinador' },
    { value: 'director', label: 'Director' },
    { value: 'director_general', label: 'Director General' },
    { value: 'director_general_adjunto', label: 'Director General Adjunto' },
    { value: 'enlace_informacion', label: 'Enlace de Información' },
    { value: 'manager', label: 'Gerente' },
    { value: 'inspector', label: 'Inspector' },
    { value: 'investigador', label: 'Investigador' },
    { value: 'jefe_departamento', label: 'Jefe de Departamento' },
    { value: 'operator', label: 'Operador' },
    { value: 'secretario_ejecutivo', label: 'Secretario Ejecutivo' },
    { value: 'subdirector', label: 'Subdirector' },
    { value: 'subsecretario', label: 'Subsecretario' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'other', label: 'Otro' },
  ]

  const handleValidate = async () => {
    setHasValidated(true)

    if (!email.trim()) {
      setEmailError('El email es obligatorio')
      setError('El email es obligatorio')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Por favor, ingresa un email válido')
      setError('Por favor, ingresa un email válido')
      return
    }

    setIsValidating(true)
    setError('')
    setEmailError('')

    try {
      const emailIsValid = await validateEmail(email)
      setIsValid(emailIsValid)

      if (!emailIsValid) {
        setEmailError('El email no es válido')
        setError('El email no es válido')
        return
      }

      // After successful validation, check for saved progress
      if (survey) {
        setIsFetchingProgress(true)
        try {
          const savedProgress = await fetchProgress(email, survey.id)

          if (savedProgress) {
            // Show resume prompt with SweetAlert2
            const result = await Swal.fire({
              title: '¿Continuar donde lo dejaste?',
              text: 'Encontramos un progreso guardado. ¿Deseas continuar desde donde lo dejaste?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Sí, continuar',
              cancelButtonText: 'No, empezar de nuevo',
              confirmButtonColor: 'var(--primary)',
              cancelButtonColor: 'var(--muted-foreground)',
              background: 'var(--background)',
              color: 'var(--foreground)',
              customClass: {
                popup:
                  'swal-popup-custom border border-border shadow-xl rounded-xl',
                confirmButton:
                  'swal-confirm-custom px-6 py-2 rounded-lg font-medium',
                cancelButton:
                  'swal-cancel-custom px-6 py-2 rounded-lg font-medium',
              },
            })

            if (result.isConfirmed) {
              // Load saved progress
              loadSavedProgress(savedProgress)

              Swal.fire({
                icon: 'success',
                title: 'Progreso Restaurado',
                text: 'Tu progreso ha sido restaurado exitosamente.',
                confirmButtonText: 'Continuar',
                confirmButtonColor: 'var(--primary)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                timer: 2000,
              })
            }
          }
        } catch (progressError) {
          console.error('Error fetching progress:', progressError)
          // Don't block the user if progress fetch fails
        } finally {
          setIsFetchingProgress(false)
        }
      }
    } catch (error) {
      setEmailError('Error al validar el email. Inténtalo de nuevo.')
      setError('Error al validar el email. Inténtalo de nuevo.')
      setIsValid(false)
    } finally {
      setIsValidating(false)
    }
  }

  const handleNext = () => {
    if (!name.trim()) {
      setNameError('El nombre es obligatorio')
      setError('El nombre es obligatorio')
      return
    } else {
      setNameError('')
    }

    if (!email.trim()) {
      setEmailError('El email es obligatorio')
      setError('El email es obligatorio')
      return
    }

    if (!isValid) {
      setEmailError('Debes validar el email antes de continuar')
      setError('Debes validar el email antes de continuar')
      return
    }

    if (!gender) {
      setError('Debes seleccionar tu género')
      return
    }

    if (!birthRange) {
      setError('Debes seleccionar tu rango de nacimiento')
      return
    }

    if (!position) {
      setError('Debes seleccionar tu posición')
      return
    }

    setError('')
    setNameError('')
    setEmailError('')
    setEmail(email, name, gender, birthRange, position)
    onNext()
  }

  const handleInputChange = (value: string) => {
    setLocalEmail(value)
    // setGeneralData('email', value)
    if (error) {
      setError('')
    }
    if (emailError) {
      setEmailError('')
    }
    // Reset validation state when user changes input
    setIsValid(false)
    setHasValidated(false)
  }

  return (
    <div className='max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-lg border border-border'>
      <div className='text-center space-y-6'>
        <div className='text-4xl'>📧</div>
        <h2 className='text-3xl font-bold text-foreground'>Datos Generales</h2>
        <p className='text-muted-foreground text-lg'>
          Por favor, ingresa tus datos para continuar
        </p>

        {/* Progress Bar */}
        <div className='mb-4'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm font-medium text-foreground'>
              Pantalla {currentScreen + 1} de {totalScreens}
            </span>
            <span className='text-sm text-muted-foreground'>
              {Math.min(
                Math.round(((currentScreen + 1) / totalScreens) * 100),
                100,
              )}
              % Completado
            </span>
          </div>
          <div className='w-full bg-muted rounded-full h-2'>
            <div
              className='h-2 rounded-full transition-all duration-300'
              style={{
                width: `${Math.min(
                  ((currentScreen + 1) / totalScreens) * 100,
                  100,
                )}%`,
                backgroundColor: 'var(--primary)',
              }}
            />
          </div>
        </div>

        <div className='text-left space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-foreground mb-2'
            >
              Email
            </label>
            <div className='flex space-x-2'>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors bg-background text-foreground placeholder:text-muted-foreground ${
                  emailError ? 'border-destructive' : 'border-input'
                }`}
                placeholder='Ingresa tu email'
              />
              <button
                onClick={handleValidate}
                disabled={isValidating || !email.trim()}
                className='px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2'
              >
                {isValidating ? 'Validando...' : 'Validar'}
              </button>
            </div>
            {hasValidated && error && (
              <p className='text-destructive text-sm mt-1'>{error}</p>
            )}
            {hasValidated && isValid && !error && (
              <p className='text-green-600 text-sm mt-1'>
                ✅ Email válido - Puedes continuar
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-foreground mb-2'
            >
              Nombre <span className='text-destructive'>*</span>
            </label>
            <input
              id='name'
              type='text'
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (nameError) setNameError('')
                if (error) setError('')
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors bg-background text-foreground placeholder:text-muted-foreground ${
                nameError ? 'border-destructive' : 'border-input'
              }`}
              placeholder='Ingresa tu nombre'
              required
            />
          </div>

          <Dropdown
            id='gender'
            label='Género'
            value={gender}
            options={GENDER_CHOICES}
            onChange={(value) => {
              setGender(value)
              if (error) setError('')
            }}
            placeholder='Selecciona tu género'
            required
          />

          <Dropdown
            id='birthRange'
            label='Rango de Nacimiento'
            value={birthRange}
            options={BIRTH_RANGE_CHOICES}
            onChange={(value) => {
              setBirthRange(value)
              if (error) setError('')
            }}
            placeholder='Selecciona tu rango de nacimiento'
            required
          />

          <Dropdown
            id='position'
            label='Posición'
            value={position}
            options={POSITION_CHOICES}
            onChange={(value) => {
              setPosition(value)
              if (error) setError('')
            }}
            placeholder='Selecciona tu posición'
            required
          />
        </div>

        {!isValid && (
          <p className='text-destructive text-sm text-center mt-2 mb-0'>
            Valida tu correo para continuar
          </p>
        )}

        <div className='flex justify-between pt-4'>
          <button
            onClick={onPrevious}
            className='px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2'
          >
            Anterior
          </button>

          <div className='flex items-center space-x-4'>
            <span className='text-sm text-muted-foreground'>
              {currentScreen} de {totalScreens}
            </span>
            <button
              onClick={handleNext}
              disabled={!isValid || isValidating || isFetchingProgress}
              className='px-6 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
              }}
              onMouseEnter={(e) => {
                if (isValid && !isValidating && !isFetchingProgress) {
                  e.currentTarget.style.backgroundColor = 'var(--secondary)'
                }
              }}
              onMouseLeave={(e) => {
                if (isValid && !isValidating && !isFetchingProgress) {
                  e.currentTarget.style.backgroundColor = 'var(--primary)'
                }
              }}
            >
              {isFetchingProgress ? (
                <>
                  <span className='animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2'></span>
                  Buscando progreso...
                </>
              ) : (
                'Continuar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
