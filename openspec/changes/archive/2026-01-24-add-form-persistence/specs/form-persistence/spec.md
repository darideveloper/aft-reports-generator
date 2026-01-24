# Capability: Form Persistence

The system SHALL allow users to resume their progress in a multi-step form based on their email address.

## ADDED Requirements

### Requirement: Automatic Progress Saving
The system SHALL save the user's current responses and progress index to the backend every time they navigate to a new screen.

#### Scenario: User proceeds to next screen
- **WHEN** the user clicks "Continuar" and validation passes
- **THEN** the system SHALL send the current form state to `POST /progress`
- **AND** the system SHALL navigate to the next screen regardless of the save request outcome (optimistic navigation)

### Requirement: Progress Restoration
The system SHALL check for existing progress when a user validates their email and offer to restore it.

#### Scenario: User validates email with existing progress
- **WHEN** a user enters an email and clicks "Validar"
- **AND** the backend returns saved progress for that email and survey ID
- **THEN** the system SHALL display a confirmation prompt (e.g., SweetAlert2) asking to resume
- **WHEN** the user confirms
- **THEN** the system SHALL populate the form with saved data and jump to the last saved step index

#### Scenario: User validates email with no existing progress
- **WHEN** a user enters an email and clicks "Validar"
- **AND** the backend returns no saved progress
- **THEN** the system SHALL allow the user to continue with a fresh form

### Requirement: Final Submission Sync
The system SHALL mark the progress as finished in the backend upon final form submission.

#### Scenario: User completes the form
- **WHEN** the user reaches the completion screen
- **THEN** the system SHALL send a final `POST /complete-form` (or similar) to mark the record as finished
