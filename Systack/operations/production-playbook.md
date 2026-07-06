# SAOS Production Operations Playbook

**Version 1.0** | **Systack Systems** | **Last Updated: July 6, 2026**

---

> **Purpose:** This document enables anyone with the right access to operate SAOS day-to-day, handle incidents, onboard clients, and manage renewals — without requiring Green's direct involvement for routine operations.
>
> **Audience:** SOL operators, future team members, emergency runbook
> **Classification:** Internal — Systack Operations

---

## Section 1: Daily Operations Checklist

### Morning Routine (Start of Day)

**1.1 Fleet Health Check**
```bash
# Run the automated health check
python3 /Users/philliplowe/.openclaw/workspaces/sol/Systack/operations/fleet-health-check.py

# Expected output: 9/9 healthy, ALL SYSTEMS NOMINAL
# If any service shows DOWN: See Section 5 — Service Down escalation
```

**1.2 Overnight Alert Review**
- Check iMessage for any alerts from `backup_verify.py` (runs at 3:00 AM CDT)
- Expected: "✅ Backup verified" message daily
- If missing or error: See Section 5 — Data Loss escalation

**1.3 Support Ticket Review**
- Check SAOS Command Center for client alerts: `https://command.systack.net`
- Check for any new support requests in shared channels
- Review n8n dashboard for failed workflows: `https://n8n.systack.net`

**1.4 Client Usage Metrics**
- Access Command Center → Clients tab
- Verify all active clients show `status: "active"`
- Note any clients with `last_login > 7 days` (engagement risk)

**1.5 Infrastructure Connectivity**
```bash
# Verify Cloudflare Tunnel
curl -s https://portal.systack.net/api/portal/health | grep -q "ok" && echo "✅ Portal OK" || echo "❌ Portal DOWN"

curl -s https://command.systack.net/api/health | grep -q "ok" && echo "✅ Command OK" || echo "❌ Command DOWN"

# Verify n8n accessibility
curl -s -o /dev/null -w "%{http_code}" http://localhost:5678/healthz | grep -q "200" && echo "✅ n8n OK" || echo "❌ n8n DOWN"

# Verify Ollama
curl -s http://localhost:11434/api/tags | grep -q "qwen" && echo "✅ Ollama OK" || echo "❌ Ollama DOWN"
```

**1.6 Git Status Check**
```bash
cd /Users/philliplowe/.openclaw/workspaces/sol
git status --short

# Expected: Working tree clean, or only untracked memory files
# If uncommitted changes exist: Determine if they should be committed or reverted
# Never leave uncommitted changes overnight
```

---

### End of Day

- Note any issues in daily log: `memory/YYYY-MM-DD.md`
- If anything significant happened, update `MEMORY.md`
- Ensure all cron jobs are confirmed active: `cron list`

---

## Section 2: Weekly Operations Checklist

### Every Monday: Health & Trends Review

**2.1 Fleet Health Trends**
- Review last 7 days of health check logs
- Document any patterns (recurring failures, slow responses)
- Check PESSI failure simulations for any patterns emerging

**2.2 Client Usage Report**
- Access Command Center → Overview tab
- Pull weekly usage per client
- Flag clients with declining usage (churn risk)

**2.3 Support Ticket Summary**
- Count new tickets vs resolved tickets
- Identify recurring issues (candidates for automation)
- Flag any tickets open > 3 days

### Every Friday: Maintenance & Hygiene

**2.4 Git Commit/Push**
```bash
cd /Users/philliplowe/.openclaw/workspaces/sol
git add -A
git commit -m "Weekly ops: $(date +%Y-%m-%d)"
git push systack-saas main
```

**2.5 Backup Verification Review**
- Review `backup_log` table in PostgreSQL
- Confirm all backups from the week show verified status
- If any show failed or missing → See Section 5

**2.6 Pipeline Tracker Update**
- Update `Systack/sales/pipeline-tracker.md`
- Move qualified leads to appropriate stage
- Flag stalled prospects (>14 days no activity)

