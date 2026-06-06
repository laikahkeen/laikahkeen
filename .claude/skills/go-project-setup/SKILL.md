---
name: go-project-setup
description: Use when setting up a new Go project, configuring golangci-lint, wiring env vars, or debugging test failures caused by env leakage from Makefile or .env files
---

# Go Project Setup

Patterns for Go project configuration — env loading, golangci-lint, Makefile integration.

## Env Loading: Single Source of Truth

**Rule:** Load `.env` in exactly ONE place. If Go uses `godotenv.Load()`, the Makefile must NOT also `-include .env` + `export`.

**Why:** Makefile `export` injects env vars into the shell. `godotenv.Load()` does NOT override existing env vars. So Makefile-exported vars become invisible to godotenv but leak into `go test`, breaking tests that expect defaults.

```makefile
# BAD — double-loads .env, leaks into tests
-include .env
export
test:
	go test ./...

# GOOD — let godotenv handle it
test:
	go test ./...
```

**Mode switches (stdio/http, dev/prod) should be explicit at call sites, not in .env:**

```makefile
# Pass mode explicitly where needed
dev-http:
	TRANSPORT=http go run ./cmd/app

# Default mode needs no env var
dev:
	go run ./cmd/app
```

**Test defense:** Tests for defaults should clear env with `t.Setenv("VAR", "")` to guard against parent process or .env leakage.

## golangci-lint v2

**Config:** `.golangci.yml` with `version: "2"` is required for golangci-lint v2.

```yaml
version: "2"

linters:
  enable:
    - errcheck
    - govet
    - ineffassign
    - staticcheck

formatters:
  enable:
    - gofmt
```

**CI:** Pin the version. The `golangci-lint-action` can lag behind or break with v2 config. Install directly:

```yaml
- name: Install golangci-lint
  run: go install github.com/golangci/golangci-lint/v2/cmd/golangci-lint@v2.8.0

- name: Lint
  run: golangci-lint run ./...
```

**After adding gofmt formatter:** Run `gofmt -w .` to fix all formatting issues before committing.

## Quick Reference

| Concern | Pattern |
|---------|---------|
| .env loading | ONE place: `godotenv.Load()` in Go, NOT Makefile |
| Mode switches | Explicit at call site, not in .env |
| Test defaults | `t.Setenv("VAR", "")` before testing defaults |
| Lint config | `.golangci.yml` with `version: "2"` |
| Lint in CI | `go install ...@v2.8.0` + `golangci-lint run` |
| Lint action | Avoid `golangci-lint-action` — pin version directly |

## Common Mistakes

- **Makefile `-include .env` + `export` with godotenv** — silent env leakage breaks tests expecting defaults
- **`golangci-lint-action@v6` with v2 config** — action may not support v2 format correctly; install directly
- **Mode flags in .env** — defaults to wrong mode for some transports; pass explicitly only when needed
- **Adding gofmt formatter without reformatting** — existing files will fail lint; run `gofmt -w .` first
