import React, { useState, useEffect } from 'react';
import { useFormStore } from '../store/formStore';
import { SurveyInfoScreen } from './screens/SurveyInfoScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { GuestCodeScreen } from './screens/GuestCodeScreen';
import { GeneralDataScreen } from './screens/GeneralDataScreen';
import { CompletionScreen } from './screens/CompletionScreen';

export const MultiScreenForm: React.FC = () => {
  const {
    currentScreen,
    survey,
    isLoading,
    error,
    responses,
    nextScreen,
    previousScreen,
    updateResponse,
    isComplete,
    getCurrentScreenQuestions,
    getCurrentScreenData,
    isSurveyInfoScreen,
    isGuestCodeScreen,
    isGeneralDataScreen,
    getTotalScreens,
    fetchSurveyData
  } = useFormStore();

  // Fetch survey data when component mounts
  useEffect(() => {
    fetchSurveyData(1); // Fetch survey with ID 1
  }, [fetchSurveyData]);

  const [errors, setErrors] = useState<Record<number, string>>({});

  const currentScreenData = getCurrentScreenData();
  const currentScreenQuestions = getCurrentScreenQuestions();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando encuesta...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error al cargar la encuesta</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchSurveyData(1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while survey is null
  if (!survey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando...</p>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (questionId: number, value: string) => {
    updateResponse(questionId, value);
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  const validateCurrentScreen = () => {
    // Survey info screen, guest code screen, and email screen don't need validation
    if (isSurveyInfoScreen() || isGuestCodeScreen() || isGeneralDataScreen()) {
      return true;
    }

    const newErrors: Record<number, string> = {};
    let hasErrors = false;

    for (const question of currentScreenQuestions) {
      const response = responses.find(r => r.questionId === question.id);
      if (!response || !response.answer.trim()) {
        newErrors[question.id] = 'Esta pregunta es obligatoria';
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleNext = () => {
    if (!validateCurrentScreen()) {
      return;
    }
    
    nextScreen();
  };

  const handlePrevious = () => {
    previousScreen();
  };

  // Survey Info Screen
  if (isSurveyInfoScreen()) {
    return (
      <SurveyInfoScreen
        surveyName={survey.name}
        surveyInstructions={survey.instructions}
        totalScreens={getTotalScreens()}
        onNext={handleNext}
      />
    );
  }

  // Guest Code Screen
  if (isGuestCodeScreen()) {
    return (
      <GuestCodeScreen
        currentScreen={currentScreen}
        totalScreens={getTotalScreens()}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    );
  }

  // Email Screen
  if (isGeneralDataScreen()) {
    return (
      <GeneralDataScreen
        currentScreen={currentScreen}
        totalScreens={getTotalScreens()}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    );
  }



  // Completion Screen
  if (isComplete) {
    const allQuestions = survey.question_groups.flatMap(qg => qg.questions);
    return (
      <CompletionScreen
        responses={responses}
        surveyQuestions={allQuestions}
      />
    );
  }

  // Question Screen
  const isLastScreen = currentScreen >= (3 + survey.question_groups.length - 1);
  
  return (
    <QuestionScreen
      currentScreen={currentScreen}
      totalScreens={getTotalScreens()}
      screenName={currentScreenData?.name || ''}
      screenDetails={currentScreenData?.details || ''}
      questions={currentScreenQuestions}
      responses={responses}
      errors={errors}
      onAnswerChange={handleAnswerChange}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isLastScreen={isLastScreen}
    />
  );
}; 