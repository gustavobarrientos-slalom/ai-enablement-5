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
