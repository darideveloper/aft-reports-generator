import React, { useState } from 'react';
import { useFormStore } from '../store/formStore';
import { QuestionRenderer } from './QuestionComponents';

export const MultiScreenForm: React.FC = () => {
  const {
    currentScreen,
    survey,
    responses,
    nextScreen,
    previousScreen,
    updateResponse,
    isComplete,
    resetForm,
    getCurrentScreenQuestions,
    getCurrentScreenData
  } = useFormStore();

  const [errors, setErrors] = useState<Record<number, string>>({});

  const currentScreenData = getCurrentScreenData();
  const currentScreenQuestions = getCurrentScreenQuestions();

  const handleAnswerChange = (questionId: number, value: string) => {
    updateResponse(questionId, value);
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  const validateCurrentScreen = () => {
    const newErrors: Record<number, string> = {};
    let hasErrors = false;

    for (const question of currentScreenQuestions) {
      const response = responses.find(r => r.questionId === question.id);
      if (!response || !response.answer.trim()) {
        newErrors[question.id] = 'Esta pregunta es obligatoria';
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleNext = () => {
    if (!validateCurrentScreen()) {
      return;
    }
    
    nextScreen();
  };

  const handlePrevious = () => {
    previousScreen();
  };

  const handleSubmit = () => {
    if (!validateCurrentScreen()) {
      return;
    }
    
    nextScreen();
  };

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900">¡Formulario Completado!</h2>
          <p className="text-gray-600 text-lg">
            Gracias por completar el formulario. Aquí tienes un resumen de tus respuestas:
          </p>
          
          <div className="text-left space-y-4 bg-gray-50 p-6 rounded-lg">
            {responses.map((response) => {
              const question = survey.question_groups.flatMap(qg => qg.questions).find(q => q.id === response.questionId);
              return (
                <div key={response.questionId} className="border-b border-gray-200 pb-3 last:border-b-0">
                  <h4 className="font-medium text-gray-900">{question?.text}</h4>
                  <p className="text-gray-600 mt-1">{response.answer}</p>
                </div>
              );
            })}
          </div>
          
          <button
            onClick={resetForm}
            className="text-white px-6 py-3 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
          >
            Comenzar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Survey Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{survey.name}</h1>
        <div className="text-sm text-gray-600 whitespace-pre-line max-h-32 overflow-y-auto custom-scrollbar">
          {survey.instructions}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Pantalla {currentScreen + 1} de {survey.question_groups.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentScreen + 1) / survey.question_groups.length) * 100)}% Completado
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${((currentScreen + 1) / survey.question_groups.length) * 100}%`,
              backgroundColor: 'var(--primary)'
            }}
          />
        </div>
      </div>

      {/* Screen Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {currentScreenData.name}
        </h2>
        {currentScreenData.details && (
          <div className="text-gray-600 text-lg whitespace-pre-line">
            {currentScreenData.details}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-8 mb-8">
        {currentScreenQuestions.map((question) => {
          const response = responses.find(r => r.questionId === question.id);
          const value = response?.answer || '';
          
          return (
            <div key={question.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <QuestionRenderer
                question={question}
                value={value}
                onChange={(value) => handleAnswerChange(question.id, value)}
              />
              
              {/* Error Message */}
              {errors[question.id] && (
                <div className="mt-3 text-red-600 text-sm">
                  {errors[question.id]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentScreen === 0}
          className={`px-6 py-2 rounded-lg transition-colors ${
            currentScreen === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'text-white hover:opacity-80'
          }`}
          style={{ 
            backgroundColor: currentScreen === 0 ? undefined : 'var(--secondary)',
            color: currentScreen === 0 ? undefined : 'var(--secondary-foreground)'
          }}
        >
          Anterior
        </button>

        {currentScreen === survey.question_groups.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="text-white px-6 py-2 rounded-lg transition-colors hover:opacity-80"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
          >
            Enviar
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="text-white px-6 py-2 rounded-lg transition-colors hover:opacity-80"
            style={{ backgroundColor: 'var(--primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}; 