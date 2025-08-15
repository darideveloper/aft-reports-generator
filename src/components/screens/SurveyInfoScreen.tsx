import React from 'react';
import { MarkdownRenderer } from './ui/markdown-renderer';

interface SurveyInfoScreenProps {
  surveyName: string;
  surveyInstructions: string;
  totalScreens: number;
  onNext: () => void;
}

export const SurveyInfoScreen: React.FC<SurveyInfoScreenProps> = ({
  surveyName,
  surveyInstructions,
  totalScreens,
  onNext
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Survey Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{surveyName}</h1>
        <div className="text-sm text-gray-600 max-h-96 overflow-y-auto custom-scrollbar bg-gray-50 p-6 rounded-lg text-left">
          <MarkdownRenderer 
            content={surveyInstructions} 
            className="prose prose-sm max-w-none"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Pantalla 1 de {totalScreens}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((1 / totalScreens) * 100)}% Completado
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(1 / totalScreens) * 100}%`,
              backgroundColor: 'var(--primary)'
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="text-white px-8 py-3 rounded-lg transition-colors hover:opacity-80 text-lg font-medium"
          style={{ backgroundColor: 'var(--primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
        >
          Comenzar Evaluación
        </button>
      </div>
    </div>
  );
}; 