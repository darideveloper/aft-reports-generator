# Tasks: Fix Saved Progress Data Serialization

1.  [x] Create a utility for sanitizing double-quoted strings in `src/lib/utils.ts` or inline in store. <!-- id: create-utility -->
2.  [x] Update `src/store/formStore.ts`'s `loadSavedProgress` action to sanitize `emailResponse` fields (`name`, `gender`, `birthRange`, `position`, `email`) before setting state. <!-- id: update-store -->
3.  [x] Add a unit test (or modify existing persistence test) to verify that loading data with extra quotes results in clean state. <!-- id: add-test -->
