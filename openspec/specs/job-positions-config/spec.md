# job-positions-config Specification

## Purpose
TBD - created by archiving change update-job-positions. Update Purpose after archive.
## Requirements
### Requirement: Job Position Options
The `GeneralDataScreen` MUST provide a predefined list of job positions for users to select.

#### Scenario: Selection of Vicepresidente
- **GIVEN** a user is on the "Datos Generales" screen
- **WHEN** the user opens the "Posición" dropdown
- **THEN** they SHOULD see "Vicepresidente" (value: `vicepresidente`) as a selectable option.
- **AND** upon selection, the value `vicepresidente` MUST be stored in the local state.
- **AND** upon clicking "Siguiente", the value `vicepresidente` MUST be persisted to the global store and `localStorage`.

#### Scenario: Full List of Choices
- **GIVEN** the application's configuration
- **THEN** the following positions MUST be included in the `POSITION_CHOICES` constant:
  - `analista`: "Analista"
  - `asesor`: "Asesor"
  - `auxiliar`: "Auxiliar"
  - `contralor`: "Contralor"
  - `coordinador`: "Coordinador"
  - `director`: "Director"
  - `director_general`: "Director General"
  - `director_general_adjunto`: "Director General Adjunto"
  - `enlace_informacion`: "Enlace de Información"
  - `manager`: "Gerente"
  - `inspector`: "Inspector"
  - `investigador`: "Investigador"
  - `jefe_departamento`: "Jefe de Departamento"
  - `operator`: "Operador"
  - `secretario_ejecutivo`: "Secretario Ejecutivo"
  - `subdirector`: "Subdirector"
  - `subsecretario`: "Subsecretario"
  - `supervisor`: "Supervisor"
  - `vicepresidente`: "Vicepresidente"
  - `other`: "Otro"

