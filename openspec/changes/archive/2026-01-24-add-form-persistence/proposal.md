# Change: Add Form Persistence System

## Why

Users filling out the multi-step report generator may lose progress if they close the browser or experience connectivity issues. A "continue" system allows them to resume from their last completed step by entering their email, improving completion rates and user experience.

## What Changes

- **Progress Tracking**: The system will automatically save the form's state (all current responses and the current screen index) to the backend whenever the user navigates to the next screen. A subtle persistence indicator will notify the user of successful saves.
- **Progress Retrieval**: When a user validates their email, the system will check for existing saved progress. If found, it will offer to restore the session, auto-fill fields, and jump to the last completed step.
- **Cleanup on Completion**: Upon successful survey submission, the system will explicitly clear the in-progress record to prevent redundant resume prompts.
- **API Integration**: Integration with `GET /progress`, `POST /progress`, and `DELETE /progress` endpoints.
- **Workflow Update**: The form navigation logic will be wrapped with persistence triggers after state updates.

## Audit Findings: Fixes vs Recommendations

Following a detailed code audit, the following items have been identified to ensure the feature works correctly and matches the premium design requirements.

### Phase 1: Required Fixes (Bugs/Integration Issues)
*   **Fix 1: Local State Sync in `GeneralDataScreen`**: Currently, `loadSavedProgress` updates the Zustand store, but the local `useState` variables in the `GeneralDataScreen` component do not re-sync. This results in empty or stale fields after a successful restoration.
*   **Fix 2: Store Action `setGeneralData` Initialization**: The current implementation of `setGeneralData` silently fails if `emailResponse` is null. It should initialize the object if it doesn't exist to allow data entry before email validation is complete.
*   **Fix 3: Navigation Race Condition**: `persistCurrentProgress` is called after `nextScreen()` in `MultiScreenForm`. While mostly safe, it should be verified that it doesn't attempt to persist a "Complete" state that might conflict with the `completeProgress` call in `CompletionScreen`.

### Phase 2: Recommendations (Quality & UX Improvements)
*   **Rec 1: Enhanced SweetAlert2 Styling**: Ensuring CSS variables like `--primary` are correctly applied to the SweetAlert2 buttons even if the library doesn't automatically detect theme changes.
*   **Rec 2: Optimistic UI Refinement**: Replacing `setTimeout(..., 0)` in `handleNext` with a more robust pattern (e.g., calling persist within the store's `nextScreen` or using a dedicated effect).
*   **Rec 3: Silence Warnings for Step 0/1**: Prevent `persistCurrentProgress` from logging warnings when called on screens before the email has been entered.

## Impact

- **Affected Specs**: `form-persistence` (New)
- **Affected Code**:
  - `src/store/formStore.ts`: Fix `setGeneralData`, silence early warnings.
  - `src/components/MultiScreenForm.tsx`: Improve persistence trigger logic.
  - `src/components/screens/GeneralDataScreen.tsx`: Implement local state synchronization.
  - `src/components/screens/CompletionScreen.tsx`: Clean submission cleanup.
  - `src/lib/api/progress.ts`: API client (Already implemented).

