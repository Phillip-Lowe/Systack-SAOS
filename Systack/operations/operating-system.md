# SAOS Operating System

## The Complete Systack Business Process — Lead to Renewal

---

*Document Version: 1.0*
*Last Updated: 2026-07-06*
*Owner: SOL 🛰️ (Strategic Systems Operator)*
*Classification: Internal — Systack Operations*

---

## Table of Contents

1. [Lead Flow](#section-1-lead-flow)
2. [Discovery Call](#section-2-discovery-call)
3. [Proposal](#section-3-proposal)
4. [Close](#section-4-close)
5. [Onboarding](#section-5-onboarding)
6. [Deployment](#section-6-deployment)
7. [Support](#section-7-support)
8. [Renewal](#section-8-renewal)
9. [Metrics Dashboard](#section-9-metrics-dashboard)
10. [Fleet Responsibilities](#section-10-fleet-responsibilities)

---

## Section 1: Lead Flow

### Sources

Leads enter the SAOS ecosystem through five primary channels:

| Source | Mechanism | Typical Volume | Quality |
|--------|-----------|----------------|---------|
| **LinkedIn** | Organic posts, connection requests, InMail sequences | Medium | High |
| **Website Form** | `/contact` or `/demo-request` → n8n webhook | Low | Very High |
| **Referral** | Existing client → Green's network | Low | Highest |
| **Cold Outreach** | ATLAS-researched targets → CHATTY email/LinkedIn | Medium | Medium |
| **Conference** | Event capture → business card → CRM entry | Sporadic | High |

### Initial Capture

**Trigger:** Any lead creation event fires the `lead-captured` n8n webhook.

**Process:**
1. Lead data enters CRM (Airtable/Notion/Internal DB — TBD)
2. SOL receives notification via iMessage
3. Lead assigned status: `NEW`
4. Auto-enrichment runs (company size, industry, LinkedIn profile)

**Data Captured:**
- Name, title, company, email, phone
- Source attribution
- Timestamp
- Initial interest signals (form fields, email content)

### Lead Qualification

**ATLAS Research Packet** (auto-generated within 2 hours):

```
PROSPECT INTELLIGENCE PACKET — [Company Name]
├── Company Profile (size, revenue, industry, growth stage)
├── Decision Maker Analysis (Green's contact, their background)
├── Technology Stack (current tools, gaps, spend)
├── Competitive Landscape (who else sells to them)
├── Pain Point Hypotheses (based on industry patterns)
└── Recommended Approach (messaging angle, case study to reference)
```

**Scoring Model:**

| Criteria | Points |
|----------|--------|
| Company size 50-500 employees | +20 |
| Currently using manual processes | +25 |
| Has budget authority confirmed | +30 |
| Timeline < 90 days | +25 |
| Referred by existing client | +40 |
| Previous tool evaluation failed | +20 |

**Status Assignment:**
- **HOT (80+ points):** Priority outreach within 24 hours
- **WARM (50-79 points):** Outreach within 72 hours, nurture sequence
- **COLD (<50 points):** Long-term nurture, quarterly check-in

### First Contact

**CHATTY Outreach Asset** generated per lead:

| Channel | Asset | When Used |
|---------|-------|-----------|
| Email | Personalized intro + case study | Primary channel |
| LinkedIn | Connection request + value message | When email bounces |
| Phone | Call script with custom talking points | HOT leads only |

**Email Template Structure:**
1. Subject line (personalized, not salesy)
2. One-sentence observation about their business
3. Specific pain point hypothesis
4. Relevant case study (same industry/size)
5. Soft CTA (15-minute call, not "let's talk")

**Response Tracking:**
- Open rates tracked via n8n + email service
- Reply rate target: >15%
- Positive reply → meeting booking link (Calendly)
- No reply → 3-touch sequence over 10 days

---

## Section 2: Discovery Call

### Pre-Call Prep

**ATLAS delivers 24 hours before call:**
- Updated prospect intelligence
- 3 custom talking points based on recent news/hires
- Competitive intelligence (who else they're evaluating)
- Recommended demo features to highlight

**SOL prepares:**
- CRM entry updated with call details
- Demo environment configured with relevant features
- Pricing calculator loaded with estimated tier

### Call Structure (30 Minutes)

```
┌─────────────────────────────────────────────────────────┐
│  DISCOVERY CALL — 30 MINUTE STRUCTURE                   │
├─────────────────────────────────────────────────────────┤
│  0:00-0:02  OPENING                                     │
│             • Rapport (30 sec)                            │
│             • Agenda + time check (90 sec)                │
│             • "My goal: understand your world,           │
│               see if SAOS fits, and if not, that's OK"  │
├─────────────────────────────────────────────────────────┤
│  0:02-0:17  DISCOVERY QUESTIONS (15 min)                │
│             • What does [process] look like today?        │
│             • How many hours/week on manual tasks?        │
│             • What tools are you using now?               │
│             • What's the biggest bottleneck?              │
│             • What's this costing you (time/money)?       │
│             • When do you need this solved?               │
│             • Who else is involved in the decision?       │
│             • What happens if you do nothing?           │
├─────────────────────────────────────────────────────────┤
│  0:17-0:22  DEMO POSITIONING (5 min)                    │
│             • Show ONE relevant feature                   │
│             • Tie directly to pain point just discussed   │
│             • Don't show everything — curiosity sells     │
├─────────────────────────────────────────────────────────┤
│  0:22-0:27  CLOSE/NEXT STEPS (5 min)                    │
│             • "Based on what you've shared..."            │
│             • Proposal timeline (48 hours)                │
│             • Trial offer (14-day pilot, limited scope)   │
│             • Calendar hold for follow-up                 │
├─────────────────────────────────────────────────────────┤
│  0:27-0:30  BUFFER                                        │
│             • Q&A, objection handling                     │
│             • Confirm next steps, exchange contacts       │
└─────────────────────────────────────────────────────────┘
```

### Post-Call Actions

**SOL executes within 2 hours:**
1. CRM updated: call notes, pain points, next steps
2. Calendar hold placed for follow-up
3. Demo recording (if applicable) uploaded to portal
4. Risk flags logged (budget concerns, competitor mentions, timeline delays)
5. Notification sent to Green with summary

---

## Section 3: Proposal

### Proposal Template

**Standardized structure, tier-based pricing:**

```
SYSTACK PROPOSAL — [Company Name]
├── Executive Summary (pain points → SAOS solution)
├── Recommended Tier
│   ├── Business ($299/mo) — Core automation, 3 services
│   ├── Enterprise ($799/mo) — Full suite, priority support, custom workflows
│   └── Private ($799/mo) — On-premise, white-label, compliance package
├── Service Breakdown (what's included per tier)
├── Implementation Timeline (15 days standard)
├── Pricing
│   ├── Monthly option
│   ├── Annual option (2 months free = 17% savings)
│   └── Setup fee (if applicable: $500-$2,000)
├── Terms & Guarantees
│   ├── 30-day money-back guarantee
│   ├── Quarterly business review
│   └── Annual lock-in with price protection
└── Next Steps (signature, deposit, kickoff scheduling)
```

### Customization

**Per-proposal adjustments:**
- Add specific services (custom integration: +$200/mo)
- Remove irrelevant features (price adjusted accordingly)
- Include relevant case studies (same industry)
- Reference specific pain points from discovery

### Pricing Presentation

**Monthly vs. Annual:**

| Term | Price | Equivalent Monthly | Savings |
|------|-------|-------------------|---------|
| Month-to-month | $299/mo | $299 | — |
| Annual (Business) | $2,990/yr | $249 | 17% |
| Annual (Enterprise) | $7,990/yr | $666 | 17% |

**ROI Calculator:**
- Input: Hours saved/week, hourly rate, current tool spend
- Output: Annual savings, payback period, 3-year ROI

### Terms

- **30-Day Guarantee:** Full refund if not satisfied
- **Quarterly Review:** Business review every 90 days to assess value, adjust services
- **Annual Discount:** 17% savings for annual commitment
- **Price Protection:** Annual lock-in prevents price increases during term

### Delivery

- **Format:** PDF via email + portal notification
- **Timeline:** Within 48 hours of discovery call
- **Follow-up:** 3-day, 7-day, 14-day sequences

### Follow-Up Sequence

| Day | Action | Channel |
|-----|--------|---------|
| 3 | "Did you have any questions about the proposal?" | Email |
| 7 | Case study follow-up (relevant to their industry) | Email |
| 14 | "I'd love to walk through the proposal together" | Phone call |
| 30 | "No pressure — just checking in" | Email |

---

## Section 4: Close

### Contract Signing

- **Method:** DocuSign (preferred) or handwritten
- **Documents:** MSA + ASA + SOW (per JURIS templates)
- **Timeline:** Within 7 days of proposal acceptance
- **Counterparts:** Electronic signatures accepted

### Deposit & Payment

- **First Month:** Charged upon contract signing
- **Setup Fee:** $500-$2,000 (if applicable, based on complexity)
- **Payment Method:** Credit card via Stripe subscription
- **Invoice:** Sent via email with receipt

### Welcome Packet Delivery

- **Contents:** Standard Launch Kit (ASSEMBLY deliverable)
- **Format:** PDF + portal access
- **Includes:** Welcome guide, implementation timeline, support contacts, FAQ
- **Delivery:** Email + portal notification within 24 hours of payment

### Onboarding Scheduling

- **Start:** Within 5 business days of contract signing
- **Duration:** 15 days standard
- **Kickoff Call:** 30-minute call to align expectations, gather requirements
- **Client Contact:** Designated point person for implementation

### Handoff: Sales → Operations

**Green completes:**
1. Contract signed and filed
2. Payment method verified
3. Welcome packet delivered
4. Client introduced to SOL via email

**SOL takes over:**
1. Client record created in Command Center
2. Onboarding checklist initialized
3. VPS provisioning queued
4. Service configuration started

---

## Section 5: Onboarding

### Day 1: Provisioning

- **VPS:** Vultr instance created (16GB RAM, Ubuntu 24.04)
- **Tailscale:** Node added to Systack tailnet
- **Portal:** Customer portal deployed on port 8768
- **Command Center:** Client record created on port 8770
- **Credentials:** Temporary PIN generated and delivered

### Day 2-3: Configuration

- **Email Integration:** Invoice email address connected, IMAP configured
- **Form Endpoints:** Lead capture webhooks configured
- **Document Types:** Categories and tags defined
- **Report Templates:** Scheduled reports built
- **n8n Workflows:** Activated for client's services

### Day 4-7: Training

- **Client Training Session:** 60-minute walkthrough (video call)
- **First Invoice:** Process a real invoice end-to-end
- **First Lead:** Score and review a test lead
- **First Support Draft:** Generate and review a draft response
- **Dashboard Tour:** Show all features, answer questions

### Day 8-14: Monitoring & Adjustments

- **Daily Health Checks:** All 9 services green
- **Data Validation:** Compare extracted data to originals
- **Client Feedback:** Daily check-in via chat
- **Adjustments:** Tune scoring, fix edge cases, update templates
- **Regression Testing:** Ensure changes don't break existing features

### Day 15: Go-Live

- **Production Data Flow:** Switch from test to production
- **Final Health Check:** All services verified
- **Client Sign-Off:** Acceptance form signed
- **Monitoring Activated:** 24/7 alerting enabled
- **Handoff:** Onboarding complete, ongoing support begins

### Day 30: Check-In Call

- **Usage Review:** Metrics dashboard review
- **Value Assessment:** Hours saved, revenue impact
- **Feedback:** What's working, what needs improvement
- **Expansion Opportunities:** Additional services, tier upgrade
- **Renewal Discussion:** 11 months until renewal — no pressure

---

## Section 6: Deployment

### Technical Deployment Checklist

Per Internal Standards (COYD deliverable):

- [ ] VPS provisioned and secured (UFW, fail2ban, SSH hardening)
- [ ] Tailscale installed and authenticated
- [ ] PostgreSQL database initialized with schema
- [ ] Customer Portal deployed (port 8768)
- [ ] Command Center deployed (port 8770)
- [ ] n8n workflows imported and activated
- [ ] Environment variables configured
- [ ] Backup cron installed and verified
- [ ] Monitoring endpoints configured

### Service Health Verification

All 9 services must respond green:

| Service | Port | Health Endpoint |
|---------|------|-----------------|
| Customer Portal | 8768 | `/api/health` |
| Command Center | 8770 | `/api/health` |
| Invoice Dashboard | 8766 | `/api/summary` |
| Webhook Bridge | 8767 | `/api/health` |
| Booking Dashboard | 8772 | `/api/health` |
| n8n | 5678 | `/healthz` |
| Ollama | 11434 | `/api/tags` |
| PostgreSQL | 5432 | Connection test |
| Tailscale | — | `tailscale status` |

### Client Access Testing

- [ ] Portal login works with Client ID + PIN
- [ ] PIN change flow functional
- [ ] MFA setup works (Enterprise)
- [ ] Dashboard loads with real data
- [ ] PDF downloads work
- [ ] Chat widget connects
- [ ] Mobile responsive layout verified

### Data Validation

- [ ] First invoice: extracted total matches original PDF
- [ ] First lead: score makes sense, alert delivered
- [ ] First support draft: relevant, well-written
- [ ] First document: classified correctly, searchable
- [ ] First report: data accurate, formatting correct

### Documentation Handoff

- **Client Receives:** Standard Launch Kit (PDF + portal)
- **Systack Updates:** Internal records, runbook, FAQ
- **Backup:** First verified backup taken

### Sign-Off

Client signs acceptance form confirming:
- All purchased services are operational
- Data accuracy meets expectations
- Training is complete
- Support channels are understood
- Billing is confirmed

---

## Section 7: Support

### Ticket Intake

| Channel | Method | Priority |
|---------|--------|----------|
| **Email** | support@systack.net | Standard |
| **Chat** | In-app chat widget | Standard |
| **Phone** | +1-501-274-6231 | Urgent |
| **Emergency** | Enterprise direct line | Critical |

### Triage

Per VALI Acceptance Standards:

1. **Classify:** Which service is affected?
2. **Assess:** PASS or FAIL per acceptance criteria?
3. **Prioritize:**
   - **Critical:** Service down, data loss, security incident
   - **High:** Major feature broken, workaround exists
   - **Standard:** Minor issue, question, feature request
   - **Low:** Documentation, nice-to-have

### Resolution

| Issue Type | Assigned To | SLA |
|------------|-------------|-----|
| Code bug | DOOBY | 24 hours |
| Configuration | LOKI | 4 hours |
| Monitoring alert | PESSI | Immediate |
| Code review | CODY | 48 hours |
| Architecture | ASSEMBLY | 1 week |
| Legal/compliance | JURIS | 1 week |
| Creative/design | GENI | 1 week |

### Escalation

- **Level 1:** Support ticket → SOL triages
- **Level 2:** Unresolved in SLA → Auto-escalates to Green
- **Level 3:** Critical/relationship → Green handles directly
- **Enterprise:** Direct line to Green for critical issues

### Follow-Up

- **24 hours:** Satisfaction check (email or chat)
- **7 days:** Regression test (ensure fix didn't break anything)
- **Documentation:** Update runbook, add to FAQ
- **Systemic Issues:** Notify other clients if applicable

---

## Section 8: Renewal

### 60 Days Before Renewal

- **Usage Report:** Generate and review client's metrics
- **Value Summary:** Hours saved, invoices processed, leads scored
- **Expansion Opportunities:** Identify upsell potential
- **Internal Review:** Any unresolved issues, churn risk flags

### 30 Days Before Renewal

- **Renewal Conversation:** Green calls client
- **Pricing Discussion:** Current tier vs. upgrade options
- **Tier Changes:** Adjust services based on usage
- **Contract:** Updated terms sent for review

### 14 Days Before Renewal

- **Contract Sent:** DocuSign with updated terms
- **Terms Confirmed:** Price, services, duration
- **Payment Method:** Verified with Stripe

### Renewal Day

- **Payment:** Stripe subscription charged
- **Records Updated:** CRM, Command Center, internal docs
- **Confirmation:** Email sent to client with receipt
- **Portal Updated:** New term dates displayed

### Post-Renewal

- **Thank You:** Green sends personal note
- **Referral Request:** "Know anyone else who could benefit?"
- **Case Study:** If client is willing, document success story
- **Testimonial:** Request quote for website/sales materials

### Churn Process

If client does not renew:

1. **Exit Interview:** Green calls to understand why
2. **Data Export:** Full export provided within 30 days
3. **Archive Client:** Move to inactive status in Command Center
4. **Learnings:** Document what went wrong, update processes
5. **Re-engagement:** Quarterly check-in for 1 year (they may return)

---

## Section 9: Metrics Dashboard

### Weekly Tracking

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Leads generated | 10+/week | CRM count |
| Discovery calls held | 5+/week | Calendar events |
| Proposals sent | 3+/week | CRM count |
| Close rate | >25% | Closed won / proposals sent |
| Average deal size | $500+/mo | MRR / active clients |
| Time to close | <30 days | First contact → signed |
| Monthly recurring revenue (MRR) | Growing | Sum of all subscriptions |
| Churn rate | <5%/month | Cancelled / active clients |
| Net revenue retention | >100% | (MRR + upsells - churn) / starting MRR |
| Support tickets per client | <3/month | Ticket count / active clients |
| Average resolution time | <24 hours | Time from ticket open to close |
| Client satisfaction (CSAT) | >4.5/5 | Post-resolution survey |

### Dashboard

These metrics should be visible in the Command Center (port 8770) under the Overview tab. If not yet implemented, they should be added as a future priority.

### Reporting Cadence

| Frequency | Report | Audience |
|-----------|--------|----------|
| Daily | Service health, critical alerts | SOL |
| Weekly | Sales pipeline, MRR, churn | Green |
| Monthly | Full business review, client health | Green + SOL |
| Quarterly | Strategic review, roadmap | Green |

---

## Section 10: Fleet Responsibilities

### Agent Role Map

| Agent | Role | Primary Responsibilities |
|-------|------|------------------------|
| **SOL 🛰️** | Strategic Systems Operator | Strategy, oversight, sales support, memory management, documentation, lead flow orchestration, renewal management |
| **ATLAS 🗺️** | Research & Discovery | Prospect research packets, competitive analysis, market intelligence, pain point hypotheses, technology stack analysis |
| **CHATTY 💬** | Messaging & Communications | Outreach assets (email, LinkedIn, SMS), client notifications, support communications, escalation messages |
| **JURIS ⚖️** | Legal & Compliance | Contracts (MSA, ASA), compliance templates, privacy policies, risk assessment, legal review |
| **PESSI ⚠️** | Monitoring & Risk | Service health monitoring, alert rules, incident response, pre-mortems, failure analysis |
| **VALI ✅** | Testing & QA | Acceptance standards, test plans, bug triage, deployment validation, regression testing |
| **CODY 💻** | Code Review & Standards | Code review, internal standards, best practices, security audit, credential standards |
| **ASSEMBLY 🛠️** | Architecture & Packaging | System design, launch kit packaging, integration planning, deployment topology |
| **DOOBY 🤖** | Coding & Building | Feature development, script writing, n8n workflow building, bug fixes |
| **LOKI 🏠** | Background Operations | Cron jobs, file monitoring, health checks, log analysis, scheduled reports, backup verification |
| **GENI 🎨** | Creative & Design | Frontend development, visual assets, branding, UI/UX improvements |

### When to Spawn Each Agent

| Trigger | Agent | Priority |
|---------|-------|----------|
| New lead enters CRM | ATLAS | High |
| Outreach needed | CHATTY | High |
| Contract needed | JURIS | Medium |
| Service goes down | PESSI | Critical |
| New feature to test | VALI | High |
| Code to review | CODY | Medium |
| System design needed | ASSEMBLY | Medium |
| Code to write | DOOBY | High |
| Scheduled task | LOKI | Low |
| Design needed | GENI | Low |
| Strategic decision | SOL | Always |

### Agent Communication Flow

```
Lead → ATLAS (research) → CHATTY (outreach) → Green (call)
                                                      ↓
                                              SOL (CRM update)
                                                      ↓
                                              JURIS (contract)
                                                      ↓
                                              ASSEMBLY (launch kit)
                                                      ↓
                                              DOOBY (deployment)
                                                      ↓
                                              VALI (testing)
                                                      ↓
                                              LOKI (monitoring)
                                                      ↓
                                              PESSI (alerts)
                                                      ↓
                                              SOL (renewal)
```

---

*This Operating System is a living document. Update as processes evolve. Last updated: 2026-07-06.*
