# dynamic-options Specification

## MODIFIED Requirements
### Requirement: Job Position Options
The `GeneralDataScreen` MUST provide a list of job positions for users to select, fetched dynamically from the API.

#### Scenario: Selection of dynamically fetched option
- **GIVEN** a user is on the "Datos Generales" screen
- **WHEN** the screen loads
- **THEN** it SHOULD fetch options from the `/api/options/` endpoint and populate the Position dropdown.
- **AND** upon selection, the value MUST be stored in the local state and persisted correctly.

## ADDED Requirements
### Requirement: Dynamic General Data Options
The `GeneralDataScreen` MUST fetch and display choice options for Gender, Birth Range, and Position dynamically from the `/api/options/` endpoint.

#### Scenario: Display dynamic options
- **GIVEN** a user navigates to the "Datos Generales" screen
- **WHEN** the form options are fetched from the API
- **THEN** the Gender, Birth Range, and Position dropdowns MUST display the options returned by the API.
