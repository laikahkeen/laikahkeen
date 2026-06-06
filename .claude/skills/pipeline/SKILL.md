---
name: pipeline
description: Multi-stage development pipeline. Runs spec, implement, test, PR as sequential stages with verification gates. Context-aware — routes to the right agents and skills based on project type.
---

# Pipeline - Staged Development

Run a multi-stage development pipeline for a feature. Each stage must pass verification before the next begins. The pipeline detects the project type and routes to the right tools automatically.

## Arguments

- `$ARGUMENTS` - Feature description or GitHub issue number (e.g., "add user authentication" or "#42")

## Before Starting

1. If on `main`, create a feature branch first (use `/start-work` if available)
2. Identify the project type by checking for `go.mod`, `package.json`, `Makefile`
3. Check `.claude/agents/` and `.claude/skills/` for project-specific tools available in this project

## Stage 1: Spec

**Goal**: Understand the codebase and design the implementation approach.

1. Launch `feature-dev:code-explorer` agent(s) to understand the relevant codebase area:
   - For Go projects: trace through existing patterns, check go-reviewer conventions
   - For frontend projects: examine component patterns, routing, state management
   - Focus on files that will be modified or serve as patterns to follow

2. Launch `feature-dev:code-architect` agent to design the approach:
   - Provide comprehensive context from exploration
   - Request specific files to create/modify, component designs, data flows
   - For Go: ensure the design follows existing package boundaries and error handling patterns
   - For frontend: follow existing component patterns and framework conventions

3. Present the spec summary:
   - Files to create/modify
   - Public API or behavior changes
   - Tests that will verify correctness

**Gate**: User reviews spec (or auto-proceed if the task is straightforward).

## Stage 2: Implement

**Goal**: Build the feature following the spec.

1. Dispatch implementation via the Agent tool:
   - **Independent packages/files**: Use parallel subagents (one per package boundary)
   - **Dependent changes**: Process sequentially (shared types first, then consumers)
   - Each agent gets: specific file paths, the spec context, and instructions to follow existing patterns

2. Project-specific skill invocation:
   - Check `.claude/skills/` for relevant project skills and invoke them where applicable
   - Examples: `remotion-best-practices` for hikers video work, `api-integration-discipline` for boostomatic API calls, `vercel-react-best-practices` for frontend work

3. After implementation, run a quick build check:
   ```bash
   # Go projects
   go build ./...

   # TypeScript projects
   npx tsc --noEmit
   ```

**Gate**: Build passes. If it fails, fix and retry (max 3 attempts).

## Stage 3: Test & Review

**Goal**: Verify the implementation works and meets quality standards.

1. Write tests for new/changed behavior using the `test-writer` agent (for Go projects)

2. Run the full test suite:
   ```bash
   # Go projects
   go test ./...

   # Projects with Makefile
   make test

   # TypeScript projects
   npm test
   ```

3. Launch review agents in parallel:
   - `feature-dev:code-reviewer` — bugs, logic errors, security
   - `go-reviewer` agent — Go convention compliance (if Go project)
   - Project-specific reviewer if available (e.g., `boostomatic/code-reviewer`)

4. Fix any high-severity issues found by reviewers

**Gate**: Tests pass and no critical review findings remain. If tests fail 3 times, STOP and report the issue to the user instead of looping forever.

## Stage 4: Ship

**Goal**: Commit, push, and create a PR.

1. Run full verification:
   ```bash
   make build && make lint && make test
   # or equivalent for the project type
   ```

2. Use `/commit` skill for well-crafted commit message

3. Use `/finish-work` skill to create a PR that closes the associated issue
   - If no issue exists, use `/ship` skill instead (commit + push)

4. Report completion:
   - PR URL (or branch pushed)
   - Summary of what was built
   - Key decisions made
   - Files modified

## Rules

- Never skip a stage
- Never move to the next stage if the current one has failures
- If any stage fails 3 times, stop and report the issue — do not loop forever
- Use project-specific agents and skills when they exist — check `.claude/agents/` and `.claude/skills/`
- Follow the Task Routing rules from CLAUDE.md for parallel vs sequential decisions
- The Stop hook will enforce final verification, but run it manually at Stage 4 too
