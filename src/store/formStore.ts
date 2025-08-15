import { create } from 'zustand';

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

interface FormStore {
  currentScreen: number;
  survey: Survey;
  responses: FormResponse[];
  guestCodeResponse: GuestCodeResponse | null;
  isComplete: boolean;
  
  // Actions
  setCurrentScreen: (screen: number) => void;
  addResponse: (response: FormResponse) => void;
  updateResponse: (questionId: number, answer: string) => void;
  setGuestCode: (guestCode: string) => void;
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
  getCurrentQuestionGroupIndex: () => number;
  getTotalScreens: () => number;
}

const survey: Survey = {
  "id": 1,
  "name": "Evaluación LeadForward Prueba empresa v1",
  "instructions": "Tómese el tiempo necesario para leer instrucciones y contestar\r\n\r\n© 2024 LeadForward Global Solutions MJ. Todos los Derechos Reservados. Esta encuesta ha sido desarrollada para fines formativos y/o de diagnóstico. Su contenido es confidencial. No está permitida su reproducción, difusión o modificación sin autorización escrita.\r\n\r\nMonterrey N. L. México. 2024",
  "created_at": "2025-07-09T19:19:36.393267-06:00",
  "updated_at": "2025-07-22T12:26:52.819064-06:00",
  "question_groups": [
    {
      "id": 2,
      "name": "TEMA 1 - Antecedentes tecnológicos",
      "details": "Al adquirir conocimientos tecnológicos, los líderes se posicionan para liderar de manera eficaz en un mundo digital que evoluciona constantemente.\r\n\r\n*Lea los siguientes enunciados e identifique si estos enunciados son **verdaderos** o **falsos**.*",
      "survey_percentage": 0.0,
      "questions": [
        {
          "id": 3,
          "text": "La alfabetización tecnológica implica solamente saber cómo usar dispositivos o software.",
          "details": "",
          "options": [
            {
              "id": 4,
              "text": "Verdadero",
              "question_index": 1,
              "question": 3
            },
            {
              "id": 5,
              "text": "Falso",
              "question_index": 2,
              "question": 3
            }
          ],
          "question_group_index": 1,
          "question_group": 2
        },
        {
          "id": 4,
          "text": "La alfabetización tecnológica se refiere a la capacidad de comprender, usar y gestionar la tecnología de manera eficaz tanto en contextos personales como profesionales.",
          "details": "",
          "options": [
            {
              "id": 6,
              "text": "Verdadero",
              "question_index": 1,
              "question": 4
            },
            {
              "id": 7,
              "text": "Falso",
              "question_index": 2,
              "question": 4
            }
          ],
          "question_group_index": 2,
          "question_group": 2
        },
        {
          "id": 5,
          "text": "Uno de los elementos clave de la alfabetización tecnológica es **el pensamiento crítico sobre la tecnología**. Esto implica evaluar las ventajas, limitaciones y riesgos de adoptar nuevas tecnologías.",
          "details": "",
          "options": [
            {
              "id": 8,
              "text": "Verdadero",
              "question_index": 1,
              "question": 5
            },
            {
              "id": 9,
              "text": "Falso",
              "question_index": 2,
              "question": 5
            }
          ],
          "question_group_index": 3,
          "question_group": 2
        },
        {
          "id": 6,
          "text": "Los líderes no necesitan prepararse para entender e impulsar las iniciativas de los expertos en tecnología.",
          "details": "",
          "options": [
            {
              "id": 10,
              "text": "Verdadero",
              "question_index": 1,
              "question": 6
            },
            {
              "id": 11,
              "text": "Falso",
              "question_index": 2,
              "question": 6
            }
          ],
          "question_group_index": 4,
          "question_group": 2
        },
        {
          "id": 7,
          "text": "Los líderes son responsables de garantizar que sus organizaciones cuenten con medidas de seguridad sólidas para proteger la información de la empresa y de los clientes.",
          "details": "",
          "options": [
            {
              "id": 12,
              "text": "Verdadero",
              "question_index": 1,
              "question": 7
            },
            {
              "id": 13,
              "text": "Falso",
              "question_index": 2,
              "question": 7
            }
          ],
          "question_group_index": 5,
          "question_group": 2
        },
        {
          "id": 8,
          "text": "La alfabetización tecnológica es opcional para los líderes modernos.",
          "details": "",
          "options": [
            {
              "id": 14,
              "text": "Verdadero",
              "question_index": 1,
              "question": 8
            },
            {
              "id": 15,
              "text": "Falso",
              "question_index": 2,
              "question": 8
            }
          ],
          "question_group_index": 6,
          "question_group": 2
        }
      ],
      "survey_index": 1
    },
    {
      "id": 3,
      "name": "TEMA 2 -  Evolución de la tecnología",
      "details": "Desde los primeros inventos, como la rueda, hasta la revolución digital, la tecnología ha evolucionado para satisfacer las necesidades humanas. Los hitos clave incluyen la imprenta, la electricidad e Internet.\r\n\r\n*Elija la mejor respuesta.*",
      "survey_percentage": 0.0,
      "questions": [
        {
          "id": 9,
          "text": "¿Cuál considera que es el avance tecnológico más significativo de los últimos 100 años?",
          "details": "",
          "options": [
            {
              "id": 16,
              "text": "Computadora personal",
              "question_index": 1,
              "question": 9
            },
            {
              "id": 17,
              "text": "Internet",
              "question_index": 2,
              "question": 9
            },
            {
              "id": 18,
              "text": "Teléfonos inteligentes",
              "question_index": 3,
              "question": 9
            },
            {
              "id": 19,
              "text": "Inteligencia artificial",
              "question_index": 4,
              "question": 9
            }
          ],
          "question_group_index": 1,
          "question_group": 3
        },
        {
          "id": 10,
          "text": "¿A qué se refiere la Ley de Moore?",
          "details": "",
          "options": [
            {
              "id": 20,
              "text": "A la inteligencia artificial",
              "question_index": 1,
              "question": 10
            },
            {
              "id": 21,
              "text": "Al método científico",
              "question_index": 2,
              "question": 10
            },
            {
              "id": 22,
              "text": "A la cantidad de transistores en un circuito integrado",
              "question_index": 3,
              "question": 10
            },
            {
              "id": 23,
              "text": "Todas las anteriores",
              "question_index": 4,
              "question": 10
            }
          ],
          "question_group_index": 2,
          "question_group": 3
        },
        {
          "id": 11,
          "text": "¿Cuáles son los principales desafíos éticos asociados con la biotecnología?",
          "details": "",
          "options": [
            {
              "id": 24,
              "text": "Edición genética humana",
              "question_index": 1,
              "question": 11
            },
            {
              "id": 25,
              "text": "Clonación",
              "question_index": 2,
              "question": 11
            },
            {
              "id": 26,
              "text": "Creación de organismos sintéticos",
              "question_index": 3,
              "question": 11
            },
            {
              "id": 35,
              "text": "Todas las anteriores",
              "question_index": 4,
              "question": 11
            }
          ],
          "question_group_index": 3,
          "question_group": 3
        },
        {
          "id": 12,
          "text": "¿Qué es la singularidad tecnológica y por qué es un concepto tan debatido?",
          "details": "",
          "options": [
            {
              "id": 28,
              "text": "Es un hipotético punto en el futuro en el que el progreso tecnológico se vuelve tan rápido e intenso que escapa a nuestra comprensión y control",
              "question_index": 1,
              "question": 12
            },
            {
              "id": 29,
              "text": "Es un concepto poco debatido debido a las implicaciones filosóficas y sociales",
              "question_index": 2,
              "question": 12
            },
            {
              "id": 30,
              "text": "No existe el concepto",
              "question_index": 3,
              "question": 12
            },
            {
              "id": 31,
              "text": "A y B",
              "question_index": 4,
              "question": 12
            }
          ],
          "question_group_index": 4,
          "question_group": 3
        },
        {
          "id": 13,
          "text": "¿Cómo te imaginas que será el mundo en 50 años en términos de tecnología?",
          "details": "",
          "options": [
            {
              "id": 32,
              "text": "La inteligencia artificial será omnipresente",
              "question_index": 1,
              "question": 13
            },
            {
              "id": 33,
              "text": "La realidad virtual y aumentada transformarán la forma en que experimentamos el mundo",
              "question_index": 2,
              "question": 13
            },
            {
              "id": 34,
              "text": "Los viajes espaciales se democratizarán",
              "question_index": 3,
              "question": 13
            },
            {
              "id": 27,
              "text": "Todas las anteriores",
              "question_index": 4,
              "question": 13
            }
          ],
          "question_group_index": 5,
          "question_group": 3
        }
      ],
      "survey_index": 2
    }
  ]
};

