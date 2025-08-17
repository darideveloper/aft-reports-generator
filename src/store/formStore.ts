import { create } from 'zustand';
import { fetchSurvey } from '../lib/api/survey';

export interface Option {
  id: number;
  text: string;
  question_index: number;
  question: number;
}

export interface Question {
  id: number;
  text: string;
  details: string;
  options: Option[];
  question_group_index: number;
  question_group: number;
}

export interface QuestionGroup {
  id: number;
  name: string;
  details: string;
  survey_percentage: number;
  questions: Question[];
  survey_index: number;
}

export interface Survey {
  id: number;
  name: string;
  instructions: string;
  created_at: string;
  updated_at: string;
  question_groups: QuestionGroup[];
}

export interface FormResponse {
  questionId: number;
  answer: string;
}

export interface GuestCodeResponse {
  guestCode: string;
}

export interface EmailResponse {
  email: string;
}

interface FormStore {
  currentScreen: number;
  survey: Survey | null;
  isLoading: boolean;
  error: string | null;
  responses: FormResponse[];
  guestCodeResponse: GuestCodeResponse | null;
  emailResponse: EmailResponse | null;
  isComplete: boolean;
  
  // Actions
  setCurrentScreen: (screen: number) => void;
  addResponse: (response: FormResponse) => void;
  updateResponse: (questionId: number, answer: string) => void;
  setGuestCode: (guestCode: string) => void;
  setEmail: (email: string) => void;
  fetchSurveyData: (surveyId: number) => Promise<void>;
  nextScreen: () => void;
  previousScreen: () => void;
  canProceed: () => boolean;
  resetForm: () => void;
  getCurrentScreenQuestions: () => Question[];
  getCurrentScreenData: () => QuestionGroup | null;
  isSurveyInfoScreen: () => boolean;
  isQuestionGroupInfoScreen: () => boolean;
  isQuestionScreen: () => boolean;
  isGuestCodeScreen: () => boolean;
  isEmailScreen: () => boolean;
  getCurrentQuestionGroupIndex: () => number;
  getTotalScreens: () => number;
}



export const useFormStore = create<FormStore>((set, get) => ({
  currentScreen: 0,
  survey: null,
  isLoading: false,
  error: null,
  responses: [],
  guestCodeResponse: null,
  emailResponse: null,
  isComplete: false,

  fetchSurveyData: async (surveyId: number) => {
    try {
      set({ isLoading: true, error: null });
      const surveyData = await fetchSurvey(surveyId);
      set({ survey: surveyData, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch survey data', 
        isLoading: false 
      });
    }
  },

  setCurrentScreen: (screen: number) => {
    set({ currentScreen: screen });
  },

  addResponse: (response: FormResponse) => {
    const { responses } = get();
    const existingIndex = responses.findIndex(r => r.questionId === response.questionId);
    
    if (existingIndex >= 0) {
      set({
        responses: responses.map((r, index) => 
          index === existingIndex ? response : r
        )
      });
    } else {
      set({ responses: [...responses, response] });
    }
  },

  updateResponse: (questionId: number, answer: string) => {
    get().addResponse({ questionId, answer });
  },

  setGuestCode: (guestCode: string) => {
    set({ guestCodeResponse: { guestCode } });
  },

  setEmail: (email: string) => {
    set({ emailResponse: { email } });
  },

  nextScreen: () => {
    const { currentScreen, survey } = get();
    if (!survey) return;
    
    if (currentScreen === 0) {
      // Move from survey info to guest code screen
      set({ currentScreen: 1 });
    } else if (currentScreen === 1) {
      // Move from guest code screen to email screen
      set({ currentScreen: 2 });
    } else if (currentScreen === 2) {
      // Move from email screen to first question group info
      set({ currentScreen: 3 });
    } else if (currentScreen < (3 + survey.question_groups.length * 2 - 1)) {
      // Continue through question groups (info + questions)
      set({ currentScreen: currentScreen + 1 });
    } else {
      // All screens completed, show completion screen
      set({ isComplete: true });
    }
  },

  previousScreen: () => {
    const { currentScreen } = get();
    if (currentScreen > 0) {
      set({ currentScreen: currentScreen - 1 });
    }
  },

  canProceed: () => {
    const { currentScreen, responses, survey } = get();
    if (!survey) return false;
    
    // Survey info screen, guest code screen, email screen, and question group info screens don't require validation
    if (currentScreen === 0 || currentScreen === 1 || currentScreen === 2 || currentScreen % 2 === 1) {
      return true;
    }
    
    // Only question screens need validation
    const questionGroupIndex = Math.floor((currentScreen - 4) / 2);
    const currentScreenData = survey.question_groups[questionGroupIndex];
    
    // Check if all required questions on the current screen are answered
    for (const question of currentScreenData.questions) {
      const response = responses.find(r => r.questionId === question.id);
      if (!response || !response.answer.trim()) {
        return false;
      }
    }
    
    return true;
  },

  getCurrentScreenQuestions: () => {
    const { currentScreen, survey } = get();
    if (!survey) return [];
    
    // Survey info screen, guest code screen, and email screen have no questions
    if (currentScreen === 0 || currentScreen === 1 || currentScreen === 2) {
      return [];
    }
    
    // Only question screens (odd numbers starting from 4) have questions
    if (currentScreen > 2 && currentScreen % 2 === 0) {
      const questionGroupIndex = Math.floor((currentScreen - 4) / 2);
      const currentScreenData = survey.question_groups[questionGroupIndex];
      return currentScreenData.questions;
    }
    
    return [];
  },

  getCurrentScreenData: () => {
    const { currentScreen, survey } = get();
    if (!survey) return null;
    
    // Survey info screen, guest code screen, and email screen have no question group data
    if (currentScreen <= 2) {
      return null;
    }
    
    // Both question group info screens and question screens need the question group data
    const questionGroupIndex = Math.floor((currentScreen - 3) / 2);
    return survey.question_groups[questionGroupIndex];
  },

  isSurveyInfoScreen: () => {
    const { currentScreen } = get();
    return currentScreen === 0;
  },

  isQuestionGroupInfoScreen: () => {
    const { currentScreen } = get();
    // Question group info screens are at odd numbers starting from 3 (3, 5, 7, etc.)
    // Question screens are at even numbers starting from 4 (4, 6, 8, etc.)
    return currentScreen > 2 && currentScreen % 2 === 1;
  },

  isQuestionScreen: () => {
    const { currentScreen } = get();
    // Question screens are at even numbers starting from 4 (4, 6, 8, etc.)
    return currentScreen > 2 && currentScreen % 2 === 0;
  },

  isGuestCodeScreen: () => {
    const { currentScreen } = get();
    // Guest code screen is at index 1
    return currentScreen === 1;
  },

  isEmailScreen: () => {
    const { currentScreen } = get();
    // Email screen is at index 2
    return currentScreen === 2;
  },

  getCurrentQuestionGroupIndex: () => {
    const { currentScreen } = get();
    // For question group info screens: (currentScreen - 3) / 2
    // For question screens: (currentScreen - 4) / 2
    if (currentScreen <= 2) return -1;
    return Math.floor((currentScreen - 3) / 2);
  },

  getTotalScreens: () => {
    const { survey } = get();
    if (!survey) return 0;
    // Survey info (1) + Guest code (1) + Email (1) + Question group info (question_groups.length) + Question screens (question_groups.length)
    return 3 + (survey.question_groups.length * 2);
  },

  resetForm: () => {
    set({
      currentScreen: 0,
      responses: [],
      guestCodeResponse: null,
      emailResponse: null,
      isComplete: false
    });
  }
})); 