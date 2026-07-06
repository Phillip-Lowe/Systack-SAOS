# SAOS Failure Simulations Report

**PESSI ⚠️ | Mon 2026-07-06 03:26 CDT**

---

## Simulation 1: 10 Clients Onboard in One Week

### What Happens (Cascading Effects)

**Database Connection Pool Exhaustion (CRITICAL)**
- Pool max = 5 connections
- Each client portal request grabs a connection
- **Result:** 429 errors, connection timeouts, queued requests
- Cascades to: Command Center health checks fail, invoice lookups stall, PIN generation deadlocks

**Ollama RAM Crisis (CRITICAL)**
- qwen3.5:9b loaded = ~10GB RAM
- 16GB total - 10GB model = ~6GB remaining
- OS + PostgreSQL + Python services = ~4GB
- **Leaves ~2GB headroom for concurrent requests**
- With 10 clients chatting simultaneously: OOM kills, model unloads, 30-60 second cold starts per request

**n8n Workflow Backpressure (HIGH)**
- Onboarding triggers: provisioning, welcome email, audit log, PIN generation
- 10 concurrent executions = queue buildup
- Webhook bridge (8767) gets overwhelmed, callbacks timeout

**PIN Generation Collisions (MEDIUM)**
- 6-digit numeric PINs = 1,000,000 combinations
- Birthday problem: with 10 clients, collision probability is negligible (~0.0045%)
- **But** if retry logic exists (collision detected → regenerate), this amplifies DB load

**Audit Log Volume (MEDIUM)**
- Each onboarding = ~15 audit events
- 10 clients = 150 events in one week
- Current tables handle this fine, but long-term: unpartitioned tables = query slowdown

**Backup Window Overlap (LOW)**
- Backup at 3 AM CDT takes ~2-5 minutes
- If onboarding happens at 3 AM: backup grabs tables, onboarding waits or fails

**Cloudflare Tunnel (LOW)**
- Tunnel handles thousands of concurrent connections
- Not a bottleneck for 10 clients

### How Long Until Green Knows
- **DB pool exhaustion:** Immediate (clients report errors, but no alert unless they complain)
- **Ollama OOM:** 2-5 minutes (model cold start delays visible)
- **Fleet health check:** 15 minutes max (if health check catches it)
- **Real answer:** Probably 15-60 minutes unless a client messages Green directly

### What Breaks Permanently vs. Self-Heals
| Breaks | Self-Heals |
|--------|-----------|
| Failed onboarding attempts (need retry) | Ollama model reloads after OOM |
| Connection timeout errors | DB connections release when requests complete |
| Audit log gaps (if transaction rolls back) | n8n queue eventually drains |

### What Should Happen vs. What Does Happen
**Should:** Graceful degradation — queue onboarding, rate-limit chat, pool connections, notify Green
**Does:** Hard failures — connection errors, timeouts, silent failures for non-chat features

### Fix: Immediate
1. Increase DB pool to 20-30 connections (config change, restart services)
2. Implement onboarding queue — process 2-3 at a time
3. Add connection timeout with friendly error message
4. Temporarily disable non-critical n8n workflows

### Fix: Long-Term
1. **Connection pooling proxy:** PgBouncer or similar (sits between app and DB)
2. **Horizontal scaling:** Move Ollama to dedicated machine (M4 Mac Mini or cloud GPU)
3. **Queue-based onboarding:** n8n workflow queue with concurrency limits
4. **Circuit breaker pattern:** If Ollama OOMs 3x, fallback to cloud API or queue requests
5. **DB partitioning:** Partition audit logs by month, auto-archive after 90 days
6. **Load testing:** Script to simulate 10 concurrent onboardings, measure actual breakpoints

---

## Simulation 2: Stripe Failure

### What Happens (Cascading Effects)

**New Signups Blocked (CRITICAL)**
- If payment is required at signup: complete onboarding failure
- If payment is optional/trial: signups work but billing pipeline breaks later

**Existing Client Billing (CRITICAL)**
- Subscription renewals fail
- **But:** Stripe stores subscription state — charges retry automatically for days
- Immediate impact: $0, but cash flow at risk in 3-7 days

**Webhook Handlers (HIGH)**
- Stripe webhooks (invoice.paid, customer.subscription.updated) fail
- n8n workflows listening for webhooks queue up or error
- **Result:** Invoice status out of sync, provisioning based on payment status breaks

