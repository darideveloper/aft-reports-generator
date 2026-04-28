# Tasks: Add Department Field

- [x] Update `FormOptionsResponse` interface in `src/lib/api/options.ts` <!-- id: 1 -->
- [x] Update `EmailResponse` interface in `src/store/formStore.ts` <!-- id: 2 -->
- [x] Update `setEmail` and `setGeneralData` actions in `src/store/formStore.ts` <!-- id: 3 -->
- [x] Update `loadSavedProgress` in `src/store/formStore.ts` to sanitize `department` <!-- id: 4 -->
- [x] Update `submitSurveyResponse` interface in `src/lib/api/response.ts` <!-- id: 11 -->
- [x] Update `CompletionScreen.tsx` to include `department` in final submission <!-- id: 12 -->
- [x] Add `department` state and sync logic to `src/components/screens/GeneralDataScreen.tsx` <!-- id: 5 -->
- [x] Add "Departamento" Dropdown and validation to `src/components/screens/GeneralDataScreen.tsx` <!-- id: 6 -->
- [x] Update `generalDataScreen` helper in `tests/survey.ts` <!-- id: 7 -->
- [x] Update `tests/persistence.test.ts` to include `department` in manual form filling <!-- id: 8 -->
- [x] Update `tests/form.test.ts` to include `department` in manual form filling <!-- id: 9 -->
- [x] Verify changes with existing tests <!-- id: 10 -->
