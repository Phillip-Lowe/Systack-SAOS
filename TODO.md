# TODO — Current State (Updated 2026-07-06 02:11 CDT)

## ✅ COMPLETED — SAOS Enterprise Readiness

All Oracle priorities P1-P5 complete. Command Center v2.0 live. 65/65 tests passing. 16 PDFs generated. Full endpoint test suite. Client onboarding script verified. Daily backup cron active.

## ✅ COMPLETED — Fleet Sales-Validation Sprint

All 8 fleet agents delivered:
- ATLAS: Prospect research (5 niches, 27KB)
- CHATTY: Outreach assets (emails, SMS, LinkedIn, scripts, 409 lines)
- JURIS: Business infrastructure pack (6 legal docs, 16.9KB)
- PESSI: Pre-mortem (12 risks, 10 mitigations, 14.5KB)
- VALI: Acceptance standards (PASS/FAIL for 6 services, 382 lines)
- CODY: Internal standards (onboarding, deployment, DB, credentials, backup, docs, 11.9KB)
- ASSEMBLY: Standard launch kit (welcome, implementation, FAQ, support, training, pricing, 18.9KB)
- SOL: Operating system (lead→renewal, 10 sections, 21.5KB)

## ✅ COMPLETED — Sales Pipeline Tracker

`Systack/sales/pipeline-tracker.md` — operational CRM for tracking leads through the pipeline.

## ✅ COMPLETED — Fleet Health Monitor

`Systack/operations/fleet-health-check.py` — 15-minute cron, iMessage alerts on critical service failure.

---

## 🔴 HIGH PRIORITY — Next Actions

### 1. First Outreach Batch
**Status:** Ready to execute
**Needs:** Green's approval on 10 targets, email sending address, Calendly link
**Impact:** First real leads in the pipeline

### 2. iOS Safari Cert Trust
**Status:** Plan ready (Cloudflare Tunnel)
**Needs:** Green's decision to proceed
**Impact:** Mobile access for clients on iOS

### 3. Production Deployment
**Status:** Deployment checklist PDF ready
**Needs:** Green's decision to move from dev to prod credentials
**Impact:** Real clients can be onboarded

### 4. Stripe Billing Integration
**Status:** Revenue tab is placeholder
**Needs:** Stripe account setup, connect to SAOS_CUSTOMER_PORTAL_STRIPE_* env vars
**Impact:** Automated subscription billing

---

## 🟡 MEDIUM PRIORITY — Backlog

### 5. Monitoring Dashboard Enhancement
- Agent health metrics in Command Center
- Task queue depth visualization
- Error rate tracking over time
- Response time percentiles

### 6. Client Onboarding Flow Testing
- Script works (verified 2026-07-06)
- Needs real-world test with actual client
- Email delivery of credentials
- 15-day implementation timeline validation

### 7. Systack Website Updates
- Service portfolio alignment with SAOS tiers
- Case studies / testimonials section
- Blog / content section
- SEO optimization

### 8. Training Video Production
- 6 video outlines ready (in Standard Launch Kit)
- Needs screen recording, editing, upload
- YouTube unlisted or Loom

---

## 🟢 LOW PRIORITY — Nice to Have

### 9. AI Video Ad Service
- "There's a [Business] for that" campaign series
- $500-1500/video, $2-5K/month retainer
- Concept validated, needs first client

### 10. Voice Agent (SOL Talk Mode)
- Research complete, architecture defined
- Blocked by: Custom OpenClaw provider adapter
- Alternative: Voicebox MCP integration

### 11. Utopia Deli Enhancements
- Weekly menu rotation automation
- Customer notification system
- **Note:** Do not touch deli repo without explicit permission

---

## ⏸️ BLOCKED — Waiting on Green

| Item | Blocked By | Impact |
|------|-----------|--------|
| First outreach batch | Target approval + email setup | Revenue |
| iOS Safari cert trust | Decision to proceed | Mobile access |
| Production deployment | Decision to move to prod | Real clients |
| Stripe billing | Stripe account setup | Automated revenue |