import React from 'react';
import type { Question, FormResponse } from '../store/formStore';
import { MarkdownRenderer } from './ui/markdown-renderer';

interface CompletionScreenProps {
  responses: FormResponse[];
  surveyQuestions: Question[];
  onReset: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  responses,
  surveyQuestions,
  onReset
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center space-y-6">
        <div className="text-6xl">🎉</div>
        <h2 className="text-3xl font-bold text-gray-900">¡Formulario Completado!</h2>
        <p className="text-gray-600 text-lg">
          Gracias por completar el formulario. Aquí tienes un resumen de tus respuestas:
        </p>
        
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-primary font-medium text-lg">
            Te contactaremos para enviarte tu informe de resultados
          </p>
        </div>
        
        <div className="text-left space-y-4 bg-gray-50 p-6 rounded-lg">
          {responses.map((response) => {
            const question = surveyQuestions.find(q => q.id === response.questionId);
            return (
              <div key={response.questionId} className="border-b border-gray-200 pb-3 last:border-b-0">
                <h4 className="font-medium text-gray-900">
                  <MarkdownRenderer 
                    content={question?.text || ''} 
                    className="prose prose-sm max-w-none"
                  />
                </h4>
                <p className="text-gray-600 mt-1">{response.answer}</p>
              </div>
            );
          })}
        </div>
        
        <button
          onClick={onReset}
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
}; 