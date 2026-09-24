---
description: "Execute instructions from the current GitHub Issue step"
agent: tdd-developer
tools: ['search', 'read', 'edit', 'execute', 'web', 'todo']
---

# Execute Step

Execute the instructions for the current step of the Session 5 exercise, autonomously working through each activity.

## Input

- `issue-number` (optional): ${input:issue-number:GitHub issue number (leave blank to auto-detect the exercise issue)}

## Instructions

1. If `issue-number` is not provided, use the `gh` CLI to find the exercise issue (see **Workflow Utilities** in [copilot-instructions.md](../copilot-instructions.md)) - look for an issue with "Exercise:" in the title.
2. Get the issue content with comments: `gh issue view <issue-number> --comments`.
3. Parse the latest step instructions from the issue (the most recent `# Step X-Y:` comment).
4. Execute each `:keyboard: Activity:` section systematically, in order.
   - **Scope boundary**: Do NOT create or run Playwright UI tests in this prompt.
   - **Handoff rule**: Use `/create-ui-tests` and `/run-ui-tests` for Playwright UI work (these auto-switch to `test-engineer`).
5. Follow the testing scope constraints from [copilot-instructions.md](../copilot-instructions.md) - Jest + Supertest for backend, React Testing Library for frontend component behavior.
6. **DO NOT commit or push changes** - that's the job of `/commit-and-push`.
7. Stop after completing the activities and provide the next commands to run, in this order:
   - If the current step requires UI workflow: `/create-ui-tests` → `/run-ui-tests` → `/validate-step {step-number}`
   - If UI workflow is not required: `/validate-step {step-number}`
   - Never recommend `/validate-step` before required UI prompts
