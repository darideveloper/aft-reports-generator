import React from 'react';
import { QuestionRenderer } from './QuestionComponents';
import { MarkdownRenderer } from './ui/markdown-renderer';
import type { Question, FormResponse } from '../store/formStore';

interface QuestionScreenProps {
  currentScreen: number;
  totalScreens: number;
  screenName: string;
  screenDetails: string;
  questions: Question[];
  responses: FormResponse[];
  errors: Record<number, string>;
  onAnswerChange: (questionId: number, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastScreen: boolean;
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
  isLastScreen
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Pantalla {currentScreen + 1} de {totalScreens}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentScreen + 1) / totalScreens) * 100)}% Completado
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${((currentScreen + 1) / totalScreens) * 100}%`,
              backgroundColor: 'var(--primary)'
            }}
          />
        </div>
      </div>

      {/* Screen Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {screenName}
        </h2>
        {screenDetails && (
          <div className="text-gray-600 text-lg">
            <MarkdownRenderer 
              content={screenDetails} 
              className="prose prose-lg max-w-none"
            />
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-8 mb-8">
        {questions.map((question) => {
          const response = responses.find(r => r.questionId === question.id);
          const value = response?.answer || '';
          
          return (
            <div key={question.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <QuestionRenderer
                question={question}
                value={value}
                onChange={(value) => onAnswerChange(question.id, value)}
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
          onClick={onPrevious}
          className="text-white px-6 py-2 rounded-lg transition-colors hover:opacity-80"
          style={{ 
            backgroundColor: 'var(--secondary)',
            color: 'var(--secondary-foreground)'
          }}
        >
          Anterior
        </button>

        {isLastScreen ? (
          <button
            onClick={onNext}
            className="text-white px-6 py-2 rounded-lg transition-colors hover:opacity-80"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
          >
            Enviar
          </button>
        ) : (
          <button
            onClick={onNext}
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