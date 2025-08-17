import React from 'react';
import type { Question, FormResponse } from '../../store/formStore';
import { useFormStore } from '../../store/formStore';
import { MarkdownRenderer } from '../ui/markdown-renderer';

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
  const { guestCodeResponse } = useFormStore();
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-lg border border-border">
      <div className="text-center space-y-6">
        <div className="text-6xl">🎉</div>
        <h2 className="text-3xl font-bold text-foreground">¡Formulario Completado!</h2>
        <p className="text-muted-foreground text-lg">
          Gracias por completar el formulario. Aquí tienes un resumen de tus respuestas:
        </p>
        
        {/* Progress Bar - 100% Complete */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              Formulario Completado
            </span>
            <span className="text-sm text-muted-foreground">
              100% Completado
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: '100%',
                backgroundColor: 'var(--primary)'
              }}
            />
          </div>
        </div>
        
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-primary font-medium text-lg">
            Te contactaremos para enviarte tu informe de resultados
          </p>
        </div>
        
        {guestCodeResponse && (
          <div className="bg-muted border border-border rounded-lg p-4">
            <p className="text-foreground font-medium">
              Código de Invitado: <span className="text-primary font-bold">{guestCodeResponse.guestCode}</span>
            </p>
          </div>
        )}
        
        <div className="text-left space-y-4 bg-muted p-6 rounded-lg">
          {responses.map((response) => {
            const question = surveyQuestions.find(q => q.id === response.questionId);
            return (
              <div key={response.questionId} className="border-b border-border pb-3 last:border-b-0">
                <h4 className="font-medium text-foreground">
                  <MarkdownRenderer 
                    content={question?.text || ''} 
                    className="prose prose-sm max-w-none"
                  />
                </h4>
                <p className="text-muted-foreground mt-1">{response.answer}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 