**Provisioning Pipeline (HIGH)**
- If provisioning is payment-gated: new clients can't access features
- If provisioning is manual/separate: continues working, but billing data stale

**Client Portal Payment Endpoints (HIGH)**
- `/api/payment/*` endpoints return 500 or timeout
- Clients see generic error or broken page

**Error Messages (MEDIUM)**
- Without proper error handling: clients see raw Stripe errors or stack traces
- With proper handling: "Payment processing temporarily unavailable"

### How Long Until Green Knows
- **Stripe status page:** Immediate (if Green checks)
- **Webhook failures:** n8n error catcher catches within 5-15 minutes
- **Client complaints:** 30 minutes to hours
- **Fleet health check:** Won't catch this (Stripe is external, not local service)
- **Real answer:** 15 minutes to never, depending on monitoring

### What Breaks Permanently vs. Self-Heals
| Breaks | Self-Heals |
|--------|-----------|
| Failed payments (need manual retry or Stripe auto-retry) | Stripe subscriptions resume when service returns |
| Webhook gaps (need replay) | Webhook endpoints are still there, just not receiving |
| Invoice status mismatches | Can be reconciled |
| Client trust (if errors are ugly) | — |

### What Should Happen vs. What Does Happen
**Should:** Graceful degradation — allow signups with "payment pending" state, queue webhooks, show friendly error, alert Green
**Does:** Likely hard failures — payment pages crash, webhooks lost, clients confused

### Fix: Immediate
1. Wrap all Stripe calls in try/catch with fallback
2. If Stripe fails: allow trial signup with "payment required in 7 days" banner
3. Queue failed webhooks in DB for replay
4. Show friendly error: "Payment processing is temporarily unavailable"

### Fix: Long-Term
1. **Webhook replay system:** Store all Stripe events in DB, replay on recovery
2. **Circuit breaker:** After 3 Stripe failures, switch to "maintenance mode"
3. **Graceful degradation modes:**
   - Mode 1: Full Stripe (normal)
   - Mode 2: Trial-only (Stripe down < 24h)
   - Mode 3: Manual invoicing (Stripe down > 24h)
4. **Stripe status monitoring:** Poll Stripe status API, auto-switch modes
5. **Client communication:** Auto-email affected clients with status updates

---

## Simulation 3: Database Reaches Capacity

### What Happens (Cascading Effects)

**Disk Full Cascade (CRITICAL)**
- PostgreSQL needs disk for: WAL logs, temp tables, indexes, vacuum
- Disk at 100%: INSERTs fail, VACUUM can't run, indexes corrupt
- **Result:** All write operations fail, read-only mode effectively

**Audit Log Growth (CRITICAL)**
- Every auth attempt, every API call, every change = logged
- Unbounded growth = fastest path to disk full
- At 100 clients with moderate activity: ~50-100MB/day
- At 1000 clients: ~500MB-1GB/day

**Backup File Accumulation (HIGH)**
- Daily backups retained (how many?)
- If 7-day retention: 7 × DB size
- If DB is 500MB: 3.5GB in backups alone
- **Backup failures when disk full = no recovery path**

**Chat Message Storage (MEDIUM)**
- Each chat interaction = stored message
- With Ollama generating responses: 2× messages per interaction
- Text is small, but images/documents are not

**Document Storage (MEDIUM)**
- PDF uploads, extracted text, generated files
- If stored in DB (BYTEA): rapid bloat
- If stored on filesystem: DB disk spared, but filesystem fills instead

**Log Table Bloat (HIGH)**
- `backup_log`, `security_events`, `audit_log`, `incident_log`
- Without partitioning or archival: tables grow forever
- Vacuum can't reclaim space if disk is full

**Connection Timeouts (MEDIUM)**
- Full disk = slow queries = connection pile-up
- Exacerbates pool exhaustion from Simulation 1

### How Long Until Green Knows
- **Disk monitoring:** If exists, immediate
- **Fleet health check:** 15 minutes (but only checks service up/down, not disk)
- **Backup failure:** 3 AM next day (but too late — disk already full)
- **Real answer:** Hours to days — disk fills gradually, not instantly

