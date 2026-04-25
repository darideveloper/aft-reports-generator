# dynamic-field-options Implementation Tasks

1. **Create API Client:**
   - Create `src/lib/api/options.ts` to fetch data from `${apiEndpoint}/options/`.
   - Ensure it includes the `Authorization` token header.

2. **Update Form Store:**
   - Update `src/store/formStore.ts` to include a new state property `formOptions` (to hold `gender`, `birth_range`, and `position` arrays).
   - Add a `fetchFormOptions` action to populate this state using the new API client.

3. **Integrate Dynamic Options in UI:**
   - Update `src/components/screens/GeneralDataScreen.tsx` to call `fetchFormOptions` on mount if options are not already loaded.
   - Replace `GENDER_CHOICES`, `BIRTH_RANGE_CHOICES`, and `POSITION_CHOICES` constants with the dynamic options from the store.
   - Handle loading state while options are being fetched.

4. **Testing and Validation:**
   - Verify that the dropdowns populate correctly with the dynamic data.
   - Ensure the form still validates and submits correctly.
