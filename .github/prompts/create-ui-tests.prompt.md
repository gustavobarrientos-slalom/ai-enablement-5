---
description: "Create UI tests for required critical user journeys"
agent: test-engineer
tools: ['search', 'read', 'edit', 'execute', 'todo']
---

# Create UI Tests

Create Playwright UI tests for critical user journeys.

## Input

- `journeys` (optional): ${input:journeys:Comma-separated list of journeys to cover (leave blank for the default set)}

## Instructions

1. If `journeys` is not provided, use the default set: create, edit, toggle, delete, and core error-state handling.
2. **HARD LIMIT**: create a maximum of 5 Playwright tests for this run (target 3-5 total).
3. Include at least 1 error-path test within the 3-5 total.
4. If more than 5 candidate scenarios exist, select the highest-risk 5 and list the deferred scenarios instead of creating more tests.
5. Generate or update UI tests using the project's UI test framework (Playwright).
6. Prefer stable selectors and state-based waits.
7. Apply Page Object Model (POM): place reusable interactions/selectors in page objects and keep tests scenario-focused.
8. Before finishing, verify the count of created/updated Playwright test cases (`test(...)` / `it(...)`) and reduce to <= 5 if over the limit.
9. Do not claim "small scope" if the final authored count is greater than 5.
10. Report files changed and scenarios covered.
