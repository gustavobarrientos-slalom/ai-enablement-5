# Patterns Discovered

Accumulated code patterns and lessons learned over time. This file is committed to git - add to it whenever a reusable pattern emerges during development.

## Pattern Template

```markdown
## <Pattern Name>

- **Context**: Where/when this pattern applies
- **Problem**: What issue does this solve?
- **Solution**: The approach taken
- **Example**: Short code snippet or description
- **Related Files**: Paths to files where this pattern is used
```

---

## Example

## Service Initialization: Empty Array vs Null

- **Context**: Initializing collections returned by backend services (e.g., todo lists) before data has loaded.
- **Problem**: Returning `null` for an uninitialized collection forces every consumer to null-check before iterating, leading to defensive code scattered throughout the codebase and occasional runtime errors (`Cannot read properties of null`).
- **Solution**: Always initialize collection-like service state to an empty array (`[]`) rather than `null` or `undefined`. Consumers can safely `.map()`/`.filter()` immediately, and "no data yet" is indistinguishable from "no data" for rendering purposes - both correctly render an empty state.
- **Example**:

  ```javascript
  // Prefer this:
  let todos = [];

  // Avoid this:
  let todos = null;
  ```

- **Related Files**: `packages/backend/src/services/*`, `packages/frontend/src/hooks/*`

---

## React Query: Surfacing Fetch Errors with `isError`

- **Context**: Displaying a user-facing error state when a `useQuery` fetch fails (e.g., backend unavailable).
- **Problem**: Without explicit error handling, a failed fetch just leaves stale/empty data on screen with no feedback, and an unhandled rejection inside `queryFn` can look like a silent failure.
- **Solution**: Throw inside `queryFn` when `response.ok` is false, then read the `isError` flag from `useQuery` to conditionally render an `Alert`/error message.
- **Example**:

  ```javascript
  const { data, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Failed to fetch todos');
      return response.json();
    },
  });

  {isError && <Alert severity="error">Something went wrong...</Alert>}
  ```

- **Related Files**: `packages/frontend/src/App.js`

## Relative API URLs Instead of Hardcoded Hosts

- **Context**: Frontend code fetching from a backend API during local development, CI, and production.
- **Problem**: Hardcoding `http://localhost:3001/api/...` breaks in any environment where the backend isn't on that exact host/port (Codespaces, CI, production, containerized dev).
- **Solution**: Use a relative URL (e.g., `/api/todos`) and rely on the dev server proxy (CRA `proxy` field) or a reverse proxy/same-origin deployment in production.
- **Related Files**: `packages/frontend/src/App.js`

## Playwright + Page Object Model for UI Test Scope Control

- **Context**: Authoring a small, high-value set of Playwright UI tests (3-5) for critical user journeys.
- **Problem**: Without a shared abstraction, each test duplicates selectors/interactions, making tests brittle and harder to keep within a tight test-count budget.
- **Solution**: Put all page interactions (fill inputs, click buttons, locate list items) in a `TodoPage` class; keep test files focused purely on scenario steps and assertions. This keeps the actual test count easy to audit and reason about.
- **Related Files**: `packages/frontend/tests/ui/pages/todo-page.js`, `packages/frontend/tests/ui/e2e.spec.js`

## Environment Blocker: Local Playwright Browser Install Hangs

- **Context**: Running `npx playwright install chromium` in a sandboxed local dev environment.
- **Problem**: The Chromium download completes to 100%, but the install process can hang indefinitely afterward with no further network activity - not a code or test-authoring issue.
- **Solution**: Treat this as an environment blocker per the `/run-ui-tests` prompt contract: stop, report the blocker, and rely on CI/Codespaces (where the install completes normally) to execute the authored UI tests.
- **Related Files**: `packages/frontend/scripts/install-playwright.js`, `packages/frontend/playwright.config.js`
