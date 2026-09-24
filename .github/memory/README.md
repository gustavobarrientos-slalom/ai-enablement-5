# Memory System

## Purpose

Track patterns, decisions, and lessons learned during development so that both AI and human collaborators can build on prior work instead of rediscovering it every session.

## Two Types of Memory

| Type | Location | Lifetime | Committed? |
|------|----------|----------|------------|
| **Persistent Memory** | `.github/copilot-instructions.md` | Foundational, rarely changes | Yes |
| **Working Memory** | `.github/memory/` | Evolves as you work | Mostly (see below) |

- **Persistent Memory** (`.github/copilot-instructions.md`) holds the foundational principles, workflows, and standards for the project. It's created once and referenced constantly.
- **Working Memory** (`.github/memory/`) captures what's been *discovered* while working: patterns, decisions, session summaries, and in-progress notes.

## Directory Structure

```text
.github/memory/
├── README.md                 # This file - explains the memory system
├── session-notes.md          # Historical summaries of completed sessions (committed)
├── patterns-discovered.md    # Accumulated code patterns and lessons (committed)
└── scratch/
    ├── .gitignore             # Ignores everything in scratch/ (*)
    └── working-notes.md       # Active session notes (NOT committed)
```

## When to Use Each File

- **`scratch/working-notes.md`** - Use *during* active development. Jot down the current task, approach, findings, decisions, blockers, and next steps as you go. This file is ephemeral and reset/overwritten between sessions - it is never committed.
- **`session-notes.md`** - Use at the *end* of a session. Summarize what was accomplished, key findings, decisions, and outcomes from `working-notes.md` into a permanent historical record.
- **`patterns-discovered.md`** - Use whenever you discover a *reusable pattern* (a recurring approach, gotcha, or convention). Add it here so future sessions don't need to rediscover it.

## How AI Reads and Applies These Patterns

During TDD, linting, and debugging workflows, AI should:

1. Check `.github/copilot-instructions.md` for foundational principles first.
2. Check `.github/memory/patterns-discovered.md` for known patterns relevant to the current task.
3. Check `.github/memory/session-notes.md` for relevant historical context.
4. Record new findings in `.github/memory/scratch/working-notes.md` while working.
5. At the end of the session, promote important findings into `session-notes.md` and `patterns-discovered.md`.

## Key Difference: Historical vs. Active

- **`session-notes.md`** is for **completed session summaries** - polished, permanent, and committed to git as a historical record.
- **`scratch/working-notes.md`** is for **active work in progress** - messy, temporary, and never committed. It exists purely to help the current session stay organized; its contents should be distilled into `session-notes.md` before the session ends.
