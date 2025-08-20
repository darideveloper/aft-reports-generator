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

      {/* Group Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
          {groupName}
        </h2>
        {groupDetails && (
          <div className="text-muted-foreground text-lg">
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
          className="px-6 py-2 rounded-lg transition-colors hover:opacity-80 focus:ring-2 focus:ring-ring focus:ring-offset-2"
          style={{ 
            backgroundColor: 'var(--secondary)',
            color: 'var(--secondary-foreground)'
          }}
        >
          Anterior
        </button>

        <button
          onClick={onNext}
          className="px-6 py-2 rounded-lg transition-colors hover:opacity-80 focus:ring-2 focus:ring-ring focus:ring-offset-2"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
        >
          Comenzar Preguntas
        </button>
      </div>
    </div>
  );
}; 