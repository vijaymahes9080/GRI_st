# Enterprise Specification: Contributing Guidelines & Code Review

## 1. Git Workflow
- `main`: Production release branch.
- `develop`: Staging integration branch.
- `feature/<domain>-<description>`: Isolated feature branches (e.g. `feature/academics-timetable`).

---

## 2. Pull Request Checklist
1. `npm run typecheck` passes with **0 TypeScript errors**.
2. `npm run lint` passes with **0 ESLint warnings**.
3. `npm test` passes all Jest unit and component tests.