### Weekly: Business Metrics

**2.7 MRR Calculation**
- Count active clients × monthly price
- Add any annual prorations
- Document in weekly notes

**2.8 Churn Check**
- Count clients lost this week
- Calculate churn rate: (Churned / Total at start) × 100
- Target: <5% monthly churn

**2.9 Prospect Pipeline Review**
- Total leads this week
- Conversion rate: (Closed / Total leads) × 100
- Average deal size
- Pipeline value by stage

---

## Section 3: Lead-to-Close Process (Operator Runbook)

### Step 1: Lead Arrives

**Lead Sources:**
| Source | System | Action |
|--------|--------|--------|
| Website form | n8n webhook | Auto-creates entry, SOL notified via iMessage |
| Referral | Manual entry | Add to pipeline tracker, tag source |
| LinkedIn outreach | CHATTY automation | Log in pipeline tracker |
| Cold email reply | Green's inbox | Forward to SOL for CRM entry |

**Qualification Scoring:**

| Criterion | Question | Weight |
|-----------|----------|--------|
| **Budget** | Can they afford $299-799/mo? | Required |
| **Authority** | Do they make buying decisions? | Required |
| **Need** | Do they have manual processes to automate? | Required |
| **Timeline** | Willing to start within 30-60 days? | Required |
| **Tech-readiness** | Do they have systems to connect? | Bonus +20 |
| **Growth trajectory** | Are they scaling? | Bonus +20 |

**Scoring:**
- All 4 required = **Qualified** → Proceed to Step 2
- Missing 1+ required = **Nurture** → Add to drip sequence, revisit in 30 days
- Score 80+ = HOT (outreach within 24 hours)
- Score 50-79 = WARM (outreach within 72 hours)
- Score <50 = COLD (quarterly check-in)

### Step 2: Research

**File to use:** `Systack/sales/prospect-research-packets.md` (5 niches pre-built)

For new niches, spawn ATLAS to generate a custom research packet.

**What to gather:**
- Company overview (size, industry, locations)
- Decision maker profile
- Current technology stack
- Specific pain points (from ATLAS research)
- Recommended approach angle

### Step 3: Outreach

**Decision Tree — Which CHATTY Asset:**

```
Lead Niche:
├── Restaurants (multi-location)
│   └── Send: Restaurant invoice/ventory automation email (Sequence 1)
├── Warehouses / 3PL
│   └── Send: Document classification + SLA tracking email (Sequence 1)
├── Healthcare Practices
│   └── Send: Compliance + document automation email (Sequence 1)
├── Real Estate / Property Management
│   └── Send: Lead qualification + reporting email (Sequence 1)
├── Professional Services
│   └── Send: Invoice processing + support drafting email (Sequence 1)
```

**Assets location:** `Systack/sales/outreach-asset-library.md`
- 9 cold emails (3 per niche × 3 email sequence)
- 2 SMS follow-up templates
- 3 LinkedIn connection messages
- 8 objection responses
- Follow-up sequences (post-discovery, post-proposal, re-engagement)

**Send rules:**
- Email is primary channel
- LinkedIn when email bounces
- SMS only after explicit opt-in
- Phone only for HOT leads (score 80+)

### Step 4: Discovery Call

**Scheduling:** Send Calendly link (or manual scheduling if not set up)

**30-Minute Structure:**
- 0-2 min: Rapport + agenda + time check
- 2-17 min: Discovery questions (pain points, current tools, budget, timeline, decision process)
- 17-22 min: Demo ONE relevant feature tied to pain point
- 22-27 min: Next steps (proposal in 48 hours, 14-day pilot offer)
- 27-30 min: Q&A + confirm follow-up

**Post-call (within 2 hours):**
1. Update pipeline tracker
2. Schedule follow-up
3. Log risk flags
4. Notify Green with summary

