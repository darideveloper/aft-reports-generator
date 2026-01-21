# Project Context

## Purpose
The **AFT Reports Generator** is a React-based web application designed to generate reports for the AFT Dashboard. It features an invitation code validation system that grants users access to report generation tools. The application interacts with the AFT Dashboard API to validate codes and potentially submit or retrieve report data.

## Tech Stack
- **Framework:** React 19, Vite 7
- **Language:** TypeScript
- **Styling:** TailwindCSS 4, Vanilla CSS (Variables), `tw-animate-css`
- **State Management:** Zustand
- **Testing:** Playwright (E2E/Integration)
- **Icons:** Lucide React
- **UI Components:** Custom components, Radix UI primitives (`@radix-ui/react-slot`), SweetAlert2
- **Markdown:** Marked
- **Linting:** ESLint 9, TypeScript ESLint

## Project Conventions

### Code Style
- **Linting:** strict ESLint configuration with TypeScript support.
- **Formatting:** Standard Prettier-like formatting (implied).
- **Naming:** PascalCase for components, camelCase for functions/variables. kaba-case for filenames is not strictly enforced but component files use PascalCase.

### Architecture Patterns
- **Feature-based & Screen-based:** Components are organized by screens (`src/components/screens`) and reusable UI elements (`src/components/ui`).
- **State Management:** Global state is managed via Zustand (`src/store`), specifically for handling multi-step form data.
- **Utilities:** Shared logic resides in `src/lib`.
- **Assets:** Static resources in `src/assets`.

### Styling Strategy
- **Semantic Color Tokens:** **CRITICAL**. Do not hardcode colors. Use the semantic tokens defined in `BRAND_COLORS.md` and `src/index.css` (e.g., `--primary`, `--secondary`, `--muted`).
- **Tailwind Integration:** Tailwind is configured to use these CSS variables. Use utility classes like `bg-primary`, `text-foreground`.
- **Dark Mode:** Fully supported via CSS variables and the `.dark` class.
- **Typography:** Uses 'ReemKufi' as the primary font family.

### Testing Strategy
- **Playwright:** Used for End-to-End and component testing.
- **Environment:** Tests run in `local` or `production` modes via `NODE_ENV`.

### Git Workflow
- Standard feature-branch workflow.
- Commit messages should likely follow conventional commits (though not explicitly enforced in config saw so far).

## Domain Context
- **Invitation System:** Users need a valid invitation code to access the main functionality.
- **Report Generation:** The core domain is creating reports, likely text-based or structured data reports.
- **AFT Dashboard:** The parent system this app serves; API interaction handles validation and data exchange.

## Important Constraints
- **Brand Identity:** Must strictly adhere to the defined brand colors and typography.
- **Responsive Design:** Mobile-first approach using Tailwind.
- **Environment Variables:** Must utilize `VITE_` prefix for any client-side environment variables.

## External Dependencies
- **AFT Dashboard API:** `https://aft-dashboard.apps.darideveloper.com/api` (configurable via env).
- **Fonts:** ReemKufi (local font file).
