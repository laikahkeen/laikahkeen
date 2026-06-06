---
name: commit
description: Create a well-crafted git commit for the current staged/unstaged changes.
---

# Commit with Meaningful Message

Create a well-crafted git commit for the current staged/unstaged changes.

## Steps

1. **Assess Changes**
   - Run `git status` to see all changed and untracked files
   - Run `git diff` to see unstaged changes
   - Run `git diff --cached` to see already-staged changes
   - Run `git log --oneline -5` to see recent commit message style

2. **Stage Files**
   - Stage relevant files individually (avoid `git add -A`)
   - Skip files that contain secrets (.env, credentials, API keys)
   - If changes span multiple unrelated concerns, ask the user whether to split into separate commits

3. **Write Commit Message**
   - Use conventional commit format: `type: short description`
   - Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`, `ci`
   - Keep the subject line under 72 characters
   - Add a body (separated by blank line) if the "why" isn't obvious from the subject
   - Focus on **why** the change was made, not **what** changed (the diff shows what)
   - Match the tone and style of recent commits in the repo

4. **Commit**
   - Create the commit using a HEREDOC for the message
   - Run `git status` after to verify success

## Rules

- Do NOT push to remote unless explicitly asked
- Do NOT amend previous commits unless explicitly asked
- Do NOT skip pre-commit hooks (no --no-verify)
- If a pre-commit hook fails, fix the issue and create a NEW commit
- Ask the user before committing if the scope of changes is unclear