### Step 5: Proposal

**Templates:** `Systack/sales/outreach-asset-library.md` → Part 5: Proposal Templates
- Business Tier template ($299/mo)
- Enterprise Tier template ($799/mo)

**Customization:**
- Add client-specific pain points from discovery
- Include relevant case study
- Remove irrelevant services
- Adjust pricing if annual (17% discount)

**Delivery:** PDF via email within 48 hours of discovery call

**Follow-up sequence:**
- Day 3: Q&A offer email
- Day 7: Case study email
- Day 14: Breakup email

### Step 6: Close

**Green handles:**
1. Contract signing (DocuSign or handwritten) — using JURIS templates
2. First month payment via Stripe checkout link
3. Welcome packet delivery (ASSEMBLY Standard Launch Kit)
4. Onboarding scheduling (15-day implementation)

**SOL handles:**
1. Client record creation in Command Center
2. Onboarding checklist initialization
3. VPS provisioning queue
4. Service configuration planning

### Step 7: Handoff (Sales → Operations)

| Step | Owner | Action |
|------|-------|--------|
| Contract signed | Green | File in `Systack/legal/` |
| Payment confirmed | Green | Verify Stripe charge |
| Welcome email sent | Green | Include credentials, portal URL |
| Client record created | SOL | Run `onboard_client.py` |
| VPS provisioned | SOL | Day 1 of onboarding |
| Service config | SOL | Days 2-3 |
| Training scheduled | Green | Coordinate with client |
| Go-live | SOL | Day 15 |
| 30-day check-in | Green | Relationship call |

---

## Section 4: Onboarding-to-Deployment Runbook

### Day 1: Provisioning

```bash
# 1. Run onboarding script
cd /Users/philliplowe/.openclaw/workspaces/sol/Systack/content/saos/saos-data/customer-dashboard
python3 scripts/onboard_client.py --name "Client Name" --email "email@company.com" --tier business

# Capture: Client ID, temporary PIN, conversation ID

# 2. Verify client can log in
curl -s http://localhost:8768/api/portal/health

# 3. Send credentials to client (Green handles delivery)
# - Client ID (from script output)
# - Temporary PIN (from script output, expires in 24 hours)
# - Portal URL: https://portal.systack.net
```

### Day 2-3: Configuration

- Configure email integration for invoice processing
- Connect lead capture form webhooks
- Define document types and categories
- Build report templates
- Activate n8n workflows for client's services

### Day 4-7: Training

- 60-minute training call (Green or SOL)
- Process first real invoice end-to-end
- Score and review a test lead
- Generate and review first support draft
- Full dashboard tour

### Day 8-14: Monitoring & Adjustments

- Daily health checks
- Data validation (extracted data matches originals)
- Daily client check-in via chat
- Tune scoring, fix edge cases
- Regression testing

### Day 15: Go-Live

- Switch from test to production data
- Final health check (all 9/9 green)
- Client signs acceptance form (VALI standards)
- Monitoring activated (24/7 alerting)

### Day 30: Check-In Call

- Usage review (Command Center metrics)
- Value assessment (hours saved, revenue impact)
- Feedback collection
- Expansion opportunities
- Renewal discussion (11 months out)

---

## Section 5: Support & Escalation Matrix

### Escalation Table

| Issue Type |Level 1 (SOL) | Level 2 (Green) | Level 3 (Critical) |
|------------|-------------|-----------------|---------------------|
| **Service down** | Restart service via launchd. If fails in 2 attempts, escalate. | Notified within 30 min. Decides next steps. | If data loss or security: immediate call to Green. |
| **Data loss** | Stop all services. Restore from latest verified backup. | Notified immediately. Verifies restore. | Green + JURIS assess legal/compliance impact. |
| **Client complaint** | Triage per VALI acceptance standards (PASS/FAIL). Attempt resolution. | If relationship risk or unresolved >24h: Green handles. | If client threatening cancellation: Green calls immediately. |
| **Security incident** | Lock down affected systems. Preserve logs. Change credentials. | Notified IMMEDIATELY (iMessage + phone). | Green + JURIS assess breach scope, client notification. |
| **Billing issue** | Document issue. Queue for Green. | Green handles all billing matters. | If Stripe is down: see PESSI Sim Sim 2. Switch to manual invoicing. |
| **Backup failure** | Retry backup. Check disk space. | Notified within 1 hour. | If 2+ consecutive failures: Green decides on manual intervention. |

