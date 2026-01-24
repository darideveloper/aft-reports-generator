# Design: Form Persistence System

## Context
The current form manages state locally using Zustand but does not persist it across sessions. The backend supports tracking progress per user (identified by email) and per survey.

## Goals
- Automatically persist every step completion.
- Promptly restore state after identity is confirmed (email validation).
- Maintain data consistency between local Zustand store and backend JSON structure.

## Decisions
### Persistence Trigger
Instead of a "Save" button, we will use an auto-save pattern on every `onNext` navigation in `MultiScreenForm.tsx`. This ensures that every successfully completed screen is backed up.

### State Restoration
The restoration will occur in `GeneralDataScreen.tsx` immediately after `validateEmail` returns success. 
- A `GET /progress?email={email}&survey_id={surveyId}` request will be made.
- **Loading State**: While fetching progress, a loading spinner will replace the "Continuar" button to prevent premature navigation.
- If data exists, we will use `SweetAlert2` to ask the user if they want to resume.
  - **Premium Aesthetic**: The prompt will use CSS variables (`--primary`, `--secondary`) and smooth animations.
- If they agree, the Zustand store will be updated with the saved `responses`, `guestCodeResponse`, `emailResponse`, and `currentScreen` index.
- **Local State Sync (Critical)**: Since `GeneralDataScreen` uses local `useState` for its input fields, we must implement a `useEffect` that listens to changes in the store's `emailResponse` (specifically after `loadSavedProgress`) to re-sync the local component state. This ensures that the UI reflects the restored data.
- **Start Fresh Behavior**: If the user clicks "No/Cancel", the existing progress is **ignored**. No API call is needed to delete it at this stage; it will simply be overwritten on the next successful `handleNext` or cleared on completion.


### Data Format
The payload must match the `formStore` naming conventions for direct hydration:
```json
{
  "email": "user@example.com",
  "survey_id": 1,
  "current_screen": 3,
  "data": {
    "guestCodeResponse": { "guestCode": "..." },
    "emailResponse": { "email": "...", "name": "...", ... },
    "responses": [ ... ]
  }
}
```

### Auto-Save Indicator
To build user trust, a small "Saving..." or "✓ Saved" indicator will appear near the "Continuar" button or progress bar after a successful `POST /progress`.

## Risks / Trade-offs
- **Latency**: Saving after every step adds a network request. This will be handled asynchronously to avoid blocking the user experience.
- **Zustand Hydration**: `currentScreen` must be set explicitly to the stored index, ensuring `isComplete` remains `false`.
- **Cleanup**: Progress must be deleted/marked complete in the backend ONLY after the final survey submission is confirmed in `CompletionScreen.tsx`.

## Open Questions
- Should we save even if the API call fails? (Yes, keep local progress, but notify the developer console).
- Is there an expiration for saved progress? (Handled by backend).
