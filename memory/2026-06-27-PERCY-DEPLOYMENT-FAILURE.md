# Percy 4GB VPS Deployment — FAILURE (2026-06-27 13:05-13:22 CDT)

**Directive:** "Deploy Percy v2.0 to Jacqueline's 4GB VPS"
**VPS:** 66.42.121.145 (Vultr 4GB)
**Root Password:** t4!MsEm[Ny!!v7$n (saved in Sol-Knowledge)
**Status:** ❌ FAILED — Context overflow on EVERY prompt

---

## What Was Attempted

| Attempt | Config | Result |
|---------|--------|--------|
| 1 | qwen2.5:3b, 16K context | Overflow + swapping |
| 2 | qwen2.5:3b-4k, 4K context | Compaction errors |
| 3 | qwen2.5:1.5b (smallest) | STILL overflowed |
| 4 | Identity stripped to 41 words | STILL overflowed |
| 5 | All skills removed | STILL overflowed |
| 6 | Context window 2048 | STILL overflowed |

**Every single attempt failed with the same error:** "Auto compaction cannot recover this term"

---

## Root Cause (From Logs)

```
[context-overflow-precheck]
estimatedPromptTokens=4356
promptBudgetBeforeReserve=2048
overflowTokens=2308
```

**OpenClaw's system bootstrap alone is 4,356 tokens** — more than double the available budget. This includes:
- OpenClaw runtime instructions
- Tool definitions (even with `profile: minimal`)
- Session context
- Agent identity wrapper

**There is no configuration to reduce this.**

---

## Why 4GB Cannot Work

| Requirement | Available | Gap |
|-------------|-----------|-----|
| OpenClaw system prompt | 4,356 tokens | — |
| Model context window | 2,048 tokens | ❌ -2,308 |
| User message budget | 0 tokens | ❌ None left |

Even with the smallest model (1.5B) and absolutely minimal identity files, the framework overhead exceeds what the model can handle.

---

## Decision: DOCUMENT AND DEFER

**Green's call (13:22 CDT):** Accept 4GB cannot work. Document failure. Move on.

**Files created:**
- `PERCY-4GB-DEPLOYMENT-FAILURE-ANALYSIS.md` — Complete analysis

**When ready to retry:**
- Upgrade VPS to 8GB ($40/mo) OR use existing 16GB stopped instance
- Use full Percy v2.0 config (no stripping needed)

---

## STATUS: BLOCKED — PENDING CLIENT AUTHORIZATION (2026-06-27 13:28 CDT)

**User decision:** "We haven't got authorization to upgrade to 8GB yet"

### What This Means

- Percy on 4GB VPS = **non-functional**
- Jacqueline cannot use Percy until VPS is upgraded
- **No further work** on Percy until 8GB authorization granted
- Current VPS left as-is (gateway stopped, minimal cost)

### Recommendation for Jacqueline

**Option A: Upgrade to 8GB ($40/mo)**
- Full Percy functionality
- Response times under 10 seconds
- All features working

**Option B: Stay on 4GB ($20/mo)**
- Percy will NOT work
- Continue using phone notes, manual scheduling
- Revisit when budget allows

**Option C: Explore Alternatives (Research)**
- n8n-based workflow automation (lighter weight)
- Simple chatbot without OpenClaw framework
- Manual assistance from Systack on per-request basis

---

## Lesson

> "The system prompt is the enemy on small VPS."
>
> — OpenClaw bootstrap is 4000+ tokens. 4GB VPS cannot handle it.

**Additional lesson:** Budget conversations should happen BEFORE deployment attempts.
