# department-field Specification

## Purpose
TBD - created by archiving change add-department-field. Update Purpose after archive.
## Requirements
### Requirement: Collect Participant Department
The system MUST collect the participant's department in addition to other general data.

#### Scenario: Selecting a department
- **Given** the user is on the General Data screen
- **When** the user selects a department from the "Departamento" dropdown
- **Then** the selected department MUST be stored in the form state.

### Requirement: Mandatory Department Field
The department field MUST be mandatory.

#### Scenario: Missing department
- **Given** the user has filled all general data fields except "Departamento"
- **When** the user clicks "Continuar"
- **Then** an error message MUST be displayed and the user MUST NOT proceed to the next screen.

### Requirement: Persist and Restore Department
The department field MUST be persisted and restored.

#### Scenario: Restoring progress with department
- **Given** the user previously saved progress with a selected department
- **When** the user resumes their progress
- **Then** the "Departamento" field MUST be pre-populated with the saved value.

### Requirement: Submit Department in Final Response
The department field MUST be included in the final survey response submission.

#### Scenario: Submitting the form
- **Given** the user has completed all questions
- **When** the user submits the form
- **Then** the "department" field MUST be included in the participant data sent to the backend.

