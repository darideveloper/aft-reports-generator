# Design: Persistence Testing Strategy

## Overview
The testing strategy relies on Playwright's ability to simulate separate user sessions. We will simulate "dropping off" by reloading the page or navigating away, then returning to verify the state.

## Test Helpers Improvements (`tests/survey.ts`)

We need to extend the `SurveyPage` class with methods to interact with the new SweetAlert2 prompt and verify state restoration.

### New Methods
1.  `handleResumePrompt(accept: boolean)`:
    *   Waits for the SweetAlert2 prompt "¿Continuar donde lo dejaste?".
    *   Clicks "Sí, continuar" if `accept` is true.
    *   Clicks "No, empezar de nuevo" if `accept` is false.
2.  `verifyCurrentScreen(title: string)`:
    *   explicitly validates which screen is currently active to confirm navigation jump.

## Test Scenarios (`tests/persistence.test.ts`)

### 1. `resume_progress_happy_path`
*   **Setup**: Start survey, enter Guest Code, enter Email (valid), Answer TEMA 1.
*   **Action**: "Drop off" (reload page -> `goto('/')`).
*   **Return**: Enter Guest Code, enter **same** Email.
*   **Verification**:
    *   Prompt appears.
    *   Accept prompt.
    *   User is redirected immediately to TEMA 2 (or expectation of TEMA 1 completion).
    *   Previous answers (if checkable) are present.

### 2. `discard_saved_progress`
*   **Setup**: Same as above (Progress exists).
*   **Action**: Reload, same Email.
*   **Verification**:
    *   Prompt appears.
    *   Reject prompt.
    *   User stays on General Data screen (or moves to start of questions empty).
    *   Verify user is at TEMA 1 (fresh start).

### 3. `cleanup_on_completion`
*   **Setup**: Restore progress or complete from scratch defined in previous steps.
*   **Action**: Complete entire survey -> Submit.
*   **Return**: Reload, same Email.
*   **Verification**:
    *   **NO** prompt appears.
    *   Standard flow continues.

## Edge Cases to Cover
*   **Invalid Email**: Should not trigger persistence check (already covered by existing validation tests, but implicitly critical here).
*   **Network Failure**: (Hard to mock with real backend integration in current setup, skipping for MVP unless strictly required, focusing on checking the logic works when backend is up).

## File Structure
We will create a specific test file `tests/persistence.test.ts` to keep `form.test.ts` focused on general validation logic.
