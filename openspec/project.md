# Project Context

## Purpose
The **AFT Reports Generator** is a multi-step survey and report generation application. It is designed to collect structured feedback through a series of screens, starting with invitation code validation and participant demographic data, followed by themed survey questions. The application ensures data integrity and user progress persistence, ultimately submitting collected responses to the AFT Dashboard API.

## Tech Stack
- **Framework:** React 19.2+, Vite 7.1+
- **Language:** TypeScript 5.8+
- **Styling:** TailwindCSS 4.1+, Vanilla CSS (Variables), `tw-animate-css`
- **State Management:** Zustand 5.0+ (Global form state and persistence)
- **Persistence:** LocalStorage and API-based progress tracking
- **Testing:** Playwright 1.55+ (E2E and Integration testing)
- **Icons:** Lucide React
- **UI Components:** Custom components, Radix UI primitives (`@radix-ui/react-slot`), SweetAlert2 for notifications
- **Markdown:** Marked (for rendering survey content/instructions)
- **Linting:** ESLint 9, TypeScript ESLint

## Project Conventions

### Code Style
- **Linting:** Strict ESLint configuration.
- **Formatting:** Standard Prettier-like formatting.
- **Naming:** 
  - PascalCase for components and component files (e.g., `MultiScreenForm.tsx`).
  - camelCase for functions and variables.
  - kebab-case for utility files and non-component modules (e.g., `email-validation.ts`).
- **Conditional Classes:** Always use the `clsx` library instead of Astro-style `class:list` or template literals for complex conditional logic.

### Architecture Patterns
- **Screen-based Routing:** Instead of a traditional router, the app uses a state-driven multi-screen approach (`src/components/screens`).
- **Store-first Logic:** Most business logic and form state reside in the Zustand store (`src/store/formStore.ts`).
- **API Layer:** Isolated API interaction logic in `src/lib/api`.
- **Atomic UI:** Small, reusable UI primitives in `src/components/ui`.

### Styling Strategy
- **Semantic Tokens:** **MANDATORY**. All colors must use CSS variables defined in `src/index.css` and mapped in `BRAND_COLORS.md` (e.g., `--primary`, `--secondary`, `--accent`).
- **Tailwind v4:** Uses the new `@tailwindcss/vite` plugin.
- **Responsive:** Mobile-first design using standard Tailwind breakpoints.
- **Themes:** Light/Dark mode support via the `.dark` class on the root element.

### Testing Strategy
- **End-to-End:** Playwright tests cover the entire user journey (invitation -> general data -> questions -> completion).
- **Persistence Tests:** Specific tests to verify that form state is correctly saved and restored.
- **Mocking:** API calls are typically mocked or pointed to a local/test environment using `NODE_ENV`.

### Git Workflow
- **Conventional Commits:** Must follow the Conventional Commits specification (e.g., `feat:`, `fix:`, `chore:`, `docs:`).

## Domain Context
- **Invitation System:** A gatekeeping mechanism where a unique code determines which survey a user can access.
- **Progressive Disclosure:** The form is revealed screen by screen to reduce cognitive load.
- **Survey Data:** Responses are structured as a collection of answers linked to specific survey identifiers.
- **AFT Dashboard Integration:** The backend source of truth for surveys, invitation codes, and progress storage.

## Important Constraints
- **Brand Fidelity:** Strict adherence to the AFT color palette and typography ('ReemKufi').
- **Accessibility:** Ensure all form inputs have proper labels and ARIA attributes where necessary.
- **No Direct Store Mutation:** Always use store actions to update state.
- **Persistence Sanitization:** Data loaded from persistence must be sanitized (e.g., removing extra quotes from string values).

## External Dependencies
- **API URL:** `https://aft-dashboard.apps.darideveloper.com/api` (configurable via `VITE_API_URL`).
- **Fonts:** 'ReemKufi' (embedded in `public/fonts`).
