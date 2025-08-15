import React from 'react';
import type { Question } from '../store/formStore';
import { MarkdownRenderer } from './ui/markdown-renderer';

interface QuestionComponentProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export const MultiChoiceQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  onBlur
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-foreground">
        <MarkdownRenderer 
          content={question.text} 
          className="prose prose-lg max-w-none"
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
      <div className="space-y-2">
        {question.options.map((option) => (
          <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name={question.id.toString()}
              value={option.text}
              checked={value === option.text}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              className="h-4 w-4 border-input text-primary focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:ring-offset-background radio-brand-colors"
            />
            <span className="text-foreground">{option.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export const QuestionRenderer: React.FC<{
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}> = ({ question, value, onChange, onBlur }) => {
  // All questions are now multiple choice
  return (
    <MultiChoiceQuestion
      question={question}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
}; 