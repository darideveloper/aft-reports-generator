# Tasks: Add Form Persistence System

## 1. API Integration
- [x] 1.1 Create `src/lib/api/progress.ts` with `saveProgress`, `fetchProgress`, and `completeProgress` (DELETE/completion) functions.
- [x] 1.2 Update `.env` / environment configurations if new endpoints are needed (using `VITE_` prefix).

## 2. Store Enhancements
- [x] 2.1 Add `loadSavedProgress` action to `src/store/formStore.ts` to hydrate state.
- [x] 2.2 Refactor `setGeneralData` in `src/store/formStore.ts` to initialize `emailResponse` if absent (Fix).
- [x] 2.3 Update `persistCurrentProgress` to optionally suppress warnings for initial screens (Rec).
- [x] 2.4 Add `persistCurrentProgress` action to `src/store/formStore.ts` that sends state to backend.

## 3. Frontend Implementation
- [x] 3.1 Update `src/components/screens/GeneralDataScreen.tsx`:
    - [x] Add `isFetchingProgress` state.
    - [x] Trigger `fetchProgress` after successful email validation.
    - [x] Add `useEffect` to sync local component state (`name`, `gender`, etc.) with store after `loadSavedProgress` (Fix).
- [x] 3.2 Refine SweetAlert2 prompt in `GeneralDataScreen.tsx` for brand consistency and CSS variable support (Rec).
- [x] 3.3 Update `src/components/MultiScreenForm.tsx`:
    - [x] Move `persistCurrentProgress` call to a more stable location or ensure it handles the "Completion" edge case (Rec).
    - [x] Add a functional "Auto-save" indicator UI near the navigation area.
- [x] 3.4 Update `src/components/screens/CompletionScreen.tsx`:
    - [x] Call `completeProgress` API after successful survey submission to clear the in-progress record.


## 4. Validation
- [x] 4.1 Verify that navigating between steps triggers a network request and shows the "Auto-save" indicator.
- [x] 4.2 Verify that entering a previously used email triggers retrieval and shows a loading state.
- [x] 4.3 Verify that agreeing to resume correctly populates all previous fields and places the user on the correct screen.
- [x] 4.4 Verify that completing the survey removes the progress record (subsequent logins start fresh).


