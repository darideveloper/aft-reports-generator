# Spec: Progress Persistence Data Integrity

## Background
The application allows users to save their progress and resume later. Data integrity must be maintained through the Save/Load cycle to ensure final submission succeeds.

## MODIFIED Requirements

### Requirement: Data Loading
The application MUST sanitize data when loading saved progress from the API to ensure no double-serialization occurs.

#### Scenario: Sanitize Double-Quoted Strings
-   **Given** the saved progress data contains string fields wrapped in extra quotes (e.g., `position: "\"director_general\""`).
-   **When** the application loads this progress.
-   **Then** the application state MUST contain the clean string value (e.g., `position: "director_general"`).
-   **And** the user MUST be able to submit the form successfully without "Invalid data" errors.
