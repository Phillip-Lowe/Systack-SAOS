# SAOS Production Readiness — Session Recovery Notes

**Date:** 2026-06-29
**Status:** Awaiting filesystem verification
**Priority:** HIGH

---

## Session Blocked 2026-06-28

Filesystem access failed due to persistent path typo:
- **Correct:** `saos-data` (s-a-o-s)
- **Tool produced:** `saas-data` (s-a-a-s)
- **Result:** 20+ failed attempts, session ended

## Verified Working Path

```bash
cd ~/.openclaw/workspaces/sol/Systack/content/saos/saos-data/customer-dashboard
ls -la  # Confirms api.py, index.html, deliverables/, docs/
```

## Files Confirmed Existing

| File | Size | Purpose |
|------|------|---------|
| `api.py` | 42KB | Flask API (port 8768) |
| `index.html` | 118KB | Dashboard frontend |
| `index.html.backup.20260624_052514` | 63KB | Working backup |
| `n8n-email-dispatcher.json` | 4.5KB | Email workflow (disabled) |
| `SAOS-Architecture-Overview-v4.0.md` | 12KB | Architecture docs |

## SAOS Component Status

| Component | Status | Port | Notes |
|-----------|--------|------|-------|
| Dashboard API | ✅ Running | 8768 | Flask, PIN auth, session tokens |
| Dashboard Frontend | ✅ Ready | — | 118KB, 6 tabs |
| PostgreSQL | ✅ Running | 5432 | `systack_memory` database |
| Orchestrator Daemon | ⏸️ Paused | — | Needs task format fix |
| n8n Email Dispatcher | ⏸️ Disabled | 5678 | Wrong port in workflow |
| n8n Main | ✅ Running | 5678 | Other workflows active |
| Customer Dashboard | ✅ Running | 8768 | Mobile-responsive |
| Old Dashboard | ✅ Running | 8765 | Internal fleet |
| Webhook Bridge | ✅ Running | 8767 | SAOS webhooks |
| Invoice Dashboard | ✅ Running | 8766 | Invoice processing |
| Invoice Parser | ✅ Running | 9001 | PDF parsing |

## Priority Tasks (Next Session)

### 1. Fix n8n Email Dispatcher (Quick Win)
- **Problem:** Workflow polls `localhost:8768` instead of `8765`
- **Fix:** Edit workflow JSON, change API URL
- **Time:** 5 minutes
- **Impact:** Restores email notifications

### 2. Audit Dashboard Code
- **Read:** `api.py` (42KB) — check all endpoints
- **Read:** `index.html` (118KB) — check tab implementations
- **Verify:** Each tab connects to real API endpoint
- **Time:** 30 minutes

### 3. Fix Orchestrator Task Format
- **Problem:** Tasks too vague — "Build email integration"
- **Fix:** Add deliverables, acceptance criteria, verification steps
- **Example:**
  ```
  BEFORE: "Build email integration"
  AFTER: "Create /api/email/send endpoint in api.py that:
           - Accepts POST with {to, subject, body}
           - Uses SMTP from env vars
           - Returns {success, message_id}
           - Test: curl -X POST http://localhost:8768/api/email/send"
  ```
- **Time:** 1 hour

### 4. Verify Dashboard Tab Data Connections

| Tab | Should Show | Current Status | Fix Needed |
|-----|-------------|----------------|------------|
| 💬 Chat | Agent messages | ✅ Working | None |
| 📊 Fleet Status | Agent health, task counts | ⚠️ Static? | Verify API endpoint |
| 📦 Services | Tier features | ⚠️ Hardcoded? | Connect to config |
| ✅ Tasks | Task queue status | ⚠️ May be static | Connect to PostgreSQL |
| 📋 Activity | Recent actions | ⚠️ May be static | Connect to audit log |
| 📄 Docs | Static files | ✅ Working | None |

### 5. Connect Email/Calendar (Post-MVP)
- Email tab: Show real emails from n8n
- Calendar tab: Connect Google Calendar API
- Time: 2-3 hours (separate session)

## When to Resume

**Trigger:** Green confirms filesystem access at workstation.

**Pre-check:**
```bash
cd ~/.openclaw/workspaces/sol/Systack/content/saos/saos-data/customer-dashboard
head -20 api.py  # Should show Flask imports
```

**If that works → Resume immediately.**

---
*Saved everywhere per user directive*
