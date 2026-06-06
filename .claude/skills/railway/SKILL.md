---
name: railway
description: Railway operations — deploy, logs, debug, sqlite, db, vars, ssh, status. Usage: /railway <subcommand>
---

# Railway Operations

Multi-purpose skill for Railway deployment and operations. Route based on the first argument.

**Usage:** `/railway <subcommand>` where subcommand is one of: `deploy`, `logs`, `debug`, `status`, `vars`, `ssh`, `sqlite`, `db`

If no subcommand is given, list the available subcommands and ask which one to run.

---

## Subcommands

### `/railway deploy`

Push to main and monitor the Railway deployment.

1. **Pre-flight checks**
   - `git status` — working tree must be clean
   - `make build` — must succeed
   - `make test` — must pass
   - `make lint` — must pass
   - If any check fails, stop and report

2. **Push**
   - `git push origin main`
   - If push fails (behind remote, etc.), stop and report

3. **Monitor**
   - `railway logs --latest --lines 30` — tail deployment logs
   - Check for successful container start
   - If the project has a health endpoint, `curl` it to verify

**Rules:**
- Do NOT force push
- Do NOT push if any pre-flight check fails
- Do NOT push if there are uncommitted changes

---

### `/railway logs`

Tail recent Railway logs.

```bash
# Default: last 50 lines
railway logs --latest --lines 50

# With optional filter argument
railway logs --latest --lines 100 | grep -i "error\|panic\|fatal"
```

If the user provides a filter keyword (e.g., `/railway logs error`), grep for it.

---

### `/railway debug`

Composite debugging — gather all diagnostic info in one shot.

1. `railway status` — show service status and linked project
2. `railway logs --latest --lines 30` — recent logs
3. Check health endpoint if one exists: `curl -s <railway-url>/health`
4. `railway variables` — list env vars (mask secrets in output)
5. Summarize: is the service healthy? Any errors in logs? Any missing env vars?

---

### `/railway status`

Show Railway service status.

```bash
railway status
railway whoami
```

Report: linked project, service, environment, current deployment status.

---

### `/railway vars`

List or manage Railway environment variables.

```bash
# List all variables
railway variables

# Set a variable (if user provides key=value)
railway variables set KEY=value
```

When listing, mask values that look like secrets (tokens, keys, passwords) — show only the first 4 and last 4 characters.

---

### `/railway ssh`

Open SSH to the Railway container or run a remote command.

```bash
# Interactive SSH
railway ssh

# Run a command remotely
railway ssh -- "command here"
```

If the user provides a command after `/railway ssh`, pass it through.

---

### `/railway sqlite`

Download and query a SQLite database from Railway. Uses the WAL-safe binary transfer pattern.

1. **Checkpoint WAL** (merge WAL data into main DB file)
   ```bash
   railway ssh -- "sqlite3 <db_path> 'PRAGMA wal_checkpoint(TRUNCATE);'"
   ```

2. **Download via base64** (avoids binary corruption over SSH)
   ```bash
   railway ssh -- "base64 <db_path>" > /tmp/railway-db-b64.txt
   ```

3. **Decode locally**
   ```bash
   base64 -D -i /tmp/railway-db-b64.txt -o /tmp/railway-local.db
   ```

4. **Query locally**
   ```bash
   sqlite3 -header -column /tmp/railway-local.db "<query>"
   ```

**Finding the DB path:**
- Check `railway variables | grep -i database\|sqlite\|db_path` for the configured path
- Common locations: `/data/<appname>.db`, `./data.db`

If the user provides a query (e.g., `/railway sqlite SELECT * FROM users LIMIT 10`), run it after download. Otherwise, report the download path and suggest queries.

---

### `/railway db`

Connect to or query a Railway PostgreSQL database.

1. **Get connection string**
   ```bash
   railway variables | grep DATABASE_URL
   ```

2. **Connect or query**
   ```bash
   # Interactive
   psql "$DATABASE_URL"

   # Run a query
   psql "$DATABASE_URL" -c "SELECT * FROM table LIMIT 10;"
   ```

If the user provides a query (e.g., `/railway db SELECT count(*) FROM events`), run it directly. Otherwise, connect interactively.

**Rules:**
- Never run DROP, TRUNCATE, or DELETE without explicit user confirmation
- For production databases, default to read-only queries
