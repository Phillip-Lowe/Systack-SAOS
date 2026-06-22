# SAOS Service Manual

## For Business Fleet & Enterprise Fleet Clients

**Document ID:** SYS-CLIENT-MANUAL-v2.0  
**Updated:** June 2026  
**Classification:** Client Deliverable

---

## What's Included

This manual covers your SAOS deployment — what's running, how it works, and how to get help.

---

## 1. Your Deployment

### Business Fleet ($299/mo)
- **7 AI agents:** SOL, VALI, PESSI, ORACLE, ATLAS, ASSEMBLY, JURIS
- **Server:** Dedicated 16GB VPS (Vultr vhp-8c-16gb-amd)
- **Network:** Tailscale VPN access
- **Channels:** WhatsApp, SMS, WebChat
- **Storage:** 160GB NVMe SSD
- **Support:** Priority email (same-day)

### Enterprise Fleet ($799/mo)
Everything in Business Fleet plus:
- **+3 agents:** CODY (build), CHATTY (communication), GENI (creative)
- **On-premise option:** Hardware in your building
- **RAM:** 32GB
- **Support:** Dedicated line + SLA

---

## 2. Agent Functions

### Core Agents (All Plans)

| Agent | What It Does | When to Use |
|-------|-------------|-------------|
| **SOL** | Routes tasks, manages conversations | "Status check" "Queue work" |
| **VALI** | Validates outputs, catches errors | "Review this" "Is this correct?" |
| **PESSI** | Identifies risks, edge cases | "What could break?" "Stress-test this" |
| **ORACLE** | Designs systems, researches | "How should we build this?" |
| **ATLAS** | Maintains memory, lessons learned | "What did we decide last week?" |
| **ASSEMBLY** | Deploys changes, manages releases | "Push this live" "Rollback" |
| **JURIS** | Legal review, compliance | "Review this contract" "Is this allowed?" |

### Enterprise-Only Agents

| Agent | What It Does | When to Use |
|-------|-------------|-------------|
| **CODY** | Generates code, builds systems | "Build me a script" "Create workflow" |
| **CHATTY** | Client comms, onboarding | "Draft email" "Onboard new client" |
| **GENI** | Creates visuals, content | "Make a diagram" "Generate image" |

---

## 3. Accessing Your Fleet

### Dashboard
- URL: http://localhost:8765 (via Tailscale)
- Shows: Agent status, tasks, VPS health
- Auto-refreshes every 30 seconds

### Messaging
- **WhatsApp/SMS:** Text your assigned number
- **WebChat:** Embedded on your site
- **Email:** Forward documents to agent address

### API (Advanced)
- POST /api/tasks — Create tasks programmatically
- GET /api/status — Fleet health check
- Full API docs: Contact support

---

## 4. Data & Security

### Where Your Data Lives
- **Server:** Your dedicated VPS (US-based)
- **Database:** PostgreSQL + SQLite (local to your server)
- **Backups:** Hourly snapshots, retained 30 days
- **Network:** Tailscale encrypted mesh (no public exposure)

### Who Can Access
- You (via Tailscale)
- Systack support (with your permission)
- No third-party AI companies — models run locally

### Compliance
- Business: SOC2 Type II
- Enterprise: SOC2 + HIPAA + GDPR (on-premise)

---

## 5. Billing

| Plan | Monthly | Annual (2 months free) |
|------|---------|------------------------|
| Business | $299 | $2,988 |
| Enterprise | $799 | $7,990 |

**Payment:** Via Stripe (auto-renewing)  
**Cancellation:** Anytime, prorated refund within 30 days  
**Upgrades:** Pro-rated, instant

---

## 6. Support

| Issue Type | Response | Resolution |
|-----------|----------|------------|
| Service Down | < 30 min | 2-4 hours |
| Feature Broken | < 2 hours | Same day |
| Performance | < 4 hours | 24 hours |
| Question | < 24 hours | 72 hours |
| Feature Request | < 48 hours | Roadmap review |

**Contact:**
- Email: support@systack.net
- Emergency: (Provided after signup)
- Hours: 24/7 for critical issues

---

## 7. FAQ

**Q: Can I add more agents?**
Enterprise only. Business Fleet has fixed 7-agent configuration.

**Q: What if I need more RAM?**
Contact support. Upgrades typically complete within 1 hour.

**Q: Do you offer refunds?**
Full refund within 30 days. After that, prorated based on usage.

**Q: Can I export my data?**
Yes. Full database export available on request. Your data is yours.

**Q: What happens if Systack shuts down?**
Your server continues running. We provide documentation for self-management.

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Initial release |
| 2.0 | 2026-06-22 | Updated pricing, added agent details, expanded FAQ |

**Latest version:** https://systack.net/docs/client/SyStack-Service-Manual-Client-v2.0.pdf
