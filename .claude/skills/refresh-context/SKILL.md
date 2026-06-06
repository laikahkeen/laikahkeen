---
name: refresh-context
description: Generate or update the Quick Start section in this project's CLAUDE.md. Reads git log, open issues, and file structure to create current project context. Run manually or via scheduled trigger.
---

# Refresh Context - Auto-Generate Quick Start

Update the project's CLAUDE.md with current context so new sessions start with full project knowledge.

## What It Does

Generates a `## Quick Start` section with:
- **Entry points**: Main files (main.go, App.tsx, index.ts, etc.)
- **Current focus**: Open GitHub issues
- **Key patterns**: Architecture insights from existing CLAUDE.md
- **Recent activity**: Last 10 commits summarized
- **Open issues**: From `gh issue list`

## Steps

1. **Detect project type**
   - Check for `go.mod` → Go project
   - Check for `turbo.json` → Monorepo
   - Check for `package.json` → Node/React/Vue project
   - Check for both `go.mod` and `package.json` (or frontend/ subdir) → Full-stack

2. **Gather data**
   ```bash
   git log --oneline -10
   gh issue list --state open --limit 10
   ```
   - Find entry points: `main.go`, `cmd/*/main.go`, `src/main.ts`, `src/App.tsx`, `src/main.tsx`
   - Read existing CLAUDE.md for architecture/patterns sections

3. **Generate Quick Start content**
   Format:
   ```markdown
   <!-- QUICKSTART:START -->
   ## Quick Start
   - **Entry points**: <files found>
   - **Current focus**: <open issues summary>
   - **Key patterns**: <from existing CLAUDE.md>
   - **Recent activity**: <last 5 commits, summarized>
   - **Open issues**: <count> open (<titles>)
   <!-- QUICKSTART:END -->
   ```

4. **Write to project CLAUDE.md**
   - Determine the CLAUDE.md file location:
     - If in a child project: `.claude-shared/claudemd/<project>-CLAUDE.md`
     - If in workspace root: `.claude-shared/claudemd/workspace-CLAUDE.md`
   - If `<!-- QUICKSTART:START -->` markers exist, replace content between them
   - If no markers exist, append the section after the first heading

5. **Propagate**
   ```bash
   cd <workspace-root>/.claude-shared && ./sync.sh <project-name>
   ```

## Usage

```
/refresh-context
```

Can also be called from scheduled triggers or `/batch`.
