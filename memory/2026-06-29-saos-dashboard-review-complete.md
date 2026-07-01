# SAOS Dashboard Review — 2026-06-29 01:44 CDT

## User Directive
"Review and verify the dashboard. Are we giving all the services we offer? Is it intuitive?"

## Current State Analysis

### ✅ What's Working Well
1. **Dynamic Services Tab** (just fixed) — Now pulls from backend config, not hardcoded
2. **Real Activity Log** (just fixed) — Shows actual events, not task duplicates
3. **Agent Heartbeat** (just fixed) — Shows stale/active status
4. **Error Fallback** (just fixed) — Graceful failure UI
5. **PIN Auth + Session Management** — Secure, works on mobile
6. **Live Operations Tab** — Real-time agent status + task pipeline
7. **Deliverables System** — Upload/download working
8. **Chat System** — Full conversation history

### 🚨 Critical Finding: Dashboard Shows Services We DON'T Actually Offer

The dashboard is selling **SaaS-style features** (email triage, calendar mgmt, note organization) that are NOT Systack's actual service offerings.

**What the dashboard shows vs. What we actually sell:**

| Dashboard Shows | What We Actually Build/Sell | Match? |
|-----------------|------------------------------|--------|
| Email Triage & Drafting | ❌ Not a standalone service | ❌ |
| Calendar Management | ❌ Not a standalone service | ❌ |
| Task Reminders | ❌ Not a standalone service | ❌ |
| Document Summarization | ❌ Not a standalone service | ❌ |
| Research Assistance | ❌ Not a standalone service | ❌ |
| Note Organization | ❌ Not a standalone service | ❌ |
| Multi-Device Sync | ❌ Not a service | ❌ |
| Voice Interaction | ⚠️ Experimental, not priced | ❌ |
| Expense Tracking | ❌ Not a service | ❌ |
| Custom Integrations | ⚠️ Vague, not productized | ❌ |
| Invoice Processing | ✅ YES — Actual product | ✅ |
| Lead Qualification | ✅ YES — Actual product | ✅ |
| Customer Support Drafting | ✅ YES — Actual product | ✅ |
| Document Classification | ✅ YES — Actual product | ✅ |
| Report Generation | ✅ YES — Actual product | ✅ |
| Data Entry Elimination | ✅ YES — Actual product | ✅ |
| Knowledge Base Search | ✅ YES — Actual product | ✅ |
| Compliance Audit Trail | ✅ YES — Actual product | ✅ |
| On-Premise Deployment | ⚠️ Infrastructure, not service | ❌ |
| HIPAA-Grade Privacy | ⚠️ Feature, not service | ❌ |
| White-Glove Setup | ⚠️ Delivery method, not service | ❌ |
| Priority Support | ⚠️ Support tier, not service | ❌ |

**Result: ~14 of 32 services are misaligned with actual offerings**

### 🎯 The Real Systack Services (from pricing.html + service-packages.md)

**Private Tier ($799/mo):**
1. ✅ Private Document Extraction Pipeline
2. ✅ Automated Invoice Processing System
3. ✅ Self-Hosted Customer Support Automations
4. ✅ Local Data Entry Elimination System
5. ✅ Private Knowledge Base Search
6. ✅ Automated Compliance Audit Trail

**Accelerate Tier ($249/mo):**
1. ✅ Automated Invoice Processing System
2. ✅ Self-Hosted Customer Support Automations
3. ✅ Local Data Entry Elimination System
4. ✅ Automated Lead Qualification Pipeline
5. ✅ Document Classification & Routing Engine
6. ✅ Scheduled Report Generator

**Business Fleet ($299/mo) — MISSING FROM DASHBOARD:**
1. 7 AI agents (orchestration, build, deployment, validation, risk, architecture, knowledge)
2. Invoice processing pipeline
3. Lead qualification
4. Customer support drafting
5. 10,000 n8n runs/mo
6. Same-day support

**Enterprise Fleet ($799/mo) — MISSING FROM DASHBOARD:**
1. Everything in Business + 3 more agents (CODY, CHATTY, GENI)
2. 32GB RAM (vs 16GB)
3. Unlimited n8n runs
4. 4-hour SLA
5. Quarterly business reviews

### 📊 Dashboard Tier Problems

1. **Personal/Personal+ tiers** — We don't sell these anymore (pricing page shows only Business/Enterprise/Accelerate/Private)
2. **Business tier services** — Shows personal features (email triage, calendar) instead of business automations
3. **Enterprise tier** — Missing key differentiators (CODY/CHATTY/GENI agents, unlimited runs, dedicated support)
4. **Accelerate tier** — Has wrong services (duplicates Private instead of cloud-focused)
5. **Private tier** — Correct services but missing infrastructure details

### 🔴 Intuition Problems

1. **"Request Setup" button on every inactive service** — Users click, nothing happens (no actual setup workflow exists for most services)
2. **No service descriptions match actual capabilities** — "Email Triage" sounds like an inbox tool, not an AI automation
3. **Services tab vs. Tasks tab** — Users don't understand the difference (services = what you can request, tasks = what's being built)
4. **No pricing visible in dashboard** — Users see services but can't tell what tier they need
5. **Missing "What We Handle / You Handle"** — From pricing page; builds trust by showing scope

### ✅ Intuitive Elements

1. **Live Ops tab** — Clear what's happening RIGHT NOW
2. **Agent cards with emojis** — Easy to understand at a glance
3. **Task pipeline (Pending → Running → Completed)** — Visual progress tracking
4. **Chat as default tab** — Natural first action
5. **PIN auth** — Simple, no passwords to remember

---

## Recommendation: Dashboard Needs Service Realignment

### Option A: Quick Fix (30 min)
Update `TIER_SERVICES` in `api.py` to match actual offerings:
- Remove Personal/Personal+ tiers entirely
- Fix Business tier to show actual 7-agent fleet services
- Fix Enterprise tier to show 10-agent + unlimited runs
- Fix Accelerate to show cloud-focused services
- Remove fake "Request Setup" buttons from non-existent services

### Option B: Full Realignment (2 hours)
- Restructure Services tab to show: "What We Handle" vs "What You Handle"
- Add pricing context ("Included in your $299/mo plan")
- Link each service to actual documentation
- Show service status as: Available / In Progress / Live / Not Included
- Add "Upgrade" button for tier-limited features

### Option C: Systack Brand Alignment (4 hours)
- Redesign Services tab to match pricing page layout
- Show 4 tiers (Business Fleet, Enterprise Fleet, Accelerate, Private)
- Each tier card shows: included services, infrastructure, support level
- "Add to My System" instead of "Request Setup"
- Integration with Stripe for instant upgrades

## My Recommendation

**Do Option A immediately** (quick fix). The dashboard is currently selling services we don't have, which creates:
- Client confusion
- Support burden ("I requested email triage, where is it?")
- Brand damage (promising things we can't deliver)

**Then Option C** when you have bandwidth — make the dashboard a true sales/self-service tool.

## Decision Needed

Green: Do you want me to:
1. **Fix the services now** (Option A — 30 min)
2. **Skip for now** and work on other priorities
3. **Full redesign** (Option C — longer session)
