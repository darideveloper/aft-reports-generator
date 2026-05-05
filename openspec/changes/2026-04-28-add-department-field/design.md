# Design: Department Field Integration

## Architectural Overview
The "department" field follows the same pattern as existing general data fields (`gender`, `birthRange`, `position`). It is fetched as part of the form options and stored in the `formStore`.

## UI Interaction
1.  **Fetching Options:** `fetchOptions` in `src/lib/api/options.ts` returns a list of departments (labeled as "Área" in the UI).
2.  **State Management:** `useFormStore` manages the `department` value within `emailResponse`.
3.  **UI Interaction:** `GeneralDataScreen.tsx` renders a `Dropdown` component for the area with the label "Área".
4.  **Validation:** `GeneralDataScreen.tsx` ensures an area is selected before proceeding.
5.  **Persistence:** The field is serialized and deserialized in `formStore.ts` and `progress.ts`.
6.  **Final Submission:** `CompletionScreen.tsx` sends the `department` field as part of the `participant` object to `submitSurveyResponse`.

## Store Changes
The `EmailResponse` interface will be extended:
```typescript
export interface EmailResponse {
  email: string;
  name: string;
  gender: string;
  birthRange: string;
  position: string;
  department: string; // New field
}
```

The `setGeneralData` and `setEmail` actions will be updated to include `department`.

## API Changes
- `src/lib/api/response.ts`: The `submitSurveyResponse` function will include `department: string` in the `participant` object.

## UI Changes
A new `Dropdown` will be added to `GeneralDataScreen.tsx` below the "Posición" field.

## Persistence Sanitization
The `loadSavedProgress` function in `formStore.ts` will be updated to sanitize the `department` string, similar to how it handles other fields.
