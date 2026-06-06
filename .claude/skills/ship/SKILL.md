---
name: ship
description: Update docs, commit on a feature branch, push, and open a PR. Never pushes directly to main.
---

# Ship - Docs, Commit, Branch, PR

Complete workflow to ship code changes via a pull request — never direct push to main.

## Steps

1. **Check Current State**
   - Run `git status` to see all changes
   - Run `git diff --staged` to see staged changes
   - Run `git diff` to see unstaged changes
   - Run `git branch --show-current` and `git log -5 --oneline`

2. **Analyze Impact**
   - What features/fixes are included?
   - Did any milestones get completed?
   - Are there any new API endpoints or env vars?
   - Pick a clear PR title (under 70 chars) and a commit type: `feat`, `fix`, `refactor`, `docs`, `chore`

3. **Update Documentation** (if code changes are significant)
   - Update CLAUDE.md project status
   - Update `docs/project_spec.md` milestone checkboxes
   - Update `.env.example` if new env vars
   - Skip doc updates for trivial changes (typos, small fixes)

4. **Verify Before Commit**
   - For frontend changes: `cd frontend && pnpm lint && pnpm build`
   - For backend changes: `make lint && make test`
   - Fix any failures before continuing — never `--no-verify`

5. **Branch (if currently on `main`)**
   - If `git branch --show-current` returns `main`, create a feature branch:
     `git checkout -b <type>/<short-slug>` (e.g. `feat/guides-content`, `fix/auth-race`)
   - If already on a feature branch, stay on it
   - Slug rules: lowercase, hyphenated, derived from the change scope. Keep under ~40 chars.

6. **Stage and Commit**
   - Stage code + docs together
   - Commit message format:
     ```
     <type>: <description>

     [optional body explaining what and why — wrap at 72 cols]

     [Closes #N if applicable]
     ```
   - ALWAYS pass via HEREDOC to preserve formatting
   - Include `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`

7. **Push the Feature Branch**
   - `git push -u origin <branch>` (sets upstream)
   - Never `git push origin main`. If the user explicitly says "push to main", confirm first.

8. **Open the PR**
   - Use `gh pr create --base main --title "<title>" --body "<body>"`
   - PR body template (HEREDOC):
     ```
     ## Summary
     - <1–3 bullets>

     ## Test plan
     - [ ] <verification step>
     - [ ] <verification step>

     <Closes #N if applicable>

     🤖 Generated with [Claude Code](https://claude.com/claude-code)
     ```
   - Return the PR URL in the final output

## When to Skip Doc Updates

- Typo fixes
- Minor code cleanup
- Dependency bumps (unless breaking)
- Test-only changes

## Output

Report:
- What was committed (commit SHA + one-line summary)
- Documentation changes (if any)
- Feature branch name
- PR URL
- Whether build/lint/tests passed

## Guardrails

- NEVER push directly to `main`. Always go through a PR.
- NEVER use `--no-verify`, `--force`, or `--no-edit`.
- If pre-commit hooks fail, fix the underlying issue and create a new commit (do not amend).
- If the user has uncommitted unrelated changes, ask before staging — do not bundle unrelated work.
