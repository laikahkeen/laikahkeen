---
name: batch
description: Run an operation across all projects in the workspace. Dispatches parallel subagents per project, returns consolidated report. Run from the workspace root directory.
---

# Batch - Cross-Project Operations

Run the same operation across all (or selected) projects in the workspace.

## Arguments

- `$ARGUMENTS` - The operation to run, described in natural language

## Prerequisites

- Must be run from the workspace root or a child project directory
- `.claude-shared/map.json` must exist with project definitions

## Steps

1. **Read project list**
   - Read `.claude-shared/map.json` to get all project names
   - Skip the `.` (workspace root) entry
   - For each project, read its CLAUDE.md for context on what the project does

2. **Dispatch subagents**
   - Launch parallel subagents (via Agent tool), one per project
   - Each subagent receives:
     - The operation to perform
     - The project directory path
     - A summary of what the project does (from CLAUDE.md)
   - Subagent prompt template:

     ```
     You are working in the project "<name>" at <path>.
     Project context: <CLAUDE.md summary>

     Task: <operation from $ARGUMENTS>

     Report your findings concisely: status (PASS/FAIL/INFO), and a one-line summary.
     ```

3. **Collect results**

4. **Present consolidated report**

   ```markdown
   ## Batch Results: "<operation>"

   | Project | Status           | Details            |
   | ------- | ---------------- | ------------------ |
   | <name>  | <PASS/FAIL/INFO> | <one-line summary> |
   | ...     | ...              | ...                |

   **Summary**: X passed, Y failed, Z info
   ```

## Examples

```
/batch check for failing tests and report
/batch find all TODO comments
/batch check for outdated Go dependencies
/batch count lines of code by language
```
