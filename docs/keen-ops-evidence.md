# keen-ops case study — evidence

Source material for the `/work/keen-ops` case study. **Every line here is sourced to
`keen-ops` at the path given.** Gathered 2026-09-25. Nothing in this file is prose for
publication; it is the fact base the prose must not exceed.

Paths are relative to `/Users/kahkeenlai/gitrepository/laikahkeen-workspace/keen-ops/bot`.

## Scale

| Fact | Value | How it was established |
|---|---|---|
| Go source, excluding tests | **58,640 lines** | `find . -name '*.go' -not -name '*_test.go' \| xargs wc -l`, 2026-09-25 |
| Binaries | **3** | `main.go` (bot), `cmd/keen-api/main.go`, `cmd/keen-mcp/main.go` |
| MCP tools | **16 read + 22 write** | registry slice, `internal/mcp/registry.go:150-340` |

Re-count before publishing; these move with every commit.

## The event store

`events` — `internal/storage/db.go:103-121`. Single table, `INTEGER PRIMARY KEY
AUTOINCREMENT`, with `type`, `date`, `occurred_at`, `name`, `amount`, `unit`, `tags`,
`venue`, `mood`, `note`, `data`, `raw_input`, `attachment`, `source`, `parsed_by`,
`confidence`, `created_at`.

Worth noting for the write-up: `raw_input`, `source`, `parsed_by` and `confidence` mean
every row carries **how it came to exist** — which Telegram message, which parser, how
sure that parser was. That is what makes a bad parse correctable later rather than
indistinguishable from a real entry.

## The reversibility contract

The interesting part, and the part the prose should lead on.

- **The contract is an interface method**, not a convention:
  `CaptureInverse(ctx, store) (Op, error)` — `internal/ops/op.go:91`, documented at
  `:89-90` as *"reads the current DB state needed to reverse this op and returns the
  inverse op. Must be called before Execute."* Every op implements it.
- **Both directions are persisted at write time.** `edit_batches` —
  `internal/storage/db.go:198-211` — stores `ops_json` **and** `inverse_ops_json`, plus
  `undone_at`. The inverse is computed from live state *before* the write, not
  reconstructed afterwards from a diff.
- **Sometimes the inverse is a whole snapshot, deliberately.**
  `internal/ops/correct_document.go:177-184`: the inverse captures the document's meta
  *and* its complete prior section list, because *"an inverse that only remembers the
  fields it changed could never"* restore it. A field-level inverse would have been the
  obvious choice and the wrong one.

### Where the contract broke — the honest centre of the story

`internal/bot/finance.go:2441-2455`, verbatim in part:

> A read rewrites the section list and the line manifest whatever it books, so the two
> paths that return before `ops.ExecuteBatch` — an empty statement, and a re-read every
> line of which deduped — still CHANGE the document. They wrote no edit_batch, so that
> change had no inverse [...]
>
> Worse than a missing undo: bot/CLAUDE.md records that an untracked mutation makes
> `/undo` jump to an OLDER batch, **which is how data was lost on 2026-04-22.** So a
> no-op re-read did not merely fail to be reversible — the next `/undo` reversed
> something else entirely.

The fix is `recordManifestOnlyBatch`: a descriptive `noop` forward op that is never
replayed, paired with a real inverse — the shape `bot/CLAUDE.md` prescribes for any
mutation outside the ops executor.

**This is the strongest material available and it is not flattering.** A contract with a
hole, a dated incident caused by the hole, and a structural fix that closes the class
rather than the instance. A peer engineer reading it learns something; the sanitised
version reads as marketing.

## The single-writer invariant

`internal/storage/db.go:69` — `SetMaxOpenConns(1)`, with `PRAGMA journal_mode=WAL`
(`:70`) and `busy_timeout=5000` (`:74`). `docs/mcp.md:11` states why the MCP server runs
*inside* the bot process: it preserves that invariant, because MCP writes are just another
caller of `ops.ExecuteBatch`.

Migrations are idempotent `CREATE TABLE IF NOT EXISTS` on every boot (`db.go:94`) — no
migration tool.

## Unverified — do not publish these without checking

- **A concrete cross-domain query.** The site claims one shared store makes questions
  spanning health, reading and finance answerable. I did **not** find a specific query or
  tool that demonstrably spans two domains. It may exist; I did not locate it. Either
  find it or drop the claim.
- The dedicated evidence agent for this task **failed** (stalled, no output), so this file
  was assembled from targeted reads rather than a full sweep. Treat it as incomplete
  rather than exhaustive — absence here is not evidence of absence in the repo.

## Claim mismatch to resolve before writing

`src/data/projects.ts` in the portfolio currently says the reversibility contract means
**"no correction is ever destructive"** and that **"any write can be replayed in
reverse."** The repo documents a case where a write had no inverse and a subsequent
`/undo` destroyed data on a stated date. The absolute claim is stronger than the code.
Owner's decision — positioning copy is not a tidy-up.
