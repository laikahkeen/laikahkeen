---
name: self-review
description: Use after writing implementation code and before reporting completion to user — enforces retro, test, review, verify loop so issues are caught before proposing
---

# Self-Review Before Proposing

## Overview

After writing code, stop. Review your own work before presenting it. Find and fix problems yourself instead of making the user catch them.

**Core principle:** Never propose code you haven't challenged yourself on.

## The Iron Law

```
NO REPORTING COMPLETION WITHOUT PASSING ALL FOUR STEPS
```

## When to Use

After ANY code change — feature, bugfix, refactor — before telling the user you're done.

**Not needed for:** Pure research, reading files, answering questions, config-only changes with no logic.

## The Loop

### Step 1: Retro

Review what you just changed against what was asked.

- Does this actually solve the stated problem?
- Any unnecessary changes that crept in? Remove them.
- Any missed edge cases visible from reading the diff?
- Is the approach right, or did you go down a wrong path?

If the approach is wrong, **say so**. Don't paper over a bad direction with more code.

### Step 2: Test

Add or update tests covering the new/changed behavior.

- New behavior needs new tests. Changed behavior needs updated tests.
- Tests must assert actual behavior, not just "it doesn't crash."
- Run the tests. If they fail, fix the **implementation** (not the tests) unless the test expectation is wrong.
- Follow existing test patterns in the codebase.

### Step 3: Self-Review

Review the full diff as if you're reviewing someone else's code. Check for:

- **Bugs:** Off-by-ones, nil derefs, missing error handling at boundaries
- **Logic errors:** Wrong conditions, inverted comparisons, short-circuit issues
- **Style drift:** Does this match codebase conventions? Check how similar code is written nearby.
- **Security:** Injection, unsanitized input, leaked secrets
- **Naming:** Do new names match existing conventions?

Fix anything you find. Then review the fix too.

### Step 4: Verify

Run build, lint, and tests:

```bash
make build && make lint && make test
```

All must pass. If anything fails, fix it and re-run. Do not report completion with failures.

## What "Done" Looks Like

When reporting completion, your message should reflect that you've done the loop:

1. Brief summary of what changed and why
2. What tests were added/updated
3. Build/lint/test status (all green)

You don't need to narrate every step of the loop — just show the evidence that it happened.
