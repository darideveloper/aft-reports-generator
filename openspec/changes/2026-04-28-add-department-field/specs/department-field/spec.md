# Spec Delta: Department Field

## ADDED Requirements

### Requirement: Collect Participant Area
The system MUST collect the participant's area in addition to other general data.

#### Scenario: Selecting an area
- **Given** the user is on the General Data screen
- **When** the user selects an area from the "Área" dropdown
- **Then** the selected area MUST be stored in the form state.

### Requirement: Mandatory Area Field
The area field MUST be mandatory.

#### Scenario: Missing area
- **Given** the user has filled all general data fields except "Área"
- **When** the user clicks "Continuar"
- **Then** an error message MUST be displayed and the user MUST NOT proceed to the next screen.

### Requirement: Persist and Restore Area
The area field MUST be persisted and restored.

#### Scenario: Restoring progress with area
- **Given** the user previously saved progress with a selected area
- **When** the user resumes their progress
- **Then** the "Área" field MUST be pre-populated with the saved value.

### Requirement: Submit Area in Final Response
The area field MUST be included in the final survey response submission.

#### Scenario: Submitting the form
- **Given** the user has completed all questions
- **When** the user submits the form
- **Then** the "department" field MUST be included in the participant data sent to the backend.
