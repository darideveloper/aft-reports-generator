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
