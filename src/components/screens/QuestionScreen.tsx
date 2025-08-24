import React, { useEffect, useState } from 'react'
import { QuestionRenderer } from '../QuestionComponents'
import { MarkdownRenderer } from '../ui/markdown-renderer'
import type { Question, FormResponse } from '../../store/formStore'

interface QuestionScreenProps {
  currentScreen: number
  totalScreens: number
  screenName: string
  screenDetails: string
  questions: Question[]
  responses: FormResponse[]
  errors: Record<number, string>
  onAnswerChange: (optionId: number, optionText: string) => void
  onNext: () => void
  onPrevious: () => void
  isLastScreen: boolean
  modifiers: string[]
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  currentScreen,
  totalScreens,
  screenName,
  screenDetails,
  questions,
  responses,
  errors,
  onAnswerChange,
  onNext,
  onPrevious,
  isLastScreen,
  modifiers,
}) => {
  
  // States
  const [isGrid, setIsGrid] = useState(false)
  const [isUnique, setIsUnique] = useState(false)
  const [labels, setLabels] = useState<string[]>([])
  const [hasDuplicatedOptions, setHasDuplicatedOptions] = useState(false)

  // Data
  const currentQuestionsIds = questions.map((question) => question.id)


  // Scroll to top when screen loads or changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Screen modifiers

    // Reset modifiers when loads the screen
    setIsGrid(false)
    setIsUnique(false)
    setLabels([])
    setHasDuplicatedOptions(false)

    // Show all question of the grup, in a single grid
    function applyGridModifier() {
      // Get labels of the options of first question
      const firstQuestion = questions[0]
      const labels = firstQuestion.options.map((option) => option.text)
      setLabels(labels)

      setIsGrid(true)
    }

    function applyUniqueModifier() {
      setIsUnique(true)
    }

    const modifiersMethods = {
      grid: applyGridModifier,
      unique: applyUniqueModifier,
    }
    for (const modifier of modifiers) {
      modifiersMethods[
        modifier.toLowerCase() as keyof typeof modifiersMethods
      ]?.()
    }
  }, [currentScreen])

  useEffect(() => {

    const currentAnswers = responses.filter((response) => {
      return currentQuestionsIds.includes(response.questionId)
    }).map((response) => response.answer)

    const duplicatedAnswers = currentAnswers.filter((answer, index, self) =>
      self.indexOf(answer) !== index
    )
    console.log({duplicatedAnswers, currentAnswers})

    setHasDuplicatedOptions(duplicatedAnswers.length > 0)

  }, [responses])

  return (
    <div className='max-w-4xl mx-auto p-6 bg-card rounded-lg shadow-lg border border-border'>
      {/* Progress Bar */}
      <div className='mb-8'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm font-medium text-foreground'>
            Pantalla {currentScreen + 1} de {totalScreens}
          </span>
          <span className='text-sm text-muted-foreground'>
            {Math.min(
              Math.round(((currentScreen + 1) / totalScreens) * 100),
              100
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
                100
              )}%`,
              backgroundColor: 'var(--primary)',
            }}
          />
        </div>
      </div>

      {/* Screen Header */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-foreground mb-2 text-center'>
          {screenName}
        </h2>
        {screenDetails && (
          <div className='text-muted-foreground text-lg'>
            <MarkdownRenderer
              content={screenDetails}
              className='prose prose-lg max-w-none'
            />
          </div>
        )}
      </div>

      <div className={`questions ${isGrid ? 'w-full overflow-scroll md:overflow-hidden my-6' : ''}`}>

        {/* Extra labels for grid modifier */}
        {isGrid &&
          <div className={`grid grid-cols-3 md:grid-cols-2 gap-4 p-6 bg-muted rounded-lg min-w-lg`}>
            <div />
            <div className='labels flex gap-2 w-full justify-between col-span-2 md:col-span-1'>
              {labels.map((label) => (
                <p
                  key={label}
                  className='text-sm text-muted-foreground p-2'
                >
                  {label}
                  </p>
                ))}
            </div>
          </div>
        }

        {/* Questions */}
        <div className={`space-y-8 mb-8 ${isGrid ? 'min-w-lg' : ''}`}>
          {questions.map((question) => {
            const response = responses.find((r) => r.questionId === question.id)
            const value = response?.optionId || null

            return (
              <div
                key={question.id}
                className={`border border-border rounded-lg p-6 bg-muted ${
                  isGrid ? 'mb-0 rounded-none border-none' : ''
                }`}
              >
                <QuestionRenderer
                  question={question}
                  value={value}
                  onChange={(optionId, optionText) => onAnswerChange(optionId, optionText)}
                  isGrid={isGrid}
                />

                {/* Error Message */}
                {errors[question.id] && (
                  <div className='mt-3 text-destructive text-sm'>
                    {errors[question.id]}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>

      {/* Show error message if not all questions are answered */}
      {errors && Object.values(errors).some((error) => error !== '') && (
        <p className='text-destructive text-sm text-center mt-2 mb-0'>
          Para avanzar hay que contestar todas las preguntas
        </p>
      )}

      {/* Error message unique with duplicated options */}
      {hasDuplicatedOptions && isUnique && (
        <p className='text-destructive text-sm text-center mt-2 mb-0'>
          No se puede seleccionar la misma opción en más de una pregunta
        </p>
      )}

      {/* Navigation Buttons */}
      <div className='flex justify-between'>
        <button
          onClick={onPrevious}
          className='px-6 py-2 rounded-lg transition-colors hover:opacity-80 focus:ring-2 focus:ring-ring focus:ring-offset-2'
          style={{
            backgroundColor: 'var(--secondary)',
            color: 'var(--secondary-foreground)',
          }}
        >
          Anterior
        </button>

        <button
          onClick={onNext}
          className='px-6 py-2 rounded-lg transition-colors hover:opacity-80 focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50'
          style={{
            backgroundColor: isLastScreen ? 'var(--accent)' : 'var(--primary)',
            color: isLastScreen ? 'var(--accent-foreground)' : 'var(--primary-foreground)',
          }}
          disabled={hasDuplicatedOptions && isUnique}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--secondary)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = isLastScreen ? 'var(--accent)' : 'var(--primary)')
          }
        >
          {isLastScreen ? 'Enviar' : 'Siguiente'}
        </button>
      </div>
    </div>
  )
}