### What Breaks Permanently vs. Self-Heals
| Breaks | Self-Heals |
|--------|-----------|
| Corrupted indexes (need REINDEX) | Space freed after VACUUM (if disk available) |
| Failed writes (data lost if not caught) | Read queries still work (until cache fills) |
| Backup chain broken | New backups start once space available |

### What Should Happen vs. What Does Happen
**Should:** Disk usage monitoring, auto-alert at 80%, auto-archive old logs, auto-vacuum schedule
**Does:** Silent growth until disk full, then everything breaks at once

### Fix: Immediate
1. Check disk usage: `df -h` and `pg_size_pretty(pg_database_size('systack_memory'))`
2. Delete old backup files beyond retention
3. Run `VACUUM FULL` on largest tables
4. Truncate or archive old audit logs (>90 days)

### Fix: Long-Term
1. **Disk monitoring:** Alert at 80% disk usage, critical at 90%
2. **Auto-archival:** Move audit logs >90 days to archive table, >1 year to compressed files
3. **Backup rotation:** Enforce 7-day retention, auto-delete older
4. **Table partitioning:** Partition audit_log, security_events by month
5. **Document storage:** Move large files to filesystem (not DB BYTEA)
6. **PostgreSQL autovacuum:** Ensure aggressive autovacuum settings for log tables
7. **Disk size planning:** Minimum 100GB disk for production VPS

---

## Simulation 4: Alert System Stops Working

### What Happens (Cascading Effects)

**Silent Backup Failures (CRITICAL)**
- Backup cron at 3 AM fails silently
- No iMessage alert = Green doesn't know
- **Result:** Days or weeks of missing backups before anyone notices
- If data loss occurs during this window: catastrophic

**Fleet Health Alert Failure (CRITICAL)**
- Service goes down, no iMessage sent
- 15-min cron runs but can't deliver alert
- **Result:** Service outage goes undetected for hours

**Security Event Alert Failure (HIGH)**
- Brute force attack, rate limit hits, access denials
- No notification = attack continues unnoticed
- **Result:** Security incident with delayed response

**Client Support Escalation Failure (HIGH)**
- Client emails support, ticket logged
- SOL tries to escalate to Green via iMessage
- Message not delivered
- **Result:** Client waiting, no response, trust erodes

**Silent Failures (HIGH)**
- The most dangerous scenario: everything seems fine because no alerts
- "No news" interpreted as "good news" when actually "no signal"
- **Result:** Cascade of undetected issues

### How Long Until Green Knows
- **He might not know** until he manually checks a dashboard or a client complains
- If alert system is down for 24 hours: every backup, health check, and security event is missed
- **Real answer:** Could be days — there's no meta-monitoring (monitoring the monitor)

### What Breaks Permanently vs. Self-Heals
| Breaks | Self-Heals |
|--------|-----------|
| Missed alerts (gone forever) | BlueBubbles reconnects when available |
| Missed backup windows (gone forever) | Cron jobs resume when service returns |
| Client trust (if response delayed) | — |

