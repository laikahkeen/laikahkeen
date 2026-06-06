---
name: update-docs
description: Analyze recent code changes and update all project documentation accordingly.
---

# Update Documentation

Analyze recent code changes and update ALL project documentation accordingly.

## Steps

1. **Analyze Changes**
   - Run `git status` to see current changes
   - Run `git diff HEAD~5 --stat` to see recent changes (or since last doc update)
   - Run `git log --oneline -10` to see recent commits
   - Identify what was added, modified, or completed

2. **Update CLAUDE.md**
   - Update "Current Milestone" section
   - Update "Completed" list with newly completed items
   - Update "Next" section if priorities changed
   - Update tech stack table if technologies changed

3. **Update docs/architecture.md**
   - Update tech stack table if technologies changed
   - Update repository structure if files/folders changed
   - Update API endpoints if changed
   - Update any diagrams if architecture changed

4. **Update Other Files If Needed**
   - `docs/product.md`: If features/UX changed
   - `.env.example` or `backend/.env.example`: If new env vars added
   - `CONTRIBUTING.md`: If workflow changed
   - `project-spec.md`: If project overview needs updating

## Checklist

Before finishing, verify:

- [ ] All doc files checked: CLAUDE.md, docs/\*.md
- [ ] Tech stack mentions are consistent across all docs
- [ ] File structures match actual codebase
- [ ] No stale information (old file names, removed features)

## Output

After running, report:

- What documentation was updated
- What was marked complete
- Current project status summary
