# Percy 4GB VPS Deployment — FAILURE ANALYSIS (2026-06-27)

**Date:** 2026-06-27
**Client:** Jacqueline, McDonald's GM
**VPS:** Vultr 4GB ($20/mo) — 66.42.121.145
**Status:** ❌ FAILED — Context overflow on EVERY prompt (even "Hey")

---

## What We Tried (Everything)

### Attempt 1: Original Config (qwen2.5:3b, 16K context)
- **Result:** Context overflow, compaction errors, swapping
- **RAM:** 3.5GB used / 4GB total

### Attempt 2: qwen2.5:3b-4k (4K context variant)
- **Result:** Still overflowed after 1-2 prompts
- **Compaction reserve:** Set to 2048 → 20000
- **Error:** "Auto compaction cannot recover this term"

### Attempt 3: qwen2.5:1.5b (smallest model)
- **Result:** STILL overflowed
- **RAM used:** 505MB (much better)
- **Error:** Same compaction failure

### Attempt 4: Stripped Identity Files (41 words total)
- **Files:** AGENTS.md (9w), SOUL.md (8w), MEMORY.md (10w), USER.md (7w), IDENTITY.md (6w), HEARTBEAT.md (1w)
- **Result:** STILL overflowed

### Attempt 5: Removed ALL Skills
- **Config:** `"skills": {"entries": {}}`
- **Result:** STILL overflowed

### Attempt 6: Reduced Model Context Window to 2048
- **Config:** `"contextWindow": 2048`, `"maxTokens": 1024`
- **Result:** STILL overflowed

---

## Root Cause Analysis

### The Smoking Gun (From Logs)

```
[context-overflow-precheck]
provider=ollama/qwen2.5:1.5b
estimatedPromptTokens=4356
promptBudgetBeforeReserve=2048
overflowTokens=2308
reserveTokens=16384
effectiveReserveTokens=2048
```

### What This Means

| Metric | Value | Interpretation |
|--------|-------|----------------|
| `estimatedPromptTokens=4356` | 4,356 tokens | Total system prompt before user message |
| `promptBudgetBeforeReserve=2048` | 2,048 tokens | Maximum allowed before compaction |
| `overflowTokens=2308` | 2,308 tokens | How much OVER the budget |
| `effectiveReserveTokens=2048` | 2,048 tokens | Available after reserve |

**The problem:** Even with ALL identity files stripped to 41 words and ALL skills removed, OpenClaw's own bootstrap overhead is **4,356 tokens**. This includes:
- OpenClaw runtime instructions
- Tool definitions (even with `profile: minimal`)
- Session context
- Agent identity wrapper
- System prompt assembly

### Why This Can't Be Fixed on 4GB

The `promptBudgetBeforeReserve` is hardcoded based on the model's context window. For a 1.5B model with 2048 context window, OpenClaw reserves ~2048 tokens for the conversation and allows 2048 for the system prompt.

But OpenClaw's own system prompt is **4356 tokens** — more than double the budget.

**There is no configuration to reduce OpenClaw's internal bootstrap size.**

---

## What WOULD Work (But Costs More)

### Option A: Upgrade to 8GB VPS ($40/mo)
- qwen2.5:7b with 32K context
- Full identity files
- Normal response times
- No compaction errors

### Option B: Use Existing 16GB VPS (Already Paid)
- You have 2 x 16GB instances (stopped since June 22)
- Start one, deploy Percy there
- Point Jacqueline's Tailscale to new VPS

### Option C: Upgrade OpenClaw
- Newer versions may have smaller bootstrap
- Requires reinstalling on VPS
- May not solve fundamental architecture issue

---

## Decision: Document and Defer

**Green's decision (2026-06-27 13:22 CDT):** Accept that 4GB cannot work. Document failure. Move on.

### Why This Makes Sense

1. **Time invested:** ~2 hours troubleshooting
2. **Root cause identified:** OpenClaw bootstrap too large for small models
3. **Fix available:** 8GB VPS ($20 more/month)
4. **Client expectation:** Jacqueline was told upgrade was needed from Day 1

---

## Files Created During This Session

| File | Purpose | Status |
|------|---------|--------|
| `PERCY-CONFIG-v2.0.md` | Full deployment docs | ✅ Kept (for 8GB deploy) |
| `deploy-percy-v2.sh` | Deploy script | ✅ Kept (for 8GB deploy) |
| `JACQUELINE-DEPLOY-GUIDE.md` | Client-friendly guide | ✅ Kept (for 8GB deploy) |
| `PERCY-4GB-DEPLOYMENT-FAILURE-ANALYSIS.md` | This document | ✅ Created |

---

## Next Steps (When Ready)

1. **Upgrade Jacqueline's VPS to 8GB** ($40/mo)
   - Vultr console → Resize → 8GB plan
   - Reboot
   - Use `PERCY-CONFIG-v2.0.md` config (full version)
   - Deploy with `deploy-percy-v2.sh`

2. **Or:** Start existing 16GB VPS and migrate

3. **Or:** Build a lighter-weight solution (n8n + simpler AI) for 4GB

---

## Lesson Learned

**"The system prompt is the enemy on small VPS."**

- Model size matters less than system overhead
- OpenClaw's bootstrap is non-trivial (4000+ tokens)
- 4GB VPS = demo only, not production
- Always test with actual prompts, not just "model loads"

---

*Documented by SOL*
*2026-06-27*
