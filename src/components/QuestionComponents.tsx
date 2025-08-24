import React from 'react';
import type { Question } from '../store/formStore';
import { MarkdownRenderer } from './ui/markdown-renderer';

interface QuestionComponentProps {
  question: Question;
  value: number | null; // Changed to option ID
  onChange: (optionId: number, optionText: string) => void; // Changed to pass both ID and text
  onBlur?: () => void;
  isGrid?: boolean;
}

export const MultiChoiceQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  onBlur,
  isGrid,
}) => {

  return (
    <div className={`question-container ${isGrid ? 'grid grid-cols-3 md:grid-cols-2 gap-4' : 'space-y-3'}`}>
      <h3 className="text-lg font-medium text-foreground">
        <MarkdownRenderer 
          content={question.text} 
          className={`prose prose-lg max-w-none ${isGrid ? 'p-no-my' : ''}`}
        />
      </h3>
      {question.details && (
        <div className="text-sm text-muted-foreground">
          <MarkdownRenderer 
            content={question.details} 
            className="prose prose-sm max-w-none"
          />
        </div>
      )}
      <div className={`space-y-2 ${isGrid ? 'flex justify-between col-span-2 md:col-span-1' : ''}`}>
        {question.options.map((option) => (
          <label key={option.id} className={`flex items-center space-x-3 cursor-pointer gap-2 ${isGrid ? 'inline-block w-auto p-2' : 'w-full'}`}>
            <input
              type="radio"
              name={question.id.toString()}
              value={option.text}
              checked={value === option.id}
              onChange={(e) => onChange(option.id, option.text)}
              onBlur={onBlur}
              className="!h-[18px] !w-[18px] !m-0 border-input text-primary focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:ring-offset-background radio-brand-colors"
            />
            <span className={`text-foreground w-[90%] ${isGrid ? 'hidden' : 'inline-block'}`}>{option.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export const QuestionRenderer: React.FC<{
  question: Question;
  value: number | null; // Changed to option ID
  onChange: (optionId: number, optionText: string) => void; // Changed to pass both ID and text
  onBlur?: () => void;
  isGrid?: boolean;
}> = ({ question, value, onChange, onBlur, isGrid }) => {
  // All questions are now multiple choice
  return (
    <MultiChoiceQuestion
      question={question}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      isGrid={isGrid}
    />
  );
}; 