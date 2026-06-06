---
name: kickoff
description: Single-command session starter. Creates issue + branch, loads project context, lists available tools, and optionally starts /pipeline. Use at the start of any work session to eliminate setup overhead.
---

# Kickoff - Session Starter

Start a work session with zero ceremony. One command sets up everything.

## Arguments

- `$ARGUMENTS` - Feature description. Optionally prefix with `--no-issue` to skip GitHub issue creation.

## Steps

1. **Parse arguments**
   - If `$ARGUMENTS` starts with `--no-issue`, skip issue creation
   - Otherwise, the full argument is the feature description

2. **Create issue and branch** (unless `--no-issue`)
   - Create a GitHub issue:
     ```bash
     gh issue create -t "<title>" -b "<deliverables>"
     ```
   - Create a feature branch:
     ```bash
     git checkout main && git pull origin main
     git checkout -b feature/<short-name>
     ```

3. **If `--no-issue`**: just create a branch
   ```bash
   git checkout main && git pull origin main
   git checkout -b feature/<short-name-from-description>
   ```

4. **Load project context**
   - Read the project's CLAUDE.md, focusing on the `## Quick Start` section if it exists
   - Read `go.mod` or `package.json` to identify project type
   - Summarize: entry points, current focus, recent activity

5. **List available tools**
   - Check `.claude/skills/` — list all available skills by name
   - Check `.claude/agents/` — list all available agents by name
   - Note which plugins are active (feature-dev, playwright, etc.)

6. **Report ready state**
   ```
   Ready to work.
   - Issue: #<n> <title> (or "no issue")
   - Branch: feature/<name>
   - Project type: Go / React / Vue / mixed
   - Key files: <entry points from Quick Start>
   - Available skills: <list>
   - Available agents: <list>
   ```

7. **Offer next step**
   - Ask: "Start `/pipeline` now, or work manually?"

## Examples

```
/kickoff add webhook retry logic with exponential backoff
/kickoff --no-issue explore performance of database queries
```
