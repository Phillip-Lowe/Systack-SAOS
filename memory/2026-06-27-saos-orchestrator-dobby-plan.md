# SAOS Orchestrator → DOOBY Migration Plan

**Date:** 2026-06-27
**Status:** TESTED — DOOBY verified capable

## DOOBY Test Results

| Test | Runtime | Timeout | Result | File Created? |
|------|---------|---------|--------|---------------|
| Solo file creation | 3m | 180s | Timeout (but file created) | ✅ |
| SAOS task (TEST002) | 32s | 300s | Completed | ✅ |

**Key finding:** With 300s timeout and warmed model, DOOBY completes SAOS tasks reliably in ~30s.

## Changes Required

### 1. Orchestrator Daemon Config
- **Poll interval:** 10s → 300s (5 minutes)
- **Agent target:** SOL → DOOBY
- **Timeout per task:** 300s
- **Session model:** Kill per task, spawn fresh each time

### 2. OpenClaw Config Changes Needed

File: `~/.openclaw/openclaw.json`

```json
// Update orchestrator cron job (when re-enabled):
{
  "id": "orchestrator-daemon",
  "schedule": "*/5 * * * *",  // Every 5 minutes
  "agentId": "dooby",          // Route to DOOBY
  "model": "ollama/qwen3.5:9b",
  "timeout": 300,              // 5 minutes
  "killAfterRun": true         // Kill session, start fresh
}
```

### 3. Task Queue Logic

Before (broken):
```
Every 10s → Poll task_queue → Spawn SOL → Task runs → Loop
```

After (fixed):
```
Every 5min → Poll task_queue → Spawn DOOBY → Process ONE task → Kill session → Wait 5min → Repeat
```

### 4. Safety Rules

1. **Sequential only** — Never run DOOBY + LOKI simultaneously
2. **Check `ollama ps`** before spawning DOOBY for orchestrator
3. **If model not loaded** — Wait, don't spawn (prevents timeout)
4. **Max tasks per session:** 1 (kill after each)
5. **Circuit breaker:** If 3 consecutive tasks fail, pause orchestrator

## Implementation Steps

1. [ ] Update orchestrator-daemon.py config (poll interval, agent target)
2. [ ] Test with one real task
3. [ ] Re-enable LaunchAgent
4. [ ] Monitor first 3 runs for failures
5. [ ] If stable, leave running

## Compute Savings

Before: SOL (kimi-k2.6:cloud) every 10s = massive cloud cost
After: DOOBY (qwen3.5:9b local) every 5min = ~$0

**Estimated:** 99% reduction in SAOS orchestrator compute cost

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| DOOBY times out | 300s timeout, warmed model |
| Task queue piles up | Batch tasks, process ONE per 5min cycle |
| Model conflict with LOKI | Schedule LOKI jobs away from orchestrator times |
| Session leak | KillAfterRun=true, fresh session per task |

## Files to Update

| File | Action |
|------|--------|
| `orchestrator-daemon.py` | Change poll interval, agent target |
| `~/.openclaw/openclaw.json` | Add orchestrator cron config |
| LaunchAgent plist | Update if needed |
| `SAOS-COMPUTE-PAUSE-STATE.md` | Update restore instructions |

---
*Ready for implementation*
