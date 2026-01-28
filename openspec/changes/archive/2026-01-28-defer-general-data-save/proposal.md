# Defer General Data Save

## Problem
Currently, the `GeneralDataScreen` updates the global form store (`setGeneralData`) on every input change. This frequent updating appears to be causing bugs and potential performance issues, possibly due to race conditions or excessive re-renders/side-effects.

## Solution
Modify `GeneralDataScreen` to only update the local component state during input changes. The global store should only be updated with the final values when the user clicks the "Continue" button (`onNext`).

The `handleNext` function already calls `setEmail` (which updates all general data fields in the store). Therefore, we can safely remove the `setGeneralData` calls from the individual `onChange` handlers without breaking functionality, ensuring data is saved only when the user intends to proceed.

## Risks
- If proper validation is not performed before `handleNext`, invalid data might be submitted (though validation logic already exists in `handleNext`).
- If other components rely on the store having live updates of these fields *while* the user is typing on this screen (unlikely given it's a wizard step), that functionality might break. We assume other components only need this data after the user moves to the next step.

## Verification
- Verify that typing in inputs works smoothly.
- Verify that clicking "Continue" saves the data to the store correctly.
- Verify that existing validation rules (email, required fields) still function.
