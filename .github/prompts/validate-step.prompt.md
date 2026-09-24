---
description: "Validate that all success criteria for the current step are met"
agent: code-reviewer
tools: ['search', 'read', 'execute', 'web', 'todo']
---

# Validate Step

Validate that all success criteria for a given step have been met.

## Input

- `step-number` (REQUIRED): ${input:step-number:Step number to validate, e.g. "5-0" or "5-1"}

## Instructions

1. Use the `gh` CLI to find the main exercise issue (see **Workflow Utilities** in [copilot-instructions.md](../copilot-instructions.md)) - look for an issue with "Exercise:" in the title.
2. Get the issue with comments: `gh issue view <issue-number> --comments`.
3. Search through the issue comments to find `# Step {step-number}:`.
4. Extract the **Success Criteria** section from that step's comment.
5. Check each criterion against the current workspace state (file existence, content, test results, lint results, git history, etc.).
6. Report completion status for each criterion (✅/❌) with specific guidance for any incomplete items.
