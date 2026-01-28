# General Data Screen Handling

## ADDED Requirements

### Requirement: Defer Store Update
The system SHALL NOT update the global form store (`useFormStore`) on individual input changes handling `email`, `name`, `gender`, `birthRange`, or `position` in the `GeneralDataScreen`. Updates SHALL ONLY occur when the user explicitly triggers the navigation to the next screen.

#### Scenario: User types in name field
- **GIVEN** the user is on the General Data Screen
- **WHEN** the user types "John Doe" in the Name input
- **THEN** the local component state SHALL update to "John Doe"
- **AND** the global store `emailResponse.name` SHALL NOT change immediately

#### Scenario: User clicks continue
- **GIVEN** the user has filled out all valid general data
- **WHEN** the user clicks the "Continuar" button
- **THEN** the global store `emailResponse` SHALL be updated with all current values (`email`, `name`, `gender`, `birthRange`, `position`)
- **AND** the application SHALL navigate to the next screen
