import React from 'react';
import type { Question } from '../store/formStore';

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
      <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
      <div className="space-y-2">
        {question.options?.map((option) => (
          <label key={option} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export const EmailQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  onBlur
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder="Enter your email address"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export const TextQuestion: React.FC<QuestionComponentProps> = ({
  question,
  value,
  onChange,
  onBlur
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder="Type your answer here..."
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
      />
    </div>
  );
};

export const QuestionRenderer: React.FC<{
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}> = ({ question, value, onChange, onBlur }) => {
  switch (question.type) {
    case 'multi-choice':
      return (
        <MultiChoiceQuestion
          question={question}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
    case 'email':
      return (
        <EmailQuestion
          question={question}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
    case 'text':
      return (
        <TextQuestion
          question={question}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
    default:
      return <div>Unsupported question type</div>;
  }
}; 