import { create } from 'zustand';

export interface Question {
  id: string;
  type: 'multi-choice' | 'email' | 'text';
  question: string;
  options?: string[];
  required: boolean;
}

export interface Screen {
  id: string;
  title: string;
  description?: string;
  questionIds: string[];
}

export interface FormResponse {
  questionId: string;
  answer: string;
}

interface FormStore {
  currentScreen: number;
  screens: Screen[];
  questions: Question[];
  responses: FormResponse[];
  isComplete: boolean;
  
  // Actions
  setCurrentScreen: (screen: number) => void;
  addResponse: (response: FormResponse) => void;
  updateResponse: (questionId: string, answer: string) => void;
  nextScreen: () => void;
  previousScreen: () => void;
  canProceed: () => boolean;
  resetForm: () => void;
  getCurrentScreenQuestions: () => Question[];
}

const questions: Question[] = [
  {
    id: '1',
    type: 'multi-choice',
    question: '¿Cuál es tu lenguaje de programación preferido?',
    options: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'],
    required: true
  },
  {
    id: '2',
    type: 'email',
    question: '¿Cuál es tu dirección de correo electrónico?',
    required: true
  },
  {
    id: '3',
    type: 'text',
    question: 'Cuéntanos sobre tu experiencia con React:',
    required: true
  },
  {
    id: '4',
    type: 'multi-choice',
    question: '¿Cuántos años de experiencia tienes?',
    options: ['0-1 años', '1-3 años', '3-5 años', '5+ años'],
    required: true
  },
  {
    id: '5',
    type: 'text',
    question: '¿Cuáles son tus metas profesionales?',
    required: true
  },
  {
    id: '6',
    type: 'multi-choice',
    question: '¿Qué tipo de proyectos te gusta trabajar?',
    options: ['Frontend', 'Backend', 'Full-stack', 'Móvil', 'Escritorio'],
    required: true
  },
  {
    id: '7',
    type: 'text',
    question: 'Describe tu ambiente de trabajo ideal:',
    required: true
  }
];

const screens: Screen[] = [
  {
    id: 'screen1',
    title: 'Información Personal',
    description: 'Comencemos con información básica sobre ti',
    questionIds: ['1', '2']
  },
  {
    id: 'screen2',
    title: 'Experiencia y Habilidades',
    description: 'Cuéntanos sobre tu experiencia y antecedentes',
    questionIds: ['3', '4', '5']
  },
  {
    id: 'screen3',
    title: 'Preferencias y Metas',
    description: 'Ayúdanos a entender tus preferencias y metas profesionales',
    questionIds: ['6', '7']
  }
];

export const useFormStore = create<FormStore>((set, get) => ({
  currentScreen: 0,
  screens,
  questions,
  responses: [],
  isComplete: false,

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

  updateResponse: (questionId: string, answer: string) => {
    get().addResponse({ questionId, answer });
  },

  nextScreen: () => {
    const { currentScreen, screens } = get();
    if (currentScreen < screens.length - 1) {
      set({ currentScreen: currentScreen + 1 });
    } else {
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
    const { currentScreen, screens, questions, responses } = get();
    const currentScreenData = screens[currentScreen];
    
    // Check if all required questions on the current screen are answered
    for (const questionId of currentScreenData.questionIds) {
      const question = questions.find(q => q.id === questionId);
      if (!question) continue;
      
      if (question.required) {
        const response = responses.find(r => r.questionId === questionId);
        if (!response || !response.answer.trim()) {
          return false;
        }
        
        if (question.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(response.answer)) {
            return false;
          }
        }
      }
    }
    
    return true;
  },

  getCurrentScreenQuestions: () => {
    const { currentScreen, screens, questions } = get();
    const currentScreenData = screens[currentScreen];
    return questions.filter(q => currentScreenData.questionIds.includes(q.id));
  },

  resetForm: () => {
    set({
      currentScreen: 0,
      responses: [],
      isComplete: false
    });
  }
})); 