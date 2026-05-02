# dynamic-field-options Design

## Architecture
The dynamic options will be managed via the global `formStore` (Zustand). This ensures that options are fetched once and available across the application if needed, and also allows for easy handling of loading/error states.

## API Integration
- `src/lib/api/options.ts`: Will export `fetchOptions` function.
- Uses `VITE_API_ENDPOINT` and `VITE_API_KEY` for authentication, following the pattern in `survey.ts`.

## Store Integration
- `formOptions`: State property in `FormStore`.
- `fetchFormOptions`: Action to fetch and update `formOptions`.

## UI Integration
- `GeneralDataScreen.tsx`: Uses `useEffect` to trigger fetching.
- Maps `formOptions.gender`, `formOptions.birth_range`, and `formOptions.position` to the `Dropdown` components.
- Note: The API returns `birth_range` (snake_case) while the current frontend uses `birthRange` (camelCase). The store will map these to maintain consistency with the existing `EmailResponse` interface if possible, or we will update the interface.

## Trade-offs
- **Pros**: Centralized management of options, decoupled from UI, easy to update from backend.
- **Cons**: Requires an extra API call on startup (or when reaching the screen).
