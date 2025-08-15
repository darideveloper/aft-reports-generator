import React from 'react';
import { MarkdownRenderer } from '../ui/markdown-renderer';

interface QuestionGroupInfoScreenProps {
  currentScreen: number;
  totalScreens: number;
  groupName: string;
  groupDetails: string;
  onNext: () => void;
  onPrevious: () => void;
}

export const QuestionGroupInfoScreen: React.FC<QuestionGroupInfoScreenProps> = ({
  currentScreen,
  totalScreens,
  groupName,
  groupDetails,
  onNext,
  onPrevious
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

      {/* Group Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {groupName}
        </h2>
        {groupDetails && (
          <div className="text-gray-600 text-lg">
            <MarkdownRenderer 
              content={groupDetails} 
              className="prose prose-lg max-w-none"
            />
          </div>
        )}
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

        <button
          onClick={onNext}
          className="text-white px-6 py-2 rounded-lg transition-colors hover:opacity-80"
          style={{ backgroundColor: 'var(--primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
        >
          Comenzar Preguntas
        </button>
      </div>
    </div>
  );
}; 