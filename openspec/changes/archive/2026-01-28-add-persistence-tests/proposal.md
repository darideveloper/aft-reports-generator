# Proposal: Add Persistence Feature Tests

This proposal outlines the implementation of a comprehensive test suite for the newly added "Save Progress" feature. The goal is to ensure the reliability of the auto-save, resume, and cleanup mechanisms through End-to-End (E2E) tests using Playwright.

## Context
The application recently gained the ability to:
1.  Auto-save progress upon screen navigation.
2.  Prompt users to resume progress if an existing session is found via email validation.
3.  Clean up saved progress upon survey completion.

Current tests covers basic form flows/validations validation but lacks verifying these new persistence behaviors.

## Objective
Add a new test file `tests/persistence.test.ts` and extend the `SurveyPage` helper class to verifying:
- **Auto-Save**: Progress is saved without user intervention.
- **Resume**: Users can restore their session state (screen and answers) after dropping off.
- **Discard**: Users can choose to start over despite having saved progress.
- **Cleanup**: Completed surveys remove the temporary saved progress.

## Scope
- **Modified**: `tests/survey.ts` (Add helpers for Resume prompt and page reloading).
- **Added**: `tests/persistence.test.ts` (New test suite).
- **Added**: `tests/repro_bug.test.ts` (Bug reproduction/verification test).

## Bug Fix: Email Persistence in "Datos Generales" Screen

### Problem Description
When filling out the "Datos Generales" (General Data) screen, the email field value was being deleted/overwritten when the user interacted with other form fields (name, gender, birth range, position).

### Root Cause Analysis
The issue was caused by a mismatch between local state management and the Zustand store:

1. The email was stored locally via `setLocalEmail()` but **not** synced to the form store in real-time
2. When other fields were changed (e.g., name via `setGeneralData('name', value)`), the `setGeneralData` function would reset the email to an empty string because:
   - The `setGeneralData` function read `emailResponse?.email` which was empty/undefined
   - It then spread the partial update, overwriting the email field
3. The email was only synced to the store on form submission, not during typing

### Solution Applied

**1. Extended `setGeneralData` to support 'email' field (`src/store/formStore.ts`)**

```typescript
// Before:
setGeneralData: (field: 'name' | 'gender' | 'birthRange' | 'position', value: string) => void;

// After:
setGeneralData: (field: 'email' | 'name' | 'gender' | 'birthRange' | 'position', value: string) => void;
```

**2. Updated `handleInputChange` in `GeneralDataScreen.tsx`**

```typescript
// Before: Only updating local state
const handleInputChange = (value: string) => {
  setLocalEmail(value);
  // ... error handling
};

// After: Also sync to store
const handleInputChange = (value: string) => {
  setLocalEmail(value);
  setGeneralData('email', value); // NEW: Sync to store in real-time
  // ... error handling
};
```

### Verification
A dedicated test `tests/repro_bug.test.ts` was created to verify that:
1. Email persists after filling the name field
2. Email persists after selecting gender
3. Email persists after selecting birth range
4. Email persists after selecting position
5. Email persists after clicking the validate button

**Test Result**: ✅ All assertions pass
