# Proposal: Add Department Field to General Data Screen

This proposal outlines the changes required to add a new "Department" field to the General Data screen of the AFT Reports Generator. The field will be a dropdown populated by options fetched from the backend.

## Problem
The backend has been updated to include a "department" field for participants, but the frontend currently only captures name, email, gender, birth range, and position.

## Solution
1.  Update the API client to include the `department` options in the form options response.
2.  Update the Zustand store to hold the `department` value and provide actions to update it.
3.  Modify the `GeneralDataScreen` component to render a dropdown for "Área" and validate it.
4.  Update the test suite to ensure the new field is correctly handled during form submission and progress persistence.

## Impact
- **Store:** `emailResponse` in `formStore` will now include `department`.
- **UI:** A new dropdown will appear on the General Data screen with the label "Área".
- **Persistence:** The `department` field will be saved and restored as part of the form progress.
- **Tests:** `generalDataScreen` helper and related tests will be updated to handle the new field.
