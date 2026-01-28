import { create } from 'zustand';
import { fetchSurvey } from '../lib/api/survey';
import { saveProgress, type ProgressData } from '../lib/api/progress';

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
  modifiers: string[];
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
  optionId: number;
  answer: string;
}

export interface GuestCodeResponse {
  guestCode: string;
}

export interface EmailResponse {
  email: string;
  name: string;
  gender: string;
  birthRange: string;
  position: string;
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
  isSaving: boolean;

  // Actions
  setCurrentScreen: (screen: number) => void;
  addResponse: (response: FormResponse) => void;
  updateResponse: (questionId: number, optionId: number, answer: string) => void;
  setGuestCode: (guestCode: string) => void;
  setEmail: (email: string, name?: string, gender?: string, birthRange?: string, position?: string) => void;
  setGeneralData: (field: 'email' | 'name' | 'gender' | 'birthRange' | 'position', value: string) => void;
  fetchSurveyData: (surveyId: number) => Promise<void>;
  nextScreen: () => void;
  previousScreen: () => void;
  canProceed: () => boolean;
  resetForm: () => void;
  getCurrentScreenQuestions: () => Question[];
  getCurrentScreenData: () => QuestionGroup | null;
  isSurveyInfoScreen: () => boolean;
  isQuestionScreen: () => boolean;
  isGuestCodeScreen: () => boolean;
  isGeneralDataScreen: () => boolean;
  getCurrentQuestionGroupIndex: () => number;
  getTotalScreens: () => number;
  getAllSurveyQuestions: () => Question[];
  loadSavedProgress: (progressData: ProgressData) => void;
  persistCurrentProgress: () => Promise<boolean>;
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
  isSaving: false,

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

  updateResponse: (questionId: number, optionId: number, answer: string) => {
    get().addResponse({ questionId, optionId, answer });
  },

  setGuestCode: (guestCode: string) => {
    set({ guestCodeResponse: { guestCode } });
  },

  setEmail: (email: string, name: string = '', gender: string = '', birthRange: string = '', position: string = '') => {
    set({ emailResponse: { email, name, gender, birthRange, position } });
  },

  setGeneralData: (field: 'email' | 'name' | 'gender' | 'birthRange' | 'position', value: string) => {
    const { emailResponse } = get();
    set({
      emailResponse: {
        email: emailResponse?.email || '',
        name: emailResponse?.name || '',
        gender: emailResponse?.gender || '',
        birthRange: emailResponse?.birthRange || '',
        position: emailResponse?.position || '',
        ...emailResponse,
        [field]: value
      }
    });
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
    } else if (currentScreen < (3 + survey.question_groups.length - 1)) {
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
      if (!response || response.optionId === null || response.optionId === undefined) {
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

    // Question screens (starting from 3) have questions
    if (currentScreen > 2) {
      const questionGroupIndex = currentScreen - 3;
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

    // Question screens need the question group data
    const questionGroupIndex = currentScreen - 3;
    return survey.question_groups[questionGroupIndex];
  },

  isSurveyInfoScreen: () => {
    const { currentScreen } = get();
    return currentScreen === 0;
  },

  isQuestionScreen: () => {
    const { currentScreen } = get();
    // Question screens are at numbers starting from 3
    return currentScreen > 2;
  },

  isGuestCodeScreen: () => {
    const { currentScreen } = get();
    // Guest code screen is at index 1
    return currentScreen === 1;
  },

  isGeneralDataScreen: () => {
    const { currentScreen } = get();
    // Email screen is at index 2
    return currentScreen === 2;
  },

  getCurrentQuestionGroupIndex: () => {
    const { currentScreen } = get();
    // For question screens: currentScreen - 3
    if (currentScreen <= 2) return -1;
    return currentScreen - 3;
  },

  getTotalScreens: () => {
    const { survey } = get();
    if (!survey) return 0;
    // Survey info (1) + Guest code (1) + Email (1) + Question screens (question_groups.length)
    return 3 + survey.question_groups.length;
  },

  getAllSurveyQuestions: () => {
    const { survey } = get();
    if (!survey) return [];
    return survey.question_groups.flatMap(group => group.questions);
  },

  resetForm: () => {
    set({
      currentScreen: 0,
      responses: [],
      guestCodeResponse: null,
      emailResponse: null,
      isComplete: false,
      isSaving: false
    });
  },

  loadSavedProgress: (progressData: ProgressData) => {
    const sanitizeString = (str: string | undefined | null): string => {
      if (!str) return '';
      // Check if string is wrapped in quotes and strip them
      if (str.length >= 2 && str.startsWith('"') && str.endsWith('"')) {
        return str.slice(1, -1);
      }
      return str;
    };

    const rawEmailResponse = progressData.data.emailResponse;
    const sanitizedEmailResponse = rawEmailResponse ? {
      ...rawEmailResponse,
      name: sanitizeString(rawEmailResponse.name),
      gender: sanitizeString(rawEmailResponse.gender),
      birthRange: sanitizeString(rawEmailResponse.birthRange),
      position: sanitizeString(rawEmailResponse.position),
      email: rawEmailResponse.email // Email is typically clean/primary key, but keeping it as is for now.
    } : null;

    set({
      currentScreen: progressData.current_screen,
      responses: progressData.data.responses,
      guestCodeResponse: progressData.data.guestCodeResponse,
      emailResponse: sanitizedEmailResponse,
      isComplete: false
    });
  },

  persistCurrentProgress: async () => {
    const { currentScreen, responses, guestCodeResponse, emailResponse, survey, isComplete } = get();

    // Do not persist if the form is already complete to avoid race conditions with cleanup
    if (isComplete) return false;

    // Only warn if we're past the email screen and missing email
    if (!emailResponse?.email || !survey) {
      if (currentScreen > 2) {
        console.warn('Cannot persist progress: missing email or survey');
      }
      return false;
    }


    set({ isSaving: true });

    try {
      await saveProgress({
        email: emailResponse.email,
        survey: survey.id,
        survey_id: survey.id,
        current_screen: currentScreen,
        data: {
          guestCodeResponse,
          emailResponse,
          responses
        }
      });

      set({ isSaving: false });
      return true;
    } catch (error) {
      console.error('Failed to persist progress:', error);
      set({ isSaving: false });
      return false;
    }
  }
})); 