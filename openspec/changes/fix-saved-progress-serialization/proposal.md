# Fix Saved Progress Data Serialization

## Problem
Users who save their progress and later resume are encountering an "Invalid data" error upon final submission. Specifically, the error `{ "status": "error", "message": "Invalid data", "data": { "participant": { "position": [ "\"director_general\" no es una elección válida." ] } } }` indicates that the backend is receiving a double-quoted string (e.g., `'"director_general"'`) for the `participant.position` field instead of the expected value (e.g., `'director_general'`).

This suggests that the data retrieved from the "save progress" API endpoint is improperly serialized (likely double-encoded) and is being loaded directly into the application state without sanitization, leading to validation failures on submission.

## Solution
We will implement a data sanitization step when loading saved progress. Specifically, we will:
1.  Intercept the data received from `fetchProgress`.
2.  Clean string fields in `EmailResponse` (like `position`, `name`, `gender`, `birthRange`) to remove any extraneous wrapping quotes before updating the Zustand store.
3.  Ensure that the application state remains clean and valid for subsequent submission.

## Impact
-   **Risk**: Low. The fix is localized to the data loading logic.
-   **Scope**: `src/store/formStore.ts`.

## Alternatives
-   **Backend Fix**: Ideally, if the backend is double-serializing the JSON, it should be fixed there. However, given we are working on the frontend, a defensive fix here is appropriate and robust.
