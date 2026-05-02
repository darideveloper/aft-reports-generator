# dynamic-field-options Proposal

## Summary
Currently, choice field options for Gender, Birth Range, and Job Position in the `GeneralDataScreen` are hardcoded in the frontend. This proposal aims to fetch these options dynamically from the `/api/options/` endpoint and use them in the form.

## Impact
- **User Interface:** The "Datos Generales" screen will display dynamic options for Gender, Birth Range, and Position dropdowns, fetched from the backend.
- **State Management:** The global `formStore` will be updated to fetch and store these options.
- **API Integration:** A new API client will be added to communicate with the `/api/options/` endpoint.
