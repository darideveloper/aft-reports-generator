# Tasks: Fix Email Validation Feedback

## Implementation Tasks

### 1. Add `hasValidated` state variable
- [x] Add `const [hasValidated, setHasValidated] = useState(false)` in `GeneralDataScreen.tsx`
- **File**: `src/components/screens/GeneralDataScreen.tsx`
- **Verification**: TypeScript compiles without errors ✅

### 2. Update `handleValidate` to set `hasValidated`
- [x] Add `setHasValidated(true)` at the start of `handleValidate` function
- **File**: `src/components/screens/GeneralDataScreen.tsx`
- **Verification**: State change on button click ✅

### 3. Update `handleInputChange` to reset `hasValidated`
- [x] Add `setHasValidated(false)` in `handleInputChange` function
- **File**: `src/components/screens/GeneralDataScreen.tsx`
- **Verification**: State resets when user types in email input ✅

### 4. Update validation feedback rendering
- [x] Modify error message condition to include `hasValidated`
- [x] Modify success message condition to include `hasValidated`
- **File**: `src/components/screens/GeneralDataScreen.tsx`
- **Verification**: Messages only appear after clicking "Validar" ✅

### 5. Adjust useEffect for progress restoration
- [x] In the `useEffect` that syncs `emailResponse`, set `hasValidated(true)` when restoring valid email
- **Rationale**: When restoring progress, the email was previously validated, so we should preserve that state
- **File**: `src/components/screens/GeneralDataScreen.tsx`
- **Verification**: Restored progress still shows validation status correctly ✅

---

## Testing Tasks

### Test File Analysis

The project uses **Playwright** for E2E testing with the following structure:

| File | Purpose | Test Pattern |
|------|---------|--------------| 
| `tests/form.test.ts` | Core form flow tests (guest code, email validation, form submission) | Individual `test()` blocks |
| `tests/persistence.test.ts` | Progress save/restore, email persistence | `test.describe()` grouping |
| `tests/form-tema-3.test.ts` | Specific theme/question tests | Individual `test()` blocks |
| `tests/survey.ts` | Page Object Model (SurveyPage class) | Helper methods |

### Recommended Test Location

**File**: `tests/form.test.ts`

**Rationale**: 
- The bug is related to email validation feedback (core form flow)
- Existing tests `valid_email` and `invalid_email_already_exists` test email validation
- New tests should be grouped with existing email validation tests
- These are NOT persistence-related tests, so they don't belong in `persistence.test.ts`

### Page Object Updates Required

**File**: `tests/survey.ts`

Add helper methods to the `SurveyPage` class:

```typescript
async isEmailValidationMessageVisible(): Promise<boolean> {
  return await this.page.locator('p:has-text("✅ Email válido")').isVisible();
}

async isEmailErrorMessageVisible(): Promise<boolean> {
  return await this.page.locator('p.text-destructive').isVisible();
}
```

---

### 6. Add Page Object helper methods
- [x] Add `isEmailValidationMessageVisible()` method to `SurveyPage` class
- [x] Add `isEmailErrorMessageVisible()` method to `SurveyPage` class
- **File**: `tests/survey.ts`
- **Location**: After `generalDataScreen()` method (around line 95)
- **Verification**: Methods compile and can be called from tests ✅

### 7. Add test: No validation message before clicking Validar
- [x] Create test `email_validation_message_hidden_before_validate` in `tests/form.test.ts`
- **File**: `tests/form.test.ts`
- **Location**: After existing `invalid_email_already_exists` test
- **Verification**: Test added ✅

### 8. Add test: Validation message appears after clicking Validar
- [x] Create test `email_validation_message_shown_after_validate` in `tests/form.test.ts`
- **File**: `tests/form.test.ts`
- **Verification**: Test added ✅

### 9. Add test: Validation message disappears when email changes
- [x] Create test `email_validation_message_hides_on_email_change` in `tests/form.test.ts`
- **File**: `tests/form.test.ts`
- **Verification**: Test added ✅

### 10. Add test: Error message only after clicking Validar with invalid email
- [x] Create test `email_error_message_only_after_validate` in `tests/form.test.ts`
- **File**: `tests/form.test.ts`
- **Verification**: Test added ✅

---

## Dependencies

```
Tasks 1-5: Implementation (sequential) ✅ COMPLETE
    │
    ▼
Task 6: Page Object helpers ✅ COMPLETE
    │
    ▼
Tasks 7-10: E2E Tests ✅ COMPLETE
```

## Summary

All tasks completed on 2026-01-28:
- Implementation: `src/components/screens/GeneralDataScreen.tsx` modified with `hasValidated` state
- Page Object: `tests/survey.ts` extended with helper methods
- Tests: 4 new E2E tests added to `tests/form.test.ts`
