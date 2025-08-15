import React, { useState } from 'react';
import { useFormStore } from '../store/formStore';
import { SurveyInfoScreen } from './SurveyInfoScreen';
import { QuestionGroupInfoScreen } from './QuestionGroupInfoScreen';
import { QuestionScreen } from './QuestionScreen';
import { GuestCodeScreen } from './GuestCodeScreen';
import { CompletionScreen } from './CompletionScreen';

export const MultiScreenForm: React.FC = () => {
  const {
    currentScreen,
    survey,
    responses,
    nextScreen,
    previousScreen,
    updateResponse,
    isComplete,
    resetForm,
    getCurrentScreenQuestions,
    getCurrentScreenData,
    isSurveyInfoScreen,
    isQuestionGroupInfoScreen,
    isGuestCodeScreen,
    getTotalScreens
  } = useFormStore();

  const [errors, setErrors] = useState<Record<number, string>>({});

  const currentScreenData = getCurrentScreenData();
  const currentScreenQuestions = getCurrentScreenQuestions();

  const handleAnswerChange = (questionId: number, value: string) => {
    updateResponse(questionId, value);
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  const validateCurrentScreen = () => {
    // Survey info screen, guest code screen, and question group info screens don't need validation
    if (isSurveyInfoScreen() || isGuestCodeScreen() || isQuestionGroupInfoScreen()) {
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

  // Question Group Info Screen
  if (isQuestionGroupInfoScreen()) {
    return (
      <QuestionGroupInfoScreen
        currentScreen={currentScreen}
        totalScreens={getTotalScreens()}
        groupName={currentScreenData?.name || ''}
        groupDetails={currentScreenData?.details || ''}
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
        onReset={resetForm}
      />
    );
  }

  // Question Screen
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
      isLastScreen={false}
    />
  );
}; 