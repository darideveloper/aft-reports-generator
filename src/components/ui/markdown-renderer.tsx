import React from 'react';
import { renderMarkdown } from '../../lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  if (!content) return null;

  const htmlContent = renderMarkdown(content);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}; 