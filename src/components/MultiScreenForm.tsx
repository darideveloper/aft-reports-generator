import React, { useState } from 'react';
import { useFormStore } from '../store/formStore';
import { QuestionRenderer } from './QuestionComponents';

export const MultiScreenForm: React.FC = () => {
  const {
    currentScreen,
    screens,
    questions,
    responses,
    nextScreen,
    previousScreen,
    updateResponse,
    isComplete,
    resetForm,
    getCurrentScreenQuestions
  } = useFormStore();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentScreenData = screens[currentScreen];
  const currentScreenQuestions = getCurrentScreenQuestions();

  const handleAnswerChange = (questionId: string, value: string) => {
    updateResponse(questionId, value);
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  const validateCurrentScreen = () => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    for (const question of currentScreenQuestions) {
      if (question.required) {
        const response = responses.find(r => r.questionId === question.id);
        if (!response || !response.answer.trim()) {
          newErrors[question.id] = 'Esta pregunta es obligatoria';
          hasErrors = true;
        } else if (question.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(response.answer)) {
            newErrors[question.id] = 'Por favor ingresa una dirección de correo válida';
            hasErrors = true;
          }
        }
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
              const question = questions.find(q => q.id === response.questionId);
              return (
                <div key={response.questionId} className="border-b border-gray-200 pb-3 last:border-b-0">
                  <h4 className="font-medium text-gray-900">{question?.question}</h4>
                  <p className="text-gray-600 mt-1">{response.answer}</p>
                </div>
              );
            })}
          </div>
          
          <button
            onClick={resetForm}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Comenzar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Pantalla {currentScreen + 1} de {screens.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentScreen + 1) / screens.length) * 100)}% Completado
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentScreen + 1) / screens.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Screen Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {currentScreenData.title}
        </h2>
        {currentScreenData.description && (
          <p className="text-gray-600 text-lg">
            {currentScreenData.description}
          </p>
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
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          Anterior
        </button>

        {currentScreen === screens.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Enviar
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}; 