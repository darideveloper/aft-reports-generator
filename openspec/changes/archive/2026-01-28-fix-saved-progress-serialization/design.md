# Design: Saved Progress Serialization Fix

## Overview
The issue stems from a mismatch between how data is stored/retrieved and how it is expected for submission. The error message explicitly shows `\"director_general\"`, implying the value `'"director_general"'`.

## Data Flow Analysis

1.  **Save**: `persistCurrentProgress` -> `saveProgress` -> `JSON.stringify(payload)` -> Backend.
    -   If frontend has `'director_general'`, payload has `"position": "director_general"`.
2.  **Load**: `fetchProgress` -> `response.json()` -> `loadSavedProgress` -> Store.
    -   If backend returned `{"data": {"emailResponse": {"position": "\"director_general\""}}}` (double encoded), `response.json()` yields a Javascript object where `position` is `'\"director_general\"'`.
3.  **Submit**: `submitSurveyResponse` -> `JSON.stringify` -> Backend.
    -   Sends `"position": "\"director_general\""`.
    -   Backend validation fails because it expects `"director_general"`.

## Proposed Change via Store

In `src/store/formStore.ts`:
Modify `loadSavedProgress` (or the logic calling it) to sanitize string properties.

```typescript
const sanitizeString = (str: string | undefined | null): string => {
  if (!str) return '';
  // Check if string is wrapped in quotes and strip them
  if (str.length >= 2 && str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1);
  }
  return str;
};

// In loadSavedProgress:
const emailResponse = progressData.data.emailResponse;
if (emailResponse) {
    emailResponse.position = sanitizeString(emailResponse.position);
    emailResponse.name = sanitizeString(emailResponse.name);
    // ... apply to other fields if necessary
}
```

## Verification
-   Can be verified by manually mocking `fetchProgress` return value with double quotes and asserting that the store contains clean values.