export const useFormStore = create<FormStore>((set, get) => ({
  currentScreen: 0,
  survey,
  responses: [],
  guestCodeResponse: null,
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

  updateResponse: (questionId: number, answer: string) => {
    get().addResponse({ questionId, answer });
  },

  setGuestCode: (guestCode: string) => {
    set({ guestCodeResponse: { guestCode } });
  },

  nextScreen: () => {
    const { currentScreen, survey } = get();
    if (currentScreen === 0) {
      // Move from survey info to first question group info
      set({ currentScreen: 1 });
    } else if (currentScreen < (survey.question_groups.length * 2)) {
      set({ currentScreen: currentScreen + 1 });
    } else if (currentScreen === (survey.question_groups.length * 2)) {
      // Move from guest code screen to completion
      set({ isComplete: true });
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
    const { currentScreen, responses } = get();
    
    // Survey info screen and question group info screens don't require validation
    if (currentScreen === 0 || currentScreen % 2 === 1) {
      return true;
    }
    
    // Only question screens need validation
    const questionGroupIndex = Math.floor((currentScreen - 2) / 2);
    const currentScreenData = get().survey.question_groups[questionGroupIndex];
    
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
    const { currentScreen } = get();
    
    // Survey info screen has no questions
    if (currentScreen === 0) {
      return [];
    }
    
    // Only question screens (even numbers) have questions
    if (currentScreen % 2 === 0) {
      const questionGroupIndex = Math.floor((currentScreen - 2) / 2);
      const currentScreenData = get().survey.question_groups[questionGroupIndex];
      return currentScreenData.questions;
    }
    
    return [];
  },

  getCurrentScreenData: () => {
    const { currentScreen } = get();
    
    // Survey info screen has no question group data
    if (currentScreen === 0) {
      return null;
    }
    
    // Both question group info screens and question screens need the question group data
    const questionGroupIndex = Math.floor((currentScreen - 1) / 2);
    return get().survey.question_groups[questionGroupIndex];
  },

  isSurveyInfoScreen: () => {
    const { currentScreen } = get();
    return currentScreen === 0;
  },

  isQuestionGroupInfoScreen: () => {
    const { currentScreen } = get();
    // Question group info screens are at odd numbers (1, 3, 5, etc.)
    // Question screens are at even numbers (2, 4, 6, etc.)
    return currentScreen > 0 && currentScreen % 2 === 1;
  },

  isQuestionScreen: () => {
    const { currentScreen } = get();
    // Question screens are at even numbers (2, 4, 6, etc.)
    return currentScreen > 0 && currentScreen % 2 === 0;
  },

  isGuestCodeScreen: () => {
    const { currentScreen, survey } = get();
    // Guest code screen appears after all question groups
    return currentScreen === (survey.question_groups.length * 2);
  },

  getCurrentQuestionGroupIndex: () => {
    const { currentScreen } = get();
    // For question group info screens: (currentScreen - 1) / 2
    // For question screens: (currentScreen - 2) / 2
    if (currentScreen === 0) return -1;
    return Math.floor((currentScreen - 1) / 2);
  },

  getTotalScreens: () => {
    const { survey } = get();
    // Survey info (1) + Question group info (question_groups.length) + Question screens (question_groups.length) + Guest code screen (1)
    return 1 + (survey.question_groups.length * 2) + 1;
  },

  resetForm: () => {
    set({
      currentScreen: 0,
      responses: [],
      guestCodeResponse: null,
      isComplete: false
    });
  }
})); 