### Notification Methods

| Priority | Method | Response SLA |
|----------|--------|-------------|
| **Critical** | iMessage + phone call to +15012746231 | 4 hours (Enterprise), 24 hours (Business) |
| **High** | iMessage to +15012746231 | 24 hours |
| **Standard** | Email to support@systack.net | 48 hours |
| **Low** | Log in Command Center | 1 week |

### Service Restart Commands

```bash
# Customer Portal
launchctl kickstart -k gui/$(id -u)/net.systack.customer-dashboard

# Command Center
launchctl kickstart -k gui/$(id -u)/net.systack.command-center

# Invoice Dashboard
launchctl kickstart -k gui/$(id -u)/net.systack.invoice-dashboard

# Webhook Bridge
launchctl kickstart -k gui/$(id -u)/net.systack.webhook-bridge

# Booking Dashboard
launchctl kickstart -k gui/$(id -u)/net.systack.booking-dashboard

# Cloudflare Tunnel
launchctl kickstart -k gui/$(id -u)/net.systack.saos-cloudflare-tunnel
```

---

## Section 6: Renewal & Churn Process

### 60 Days Before Renewal

**SOL generates:**
- Usage report from Command Center (logins, invoices processed, leads scored, documents classified)
- Value summary (estimated hours saved, cost reduction)
- Expansion opportunities (unused features, tier upgrade potential)

**Green reviews and schedules renewal conversation.**

### 30 Days Before Renewal

**Green calls client:**
- Review usage report together
- Discuss satisfaction and concerns
- Present tier changes or upgrades
- Confirm renewal intent

### 14 Days Before Renewal

**Green sends:**
- Updated contract (if terms changed) via DocuSign
- Confirm pricing and services
- Verify payment method on file

### Renewal Day

**SOL executes:**
- Stripe charge processes automatically (subscription)
- Update Command Center records with new term dates
- Send confirmation email to client

### Post-Renewal

**Green sends:**
- Personal thank-you note
- Referral request ("know anyone else who could benefit?")
- Case study request (if client is willing)

### Churn Process (If Client Does Not Renew)

1. **Exit Interview:** Green calls within 7 days to understand why
2. **Data Export:** SOL provides full data export (JSON + CSV) within 30 days
3. **Archive:** SOL moves client to inactive status in Command Center
4. **Learnings:** Document what went wrong in `Systack/risk/` and update processes
5. **Re-engagement:** Quarterly check-in for 12 months (they may return)

---

## Section 7: What Green Does vs What SOL Does

### Green Only (Human Required)
- Sales calls and demos
- Relationship management
- Contract negotiation and signing
- Pricing decisions
- Spending approval
- Client escalation (relationship issues)
- Strategic direction decisions
- Public communications (emails, posts, messages to clients)

### SOL Only (Automated/System)
- System monitoring (health checks, alerts)
- File management and organization
- Documentation maintenance
- Automation execution
- Memory and continuity
- Scheduling and cron management
- Backup verification
- Security event detection
- Usage metrics collection

### Both (Shared)
- Client communication (SOL via chat/portal, Green via phone/email)
- Issue resolution (SOL technical, Green relationship)
- Strategic decisions (SOL provides data, Green decides)
- Pipeline management (SOL tracks, Green sells)
- Renewal process (SOL generates reports, Green closes)

---

*This playbook is a living document. Update as processes evolve. Last updated: 2026-07-06.*