# SAOS Quick Start Guide

## For Business Fleet Clients (7 Agents)

**Your SAOS deployment is ready. Here's how to actually use it.**

---

## 1. Connect to Your Server

Your dedicated SAOS server runs on a private VPS. Access it securely through Tailscale:

```
1. Install Tailscale: https://tailscale.com/download
2. Accept the invite email from Systack
3. Join the network: tailscale up
4. Your server will appear as: saos-[your-business].tail573d57.ts.net
```

**Server details:**
- IP: (shown in your dashboard)
- RAM: 16GB
- vCPU: 8
- OS: Ubuntu 22.04 LTS

---

## 2. Talk to Your Fleet

Your agents communicate through the web dashboard or messaging channels:

### Web Dashboard
- URL: http://localhost:8765 (when connected via Tailscale)
- Shows: Agent status, task queue, recent activity

### Messaging Channels
- **WhatsApp:** Text your business number
- **SMS:** Text your assigned number
- **WebChat:** Embedded on your website

---

## 3. Your 7 Agents — What Each Does

| Agent | Role | What to Ask It |
|-------|------|----------------|
| **SOL** | Orchestrator | "What's the status?" "Queue a task" |
| **VALI** | Quality | "Check this for errors" "Validate output" |
| **PESSI** | Risk | "What could go wrong?" "Flag issues" |
| **ORACLE** | Architecture | "Design a workflow" "Research solution" |
| **ATLAS** | Knowledge | "What did we decide?" "Find previous task" |
| **ASSEMBLY** | Deploy | "Deploy this" "Rollback last change" |
| **JURIS** | Compliance | "Is this legal?" "Review contract" |

---

## 4. Common Tasks

### Invoice Processing
Forward invoices to your agent email:
- The agent reads and extracts data automatically
- Reviewed by JURIS for compliance
- Stored in your database
- View: Dashboard → Invoices

### Order Taking (WhatsApp/SMS)
Customers text your number:
- Agent confirms order details
- Sends to your POS or email
- No app required for customers

### Lead Qualification
Ask ORACLE: "Check for new leads"
- Scrapes configured sources
- Scores and ranks prospects
- Delivers morning briefing

### Daily Morning Briefing
Ask SOL: "Morning briefing"
- Overnight task summary
- Pending items requiring attention
- New leads or orders

---

## 5. Troubleshooting

| Problem | Fix |
|---------|-----|
| Can't connect to dashboard | Check Tailscale is running: `tailscale status` |
| Agent not responding | Check dashboard for agent status (green dot = online) |
| Messages not sending | Verify phone number configuration in n8n |
| Invoice not processing | Check spam folder; ensure PDF attachment |
| Slow responses | Check server load in dashboard; may need RAM upgrade |

---

## 6. Support

**Emergency (service down):** Call emergency line (provided after signup)
**General:** support@systack.net
**Dashboard:** Check status at https://systack.net/status

**Response times:**
- Critical: Under 30 minutes
- Broken feature: Under 2 hours  
- General: Under 24 hours

---

## 7. Next Steps

1. [ ] Connect via Tailscale
2. [ ] Send test message to your agent
3. [ ] Forward one invoice to test pipeline
4. [ ] Review dashboard daily for first week
5. [ ] Schedule training call if needed

**Questions?** Message SOL directly: "I need help with [topic]"
