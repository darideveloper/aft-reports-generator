# Tasks: Add Department Field

- [ ] Update `FormOptionsResponse` interface in `src/lib/api/options.ts` <!-- id: 1 -->
- [ ] Update `EmailResponse` interface in `src/store/formStore.ts` <!-- id: 2 -->
- [ ] Update `setEmail` and `setGeneralData` actions in `src/store/formStore.ts` <!-- id: 3 -->
- [ ] Update `loadSavedProgress` in `src/store/formStore.ts` to sanitize `department` <!-- id: 4 -->
- [ ] Update `submitSurveyResponse` interface in `src/lib/api/response.ts` <!-- id: 11 -->
- [ ] Update `CompletionScreen.tsx` to include `department` in final submission <!-- id: 12 -->
- [ ] Add `department` state and sync logic to `src/components/screens/GeneralDataScreen.tsx` <!-- id: 5 -->
- [ ] Add "Área" Dropdown and validation to `src/components/screens/GeneralDataScreen.tsx` <!-- id: 6 -->
- [ ] Update `generalDataScreen` helper in `tests/survey.ts` <!-- id: 7 -->
- [ ] Update `tests/persistence.test.ts` to include `department` in manual form filling <!-- id: 8 -->
- [ ] Update `tests/form.test.ts` to include `department` in manual form filling <!-- id: 9 -->
- [ ] Verify changes with existing tests <!-- id: 10 -->
