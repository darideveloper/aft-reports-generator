# Proposal: Fix Email Validation Feedback

## Summary
Fix the bug where email validation success/error messages appear prematurely when the email input changes, rather than only after clicking the "Validar" button.

## Problem Statement
Currently, in `GeneralDataScreen.tsx`, the "✅ Email válido - Puedes continuar" message appears every time the email changes, even when:
1. The email is invalid
2. The user has not clicked the "Validar" button

### Root Cause
The bug is caused by the `useEffect` at line 36-48 which sets `isValid` to `true` whenever `emailResponse.email` has a value:

```typescript
React.useEffect(() => {
  if (emailResponse) {
    // ...other syncs...
    if (emailResponse.email) setIsValid(true)  // <-- BUG: Line 46
  }
}, [emailResponse])
```

This effect fires whenever `emailResponse` changes (e.g., when loading saved progress), but it also inadvertently marks the email as valid without going through the actual validation flow.

Additionally, the `handleInputChange` function (lines 219-230) clears error states but doesn't track whether validation has been explicitly requested:

```typescript
const handleInputChange = (value: string) => {
  setLocalEmail(value)
  setGeneralData('email', value)
  if (error) setError('')
  if (emailError) setEmailError('')
  setIsValid(false)  // Resets validation, but useEffect can override this
}
```

## Proposed Solution
Introduce a new state variable `hasValidated` to track whether the user has explicitly clicked the "Validar" button. Only show validation feedback (both success and error messages) when:
1. `hasValidated` is `true` (user clicked the button)
2. The appropriate validation result is set

### Key Changes
1. Add `hasValidated` boolean state, initialized to `false`
2. Set `hasValidated = true` when `handleValidate` is called
3. Reset `hasValidated = false` when email input changes
4. Conditionally render validation feedback based on `hasValidated`
5. Adjust the useEffect to only restore `isValid` from saved progress WITHOUT triggering visual feedback

## Impact
- **User Experience**: Users will only see validation feedback after explicitly clicking the "Validar" button
- **Backward Compatibility**: No API changes; purely UI/UX fix
- **Progress Restoration**: Saved progress will still correctly restore the `isValid` state, but without showing the success message until revalidation

## Testing Strategy

### Test Location
Tests will be added to **`tests/form.test.ts`** because:
- This file contains core form flow tests (guest code, email validation, form submission)
- Existing tests `valid_email` and `invalid_email_already_exists` already test email validation
- The bug is NOT related to persistence, so `tests/persistence.test.ts` is not appropriate

### Test Coverage
| Test Name | Purpose |
|-----------|---------|
| `email_validation_message_hidden_before_validate` | Verify NO message appears before clicking Validar |
| `email_validation_message_shown_after_validate` | Verify message appears AFTER clicking Validar |
| `email_validation_message_hides_on_email_change` | Verify message disappears when email is modified |
| `email_error_message_only_after_validate` | Verify error message only appears after clicking Validar |

### Page Object Updates
The `SurveyPage` class in `tests/survey.ts` will be extended with:
- `isEmailValidationMessageVisible()` - Helper to check success message visibility
- `isEmailErrorMessageVisible()` - Helper to check error message visibility

## Files to Modify
| File | Changes |
|------|---------|
| `src/components/screens/GeneralDataScreen.tsx` | Add `hasValidated` state, update rendering logic |
| `tests/survey.ts` | Add helper methods for validation message visibility |
| `tests/form.test.ts` | Add 4 new E2E tests |

## Out of Scope
- Changes to the email validation API
- Changes to the progress saving/restoration logic (other than preserving `hasValidated` state)
- Changes to other screens or components