### What Should Happen vs. What Does Happen
**Should:** Multi-channel alerting (iMessage + email + dashboard), meta-monitoring (check that alerts are being sent), heartbeat pattern (if no heartbeat received, something's wrong)
**Does:** Single channel (iMessage only), no meta-monitoring, no heartbeat

### Fix: Immediate
1. Add email as secondary alert channel (always works)
2. Add a "heartbeat" cron: SOL sends "I'm alive" message every hour. If Green doesn't receive it, something's wrong.
3. Log all alert attempts (even failed ones) to a file — check manually if alerts stop

### Fix: Long-Term
1. **Multi-channel alerting:**
   - Channel 1: iMessage (primary)
   - Channel 2: Email (secondary, always works)
   - Channel 3: Dashboard alert banner (if web accessible)
2. **Meta-monitoring:** Cron job that checks if BlueBubbles is running, alerts via email if down
3. **Heartbeat pattern:** Green receives daily "all systems nominal" summary. If missing → investigate.
4. **Alert queue:** Failed alerts stored in DB, retried when channels available
5. **Dead man's switch:** If no heartbeat from SOL for 2 hours, auto-restart services

---

## Simulation 5: Client Enters Bad Data

### What Happens (Cascading Effects)

**Corrupted PDF Upload (HIGH)**
- Invoice processing pipeline: email → PDF → OCR → extraction
- If PDF is corrupted: OCR fails, extraction returns garbage or empty
- **Result:** Invoice record with wrong data or error state
- If unhandled: error logged but client doesn't know processing failed

**Malformed Data in Chat (HIGH)**
- Client types SQL injection attempt: `'; DROP TABLE saos_clients; --`
- If using parameterized queries: safe (we use %s in psycopg2)
- If using f-strings anywhere: **catastrophic**
- **Result:** Data exfiltration or data loss

**XSS via Client Name (MEDIUM)**
- Client registers with name: `<script>alert('xss')</script>`
- If dashboard renders without escaping: script executes in admin's browser
- **Result:** Session hijacking, admin credentials stolen, full system compromise
- Flask's Jinja2 auto-escapes by default, but any `|safe` filter usage is a vector

**Oversized File Upload (MEDIUM)**
- Client uploads 5GB video file as "invoice"
- No file size limit = server crashes processing it
- **Result:** Memory exhaustion, request timeout, possible disk fill

**Encoding Issues (LOW)**
- Client name in Arabic, Chinese, or emoji: "张明 🎉"
- If DB charset is UTF-8: fine
- If Latin-1: mojibake or insertion failure
- **Result:** Garbled names in dashboard, failed registration

**Special Characters in PIN (LOW)**
- PINs are numeric only (6 digits), so no special chars
- But if PIN field accepts non-numeric: SQL or script injection via PIN field
- **Result:** Same as chat injection vector

### How Long Until Green Knows
- **Corrupted PDF:** Immediate (processing fails) or never (if silently swallowed)
- **SQL injection:** If successful, Green may never know until data is gone
- **XSS:** If successful, Green may never know until admin session is hijacked
- **Oversized upload:** Immediate (server crashes or times out)
- **Real answer:** Varies widely — security issues may never be detected

### What Breaks Permanently vs. Self-Heals
| Breaks | Self-Heals |
|--------|-----------|
| Data lost to SQL injection (permanent) | OCR failure on bad PDF (self-heals on next invoice) |
| XSS compromise (permanent until patched) | Encoding issues (can fix and re-save) |
| Server crash on oversized file (restarts via launchd) | — |

### What Should Happen vs. What Does Happen
**Should:** Input validation everywhere, file size limits, file type validation, output escaping, parameterized queries enforced, error messages to client
**Does:** Parameterized queries in place (good), but file validation, size limits, and output escaping may have gaps

### Fix: Immediate
1. Audit all SQL queries for f-string usage (grep for `f"SELECT` and `f"INSERT`)
2. Add file upload size limit (10MB max for invoices, 50MB for documents)
3. Add file type validation (PDF, JPG, PNG only for invoices)
4. Add input sanitization for client name (strip HTML tags)
5. Verify Flask Jinja2 auto-escape is enabled everywhere

### Fix: Long-Term
1. **Input validation layer:** Centralized validation for all API inputs (schema-based)
2. **File upload pipeline:** Size check → type check → scan → process → store
3. **Output encoding:** Ensure all user-generated content is HTML-escaped on render
4. **Security scanning:** Regular dependency scanning, OWASP top 10 checklist
5. **Penetration testing:** Hire external auditor before accepting sensitive client data
6. **Rate limiting on uploads:** Prevent abuse via rapid file submissions
7. **Error handling:** Every error caught, logged, and communicated to client with friendly message

---

## Summary: Top 5 Critical Fixes Needed Before Production

| # | Issue | Severity | Fix Effort | Blocks Production? |
|---|-------|----------|-----------|-------------------|
| 1 | DB connection pool too small (5) | CRITICAL | 30 min (config change) | Yes — first 3+ clients will hit this |
| 2 | No disk usage monitoring | CRITICAL | 1 hour (monitoring script) | Yes — silent disk fill = catastrophic |
| 3 | Single alert channel (iMessage only) | HIGH | 2 hours (add email) | No, but risky |
| 4 | No file upload validation | HIGH | 2 hours (size + type limits) | No, but security risk |
| 5 | Ollama OOM under load | MEDIUM | 1 week (move to dedicated machine) | No, degrades gracefully |

---

*Simulations by PESSI ⚠️. These are planning scenarios, not actual incidents. Address before scaling beyond 5 clients.*