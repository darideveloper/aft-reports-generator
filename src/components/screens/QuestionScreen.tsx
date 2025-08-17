import React from 'react';
import { QuestionRenderer } from '../QuestionComponents';
import { MarkdownRenderer } from '../ui/markdown-renderer';
import type { Question, FormResponse } from '../../store/formStore';

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
    <div className="max-w-4xl mx-auto p-6 bg-card rounded-lg shadow-lg border border-border">
      {/* Progress Bar */}
      <div className="mb-8">
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

      {/* Screen Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {screenName}
        </h2>
        {screenDetails && (
          <div className="text-muted-foreground text-lg">
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
            <div key={question.id} className="border border-border rounded-lg p-6 bg-muted">
              <QuestionRenderer
                question={question}
                value={value}
                onChange={(value) => onAnswerChange(question.id, value)}
              />
              
              {/* Error Message */}
              {errors[question.id] && (
                <div className="mt-3 text-destructive text-sm">
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
          className="px-6 py-2 rounded-lg transition-colors hover:opacity-80 focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
            className="px-6 py-2 rounded-lg transition-colors hover:opacity-80 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
          >
            Enviar
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-6 py-2 rounded-lg transition-colors hover:opacity-80 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
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