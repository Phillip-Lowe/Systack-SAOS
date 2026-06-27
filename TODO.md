# TODO — What's Next (Updated 2026-06-27 11:04 CDT)

## ✅ DONE Today (Session 2026-06-27)

1. **SAOS Compute Pause** — Killed orchestrator, disabled email dispatcher, marked 72 tasks as test
2. **DOOBY + LOKI Verified** — Both run on local `qwen3.5:9b`, no cloud fallback
3. **LOKI Cron Migration** — 5 cloud jobs moved to local (RAG, Wiki, Memory, ASSEMBLY, Fleet)
4. **SAOS Orchestrator Tested** — Verified functional, deferred until full stack ready

---

## 🔴 HIGH PRIORITY — Next Session

### 1. SAOS Final Verification (Turn Orchestrator Back On)
**Trigger:** When you say "SAOS is ready"
**What:**
- Re-enable orchestrator daemon
- Final end-to-end test (client request → task → agent → completion)
- Verify all 10 fleet agents spawn correctly

### 2. n8n Email Dispatcher Fix
**Status:** Disabled (wrong port)
**Fix:** Change API port from 8768 → 8765 in n8n workflow
**File:** n8n workflow `eylye0Me5zyoXMc2`

### 3. VPS Provisioning — Real API Keys
**Status:** ✅ KEYS OBTAINED — Pipeline proven working 2026-06-22
**Verified:** Business + Enterprise tiers tested end-to-end
**Ready for:** Production client provisioning

---

## 🟡 MEDIUM PRIORITY — Backlog

### 4. iOS Safari `.ts.net` Cert Trust
**Issue:** iOS blocks Tailscale `.ts.net` URLs
**Workaround:** Use direct IP + Tailscale IP
**Proper fix:** Deploy custom cert or use Tailscale HTTPS

### 5. Dashboard Documentation Update
**Files needed:**
- User Guide v2.0 (Activity tab features)
- Mobile Access Guide (iOS Safari workaround)
- Admin Guide (PIN auth, session management)

### 6. Utopia Deli Order System
**Status:** Working (meal prep + catering)
**Next:**
- Weekly menu rotation automation
- Square payment retry logic (SQLite-backed)
- Customer notification system

### 7. Systack Website Updates
**Pending:**
- Service portfolio alignment with SAOS tiers
- Case studies / testimonials section
- Blog / content section

---

## 🟢 LOW PRIORITY — Nice to Have

### 8. AI Video Ad Service
**Idea:** "There's a [Business] for that" campaign series
**Price:** $500-1500/video, $2-5K/month retainer
**Status:** Concept validated, needs first client

### 9. Voice Agent (SOL Talk Mode)
**Status:** Research complete, architecture defined
**Blocked by:** Custom OpenClaw provider adapter
**Alternative:** Voicebox MCP integration (lower effort)

### 10. FLOS (Fleet Loop Orchestration System)
**Status:** Deferred indefinitely
**Reason:** 90% of pieces already exist, adding abstraction without fixing fundamentals = more failures

---

## ⏸️ DEFERRED — Waiting on External/User

| Item | Blocked By | When |
|------|-----------|------|
| SAOS Orchestrator | User decision | "After everything else verified" |
| VPS real provisioning | ✅ KEYS OBTAINED | Proven 2026-06-22 |
| Stripe production | Business registration | User decides |
| AI Video Service | First client | Marketing/outreach |

---

## 🎯 What Should We Do Right Now?

**Option A:** Fix n8n email dispatcher (quick win, 5 min)
**Option B:** Update dashboard docs (medium effort, 30 min)
**Option C:** Work on Utopia Deli weekly menu automation (revenue impact)
**Option D:** Something else you want

What's next?
