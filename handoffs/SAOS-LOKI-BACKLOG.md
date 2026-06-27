# SAOS Local Backlog — LOKI Self-Service Execution Plan

**Created:** 2026-06-27 by SOL
**For:** LOKI (🏠)
**Model:** `ollama/qwen3.5:9b` (local)
**Status:** Ready to execute

---

## Your Mission

Execute the following 5 SAOS tasks **sequentially**. Each task must complete and be verified before moving to the next.

**Rule:** Only ONE local model can run at a time. Check `ollama ps` before spawning subagents. If model is busy, wait and retry.

---

## Task 1: SAOS Pipeline Report Generator ⏱️ ~20 min

**What:** Query all local SAOS data sources and write a comprehensive status report.

**Data Sources:**
1. PostgreSQL (localhost:5432, systack_memory) — task_queue, client_request tables
2. n8n SQLite (~/.n8n/database.sqlite) — SAOS workflow executions
3. Local APIs (curl): 8765, 8766, 8767, 8768, 9001, 5678
4. Running processes: ps aux for SAOS services
5. Disk usage: du on SAOS directories

**Output:** `~/.openclaw/workspaces/sol/reports/saos-status-YYYY-MM-DD.md`

**Verification:** File exists, >500 words, contains all 5 sections.

---

## Task 2: Stale Task Cleanup ⏱️ ~15 min

**What:** Find and clean up orphaned/stale tasks in PostgreSQL.

**Queries to run:**
```sql
-- Find RUNNING tasks >4 hours old
SELECT id, task_type, assigned_agent, created_at 
FROM task_queue 
WHERE status = 'RUNNING' 
  AND created_at < NOW() - INTERVAL '4 hours';

-- Find PENDING tasks >7 days old
SELECT id, task_type, priority, created_at 
FROM task_queue 
WHERE status = 'PENDING' 
  AND created_at < NOW() - INTERVAL '7 days';

-- Find FAILED tasks with max retries exceeded
SELECT id, task_type, retry_count, max_retries, error_message
FROM task_queue 
WHERE status = 'FAILED' 
  AND retry_count >= max_retries;
```

**Action:** For each category, either:
- Mark orphaned RUNNING as FAILED with note "Orphaned — manual cleanup"
- Mark old PENDING as DEAD with note "Stale — auto cleanup"
- Log everything to: `~/.openclaw/workspaces/sol/reports/task-cleanup-YYYY-MM-DD.md`

**Verification:** Report shows counts before/after cleanup.

---

## Task 3: n8n Execution Auditor ⏱️ ~15 min

**What:** Query n8n SQLite DB for SAOS workflow failures and patterns.

**Queries:**
```sql
-- SAOS workflow execution summary (last 7 days)
SELECT 
  w.name,
  COUNT(e.id) as total,
  SUM(CASE WHEN e.status = 'error' THEN 1 ELSE 0 END) as errors,
  SUM(CASE WHEN e.status = 'success' THEN 1 ELSE 0 END) as successes
FROM workflow_entity w
LEFT JOIN execution_entity e ON w.id = e.workflow_id
WHERE w.name LIKE '%SAOS%'
  AND e.started_at > datetime('now', '-7 days')
GROUP BY w.name;

-- Error patterns (last 5 failures per workflow)
SELECT w.name, e.started_at, SUBSTR(e.data, 1, 500) as error_preview
FROM execution_entity e
JOIN workflow_entity w ON e.workflow_id = w.id
WHERE w.name LIKE '%SAOS%' AND e.status = 'error'
ORDER BY e.started_at DESC
LIMIT 20;
```

**Output:** `~/.openclaw/workspaces/sol/reports/n8n-audit-YYYY-MM-DD.md`

**Verification:** Report contains error patterns and actionable recommendations.

---

## Task 4: Client Activity Baseline ⏱️ ~20 min

**What:** Analyze client activity patterns from PostgreSQL.

**Queries:**
```sql
-- Unique clients by week (last 4 weeks)
SELECT 
  DATE_TRUNC('week', created_at) as week,
  COUNT(DISTINCT client_id) as unique_clients,
  COUNT(*) as total_requests
FROM client_request
WHERE created_at > NOW() - INTERVAL '4 weeks'
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week DESC;

-- Task creation → completion flow
SELECT 
  task_type,
  status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (COALESCE(completed_at, NOW()) - created_at))/3600 as avg_hours
FROM task_queue
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY task_type, status
ORDER BY task_type, status;

-- Pipeline bottlenecks (longest running tasks)
SELECT id, task_type, assigned_agent, 
  EXTRACT(EPOCH FROM (NOW() - created_at))/3600 as hours_old
FROM task_queue
WHERE status IN ('PENDING', 'RUNNING')
ORDER BY hours_old DESC
LIMIT 10;
```

**Output:** `~/.openclaw/workspaces/sol/reports/client-activity-YYYY-MM-DD.md`

**Verification:** Report shows trends, bottlenecks, and conversion metrics.

---

## Task 5: SAOS API Endpoint Catalog ⏱️ ~30 min

**What:** Test every SAOS endpoint and document status.

**Endpoints to test:**
| Port | Service | Test URLs |
|------|---------|-----------|
| 8765 | Old Dashboard | /api/health, /api/tasks, /api/portal/status |
| 8766 | Invoice Dashboard | /api/invoices, /api/health |
| 8767 | Webhook Bridge | /webhook/test, /api/status |
| 8768 | Customer Dashboard | /api/health, /api/portal/tasks, /api/portal/deliverables |
| 9001 | Invoice Parser | /health, /api/parse |
| 5678 | n8n | /rest/workflows, /rest/executions |

**For each endpoint:**
- Curl and record HTTP status
- Measure response time (use `time curl ...`)
- Note if returning HTML vs JSON
- Document errors

**Output:** `~/.openclaw/workspaces/sol/reports/api-catalog-YYYY-MM-DD.md`

**Verification:** Table with all endpoints, status codes, response times, and notes.

---

## Execution Rules

1. **Sequential only** — finish Task 1 before starting Task 2
2. **Verify each** — before moving on, confirm output file exists and is complete
3. **Log everything** — if a query fails or API is unreachable, document it
4. **No cloud APIs** — everything must use localhost/local files
5. **Report back** — after all 5 tasks, create summary: `~/.openclaw/workspaces/sol/reports/LOKI-SAOS-SUMMARY-YYYY-MM-DD.md`

---

## Scheduling Options

### Option A: Run Now (Manual)
Execute all 5 tasks in this session. Report back when complete.

### Option B: Cron Jobs (Automated)
Create 5 separate cron jobs, staggered throughout the day:
- Task 1: Daily 6:00 AM
- Task 2: Daily 6:30 AM
- Task 3: Daily 7:00 AM
- Task 4: Daily 7:30 AM
- Task 5: Daily 8:00 AM

### Option C: Hybrid
Run Task 1 now (immediate value), schedule Tasks 2-5 as cron jobs.

---

## Verification Checklist

After each task, confirm:
- [ ] Output file exists at specified path
- [ ] File size >0 bytes
- [ ] File contains expected sections
- [ ] No obvious errors in content
- [ ] Log any issues encountered

---

**Hand this to LOKI. It can read this file and execute independently.**
