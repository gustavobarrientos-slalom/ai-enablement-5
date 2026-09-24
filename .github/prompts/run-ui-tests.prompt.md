---
description: "Run UI tests and summarize failures"
agent: test-engineer
tools: ['read', 'execute', 'todo']
---

# Run UI Tests

Run the project's Playwright UI tests and summarize the results.

## Instructions

1. **REQUIRED first step** before `/run-ui-tests`: run `npm run test:ui:install --workspace=frontend` (repeat after any container rebuild).
   - In Ubuntu/Linux environments, `test:ui:install` is mandatory and must perform `playwright install --with-deps chromium` before running tests.
   - `test:ui:install` includes automatic bounded Ubuntu repo remediation for the common Yarn key issue, plus one retry.
   - Do NOT perform ad-hoc package hunting or broad OS troubleshooting beyond that automated remediation.
   - If install still fails, stop immediately and report an environment blocker with the failing command and key error lines.
   - Do not continue to run Playwright tests after a failed dependency install.
2. Ensure both backend and frontend are running before executing UI tests (start from repo root with `npm start` if needed).
3. Run UI tests using the project command (e.g., `npm run test:ui`).
4. Summarize pass/fail results.
5. For failures, provide likely root cause categories: application code, test code, or environment.
