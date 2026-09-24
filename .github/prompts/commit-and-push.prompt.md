---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ['read', 'execute', 'todo']
---

# Commit and Push

Analyze the current changes, generate a descriptive commit message, and push to a feature branch.

## Input

- `branch-name` (REQUIRED): ${input:branch-name:Name of the feature branch to commit and push to}

If no branch name is provided, ask the user for it before proceeding.

## Instructions

1. If the current step includes a required UI workflow, also run `npm run test:ui` (or require a successful `/run-ui-tests` in the current chat) before committing.
2. Analyze changes using `git diff` (and `git status` for untracked files).
3. Generate a descriptive commit message using conventional commit format (see **Git Workflow** in [copilot-instructions.md](../copilot-instructions.md)).
4. Create the specified branch if it doesn't exist: `git checkout -b <branch-name>`.
5. If the branch exists, switch to it: `git checkout <branch-name>`.
6. Stage all changes: `git add .`.
7. Commit with the generated message.
8. Push to the specified branch: `git push origin <branch-name>`.
9. **DO NOT commit to `main` or any other branch** - ONLY use the user-provided branch name.
