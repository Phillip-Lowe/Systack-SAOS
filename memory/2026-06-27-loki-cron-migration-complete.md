# LOKI Cron Job Migration — COMPLETE (2026-06-27)

## New LOKI Jobs (Local-Only, qwen3.5:9b)

| Job | Time (CDT) | Task | Timeout |
|-----|-----------|------|---------|
| **LOKI: RAG Auto-Sync** | Daily 2:00 AM | Run `rag_ingest_v2.py --incremental` | 120s |
| **LOKI: Wiki Bridge Sync** | Daily **3:30 AM** | Run `wiki_bridge_sync.py` | 120s |
| **LOKI: Weekly Memory** | Tuesdays 8:00 AM | Promote daily logs → MEMORY.md | 300s |
| **LOKI: ASSEMBLY Check** | Jun 29 8:00 AM | Count ASSEMBLY tasks, report | 180s |
| **LOKI: Fleet Review** | Jun 29 8:30 AM | Count all agent usage, report | 180s |

## Staggered Schedule (No Overlaps)

```
2:00 AM  → LOKI: RAG Auto-Sync (120s max = done by 2:02 AM)
3:00 AM  → Memory Dreaming (system, ~16s)
**3:30 AM  → LOKI: Wiki Bridge Sync (120s max = done by 3:32 AM)** ← moved earlier
8:00 AM  → LOKI: Weekly Memory (Tuesdays only, 300s = done by 8:05 AM)
8:00 AM  → LOKI: ASSEMBLY Check (Jun 29 only, 180s = done by 8:03 AM)
8:30 AM  → LOKI: Fleet Review (Jun 29 only, 180s = done by 8:33 AM)
10:00 AM → Daily Agent Learning (SOL, cloud — 30 min, 10:00-10:30 AM)
```

**Why 3:30 AM?** Buffer before 4:00 AM memory wipe. Wiki sync completes by 3:32 AM, giving 28+ minutes safety margin.

**All LOKI jobs complete by 8:33 AM. Daily Agent Learning starts at 10:00 AM. No overlaps. Wiki Bridge Sync runs at 3:30 AM (before 4 AM memory wipe).**

## Disabled Cloud Jobs

| Job | Was | Now |
|-----|-----|-----|
| RAG Auto-Sync — Incremental Index | SOL, hourly | ❌ Disabled |
| Wiki Bridge Auto-Sync | SOL, 3:58 AM | ❌ Disabled |
| ASSEMBLY Utilization Review | SOL, Jun 29 9AM | ❌ Disabled |
| Fleet-Wide Agent Usage Review | SOL, Jun 29 10AM | ❌ Disabled |
| WEEKLY-MANUAL-MEMORY-PROMOTION | SOL, Tuesdays 9AM | ❌ Disabled |

## Compute Savings

Before: 5 jobs × daily cloud runs = ~$X/day
After: 5 jobs × daily local runs = $0/day (Ollama local)

Jobs staying cloud (justified):
- Daily Agent Learning (needs deep reasoning)
- Any future strategic tasks

## Rules

1. **Only ONE local job at a time** — sequential execution enforced by schedule
2. **Timeout: 120-300s** — enough for local model to complete
3. **Light context enabled** — reduces token usage
4. **Delivery: none** (silent) except Weekly Memory (BlueBubbles)
5. **If LOKI fails:** Check `ollama ps`, verify qwen3.5:9b loaded
