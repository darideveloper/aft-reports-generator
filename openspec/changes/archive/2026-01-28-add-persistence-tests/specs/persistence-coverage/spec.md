# Spec: Persistence Coverage

## ADDED Requirements

### Requirement: Persistence Testing Framework
The automated testing suite MUST verify the integrity of the user session persistence feature.

#### Scenario: User Resumes Session
- **Given** a user has started a survey and completed at least one question screen.
- **And** the user leaves the application and returns.
- **When** the user enters the same email address in the General Data screen.
- **Then** the system must prompt the user to resume their progress.
- **When** the user attempts to resume.
- **Then** the application must restore the user to their last visited screen.

#### Scenario: User Discards Session
- **Given** a user has saved progress.
- **When** the user enters the same email address.
- **And** the user chooses "No, start over" at the prompt.
- **Then** the application must NOT restore the previous state.
- **And** the user must proceed to the first question screen standardly.

#### Scenario: Session Cleanup
- **Given** a user has completed and submitted a survey.
- **When** the user returns with the same email.
- **Then** the system must NOT prompt to resume progress (persistence record is deleted).
