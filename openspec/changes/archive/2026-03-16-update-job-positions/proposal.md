# Proposal: Update Job Positions List

## Why
The current list of job positions (POSITION_CHOICES) in the `GeneralDataScreen` is missing several important options, specifically "Vicepresidente", which prevents users with this role from accurately selecting their position.

## What Changes
Update the hardcoded `POSITION_CHOICES` array in `src/components/screens/GeneralDataScreen.tsx` to include "Vicepresidente" and ensure it matches the expanded list provided by the user.

## Impact
- **User Interface:** The "Posición" dropdown in the "General Data" screen will display more options.
- **Data Integrity:** Users will be able to provide more accurate demographic data.
- **Persistence:** The new position choice will be correctly saved to and loaded from the store/localStorage.
