import React, { useEffect, useState, useRef } from 'react'
import type { FormResponse } from '../../store/formStore'
import { useFormStore } from '../../store/formStore'
import { submitSurveyResponse } from '../../lib/api/response'
import { completeProgress } from '../../lib/api/progress'
import Swal from 'sweetalert2'

interface CompletionScreenProps {
  responses: FormResponse[]
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  responses,
}) => {
  const { guestCodeResponse, emailResponse, survey } = useFormStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasSubmitted = useRef(false)

  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Submit responses to API in background only once
    if (!hasSubmitted.current) {
      hasSubmitted.current = true
      submitResponsesToAPI()
    }
  }, [])

  const submitResponsesToAPI = async () => {
    if (!guestCodeResponse?.guestCode || !emailResponse?.email || !survey) {
      console.error('Missing required data for API submission')
      return
    }

    setIsSubmitting(true)

    try {
      // Extract option IDs from responses
      const optionIds = responses
        .filter(
          (response) =>
            response.optionId !== null && response.optionId !== undefined,
        )
        .map((response) => response.optionId as number)

      // Prepare participant data
      const participant = {
        gender: emailResponse.gender || '',
        birth_range: emailResponse.birthRange || '',
        position: emailResponse.position || '',
        name: emailResponse.name || '',
        email: emailResponse.email,
      }

      // Submit to API
      await submitSurveyResponse(
        guestCodeResponse.guestCode,
        survey.id,
        participant,
        optionIds,
      )

      // Clear persistence record
      try {
        await completeProgress(emailResponse.email, survey.id)
      } catch (cleanupError) {
        console.warn('Failed to clear saved progress:', cleanupError)
      }

      // Show success message
      Swal.fire({
        icon: 'success',
        title: '¡Respuestas Guardadas!',
        text: 'Tus respuestas han sido guardadas exitosamente.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'var(--primary)',
      })
    } catch (error) {
      console.error('Error submitting responses:', error)

      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Error al Guardar',
        text: 'Hubo un problema al guardar tus respuestas. Por favor, contacta al administrador.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'var(--primary)',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-lg border border-border'>
      <div className='text-center space-y-6'>
        <div className='text-6xl'>🎉</div>
        <h2 className='text-3xl font-bold text-foreground'>
          ¡Formulario Completado!
        </h2>
        <p className='text-muted-foreground text-lg'>
          Gracias por completar el formulario. Aquí tienes un resumen de tus
          respuestas:
        </p>

        {/* Progress Bar - 100% Complete */}
        <div className='mb-4'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm font-medium text-foreground'>
              Formulario Completado
            </span>
            <span className='text-sm text-muted-foreground'>
              100% Completado
            </span>
          </div>
          <div className='w-full bg-muted rounded-full h-2'>
            <div
              className='h-2 rounded-full transition-all duration-300'
              style={{
                width: '100%',
                backgroundColor: 'var(--primary)',
              }}
            />
          </div>
        </div>

        <div className='bg-primary/10 border border-primary/20 rounded-lg p-4'>
          <p className='text-primary font-medium text-lg'>
            Te contactaremos para enviarte tu informe de resultados
          </p>
        </div>

        {isSubmitting && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <p className='text-blue-700 font-medium'>
              Enviando respuestas al servidor...
            </p>
          </div>
        )}

        {guestCodeResponse && (
          <div className='bg-muted border border-border rounded-lg p-4'>
            <p className='text-foreground font-medium'>
              Código de Invitado:{' '}
              <span className='text-primary font-bold'>
                {guestCodeResponse.guestCode}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
