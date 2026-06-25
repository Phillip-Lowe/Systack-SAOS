# SAOS Architecture Overview

**Document ID:** SYS-ARCH-v4.0
**Version:** 4.0
**Status:** SYSTACK INTERNAL
**Prepared for:** Systack Engineering
**Prepared by:** SOL + ORACLE
**Builder:** SOL + ORACLE + ASSEMBLY
**Source System:** SAOS v2026.06
**Date:** June 25, 2026
**Support:** Internal

---

## SAOS System Architecture

### Overview
SAOS (Systack Agent Orchestration System) is a 10-agent AI fleet deployed on dedicated VPS instances, orchestrated via PostgreSQL task queues and accessible through Tailscale-secured networks. The customer portal (v2.1) provides PIN-based authentication, real-time chat, task tracking, and service management.

---

## 1. Fleet Composition

### 10-Agent Canonical Fleet

| Tier | Agent | Emoji | Role | Description | Capabilities |
|------|-------|-------|------|-------------|-------------|
| Execution | SOL | 🛰️ | System Operations Liaison | Main point of contact. Coordinates fleet, handles strategic requests. | system-optimization, strategic-planning, fleet-coordination, automation-design |
| Execution | CODY | 💻 | Code Agent | Writes, reviews, deploys code. Website changes, API integrations. | code-generation, deployment, technical-reviews, bug-fixes |
| Execution | ASSEMBLY | 🛠️ | Integration Builder | Connects tools. Workflows between Stripe, Slack, email, databases. | workflow-automation, integration-setup, api-connections, data-pipelines |
| Quality | VALI | ✅ | Validation Agent | Quality control. Reviews code, tests automations, verifies data. | code-review, testing, validation, quality-assurance |
| Quality | PESSI | ⚠️ | Pessimist / Risk Agent | Identifies edge cases, security risks, failure modes. | risk-analysis, edge-case-detection, security-review, failure-mode-analysis |
| Intelligence | ORACLE | 🔮 | Research Agent | Deep research, analysis, strategic evaluation. | market-research, technology-evaluation, strategic-analysis, competitive-intelligence |
| Intelligence | ATLAS | 🗺️ | Deployment Agent | Infrastructure and DevOps. Servers, Tailscale, system health. | infrastructure, deployment, devops, server-management |
| Engagement | CHATTY | 💬 | Communication Agent | Messaging, outreach, content creation. Drafts emails, social posts. | content-creation, email-drafting, social-media, customer-communications |
| Engagement | GENI | 🎨 | Creative Agent | Images, videos, creative assets. Marketing visuals and multimedia. | image-generation, video-generation, creative-design, brand-assets |
| Compliance | JURIS | ⚖️ | Legal & Compliance Agent | Reviews for compliance, audits configs, ensures legal requirements. | compliance-review, legal-audit, policy-check, deployment-review |

### System Loop (Canonical)

```
ORACLE → Design → CODY → Build → ASSEMBLY → Deploy → VALI → Validate → PESSI → Stress-test → SOL → Execute → CHATTY → Communicate → GENI → Visualize → ATLAS → Store → JURIS → Legal → [Loop]
```

---

## 2. Infrastructure

### VPS Tiers

| Plan | Vultr Tier | vCPU | RAM | Storage | Monthly Cost |
|------|-----------|------|-----|---------|-------------|
| Business | vhp-8c-16gb-amd | 8 | 16GB | 160GB NVMe | $96 |
| Enterprise | voc-g-8c-32gb-160s-amd | 8 | 32GB | 160GB NVMe | $240 |

### Network Architecture

```
Client Device (Tailscale)
    ↓
Tailscale Tailnet (Encrypted Mesh)
    ↓
VPS (Ubuntu 22.04 + Tailscale)
    ├─ Port 8765: Fleet Dashboard API
    ├─ Port 8766: Invoice Dashboard API
    ├─ Port 8768: Customer Portal API (v2.1)
    ├─ Port 18789: OpenClaw Gateway
    └─ PostgreSQL (systack_memory)
```

### Persistence

| Service | Port | LaunchAgent | Status |
|---------|------|-------------|--------|
| Fleet Dashboard | 8765 | net.systack.dashboard | ✅ Running |
| Invoice Dashboard | 8766 | net.systack.invoice-dashboard | ✅ Running |
| Customer Portal | 8768 | net.systack.customer-dashboard | ✅ Running |
| Orchestrator | N/A | net.systack.orchestrator | ✅ Running |
| Webhook Bridge | 8767 | net.systack.webhook-bridge | ✅ Running |

---

## 3. Customer Portal v2.1 — Architecture

### Overview

The customer portal is a single-page application served by a Flask API. It provides PIN-based authentication, real-time chat, task tracking, and service management for SAOS clients.

### Component Diagram

```
Client Browser
    ↓ (HTTPS via Tailscale)
Tailscale Serve (reverse proxy /dashboard/)
    ↓
Flask API (api.py, port 8768)
    ├─ Static file serving (index.html)
    ├─ Auth endpoints (/api/auth/*)
    ├─ Portal endpoints (/api/portal/*)
    ├─ Chat endpoints (/api/chat/*)
    ├─ PDF downloads (/download/*)
    └─ PostgreSQL (systack_memory DB)
```

### Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│ ONBOARDING FLOW                                               │
│                                                               │
│ Admin generates temp PIN (admin_client.py)                    │
│     ↓                                                         │
│ Client visits dashboard → "First time? Set up your PIN"       │
│     ↓                                                         │
│ Client enters: Client ID + Temp PIN + New PIN                │
│     ↓                                                         │
│ POST /api/auth/register → validates temp PIN                 │
│     ↓                                                         │
│ Sets auth_pin, onboarding_status='active', clears temp_pin   │
│     ↓                                                         │
│ Auto-login with new PIN                                       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ REGULAR LOGIN FLOW                                            │
│                                                               │
│ Client enters: Client ID + PIN                                │
│     ↓                                                         │
│ POST /api/auth/login → validates PIN against saos_clients    │
│     ↓                                                         │
│ Generates session token (SHA-256 hashed, 30-day expiry)      │
│     ↓                                                         │
│ Token stored in localStorage, sent as Bearer header          │
│     ↓                                                         │
│ All API calls require: Authorization: Bearer <token>         │
└──────────────────────────────────────────────────────────────┘
```

### API Endpoints (v2.1)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/portal/health` | GET | None | Health check |
| `/api/portal/onboarding-status/<id>` | GET | None | Check if client needs PIN setup |
| `/api/auth/login` | POST | None | Login with Client ID + PIN |
| `/api/auth/register` | POST | None | First-time PIN setup from temp PIN |
| `/api/auth/forgot-pin` | POST | None | Request PIN reset via email |
| `/api/auth/change-pin` | POST | Bearer | Change PIN (logged-in clients) |
| `/api/auth/logout` | POST | Bearer | Revoke current token |
| `/api/auth/me` | GET | Bearer | Get current client info |
| `/api/portal/status` | GET | Bearer | Fleet overview, metrics, agents |
| `/api/portal/tasks` | GET | Bearer | Task list with descriptions |
| `/api/portal/agents` | GET | None | Agent list with roles + descriptions |
| `/api/portal/client` | GET | Bearer | Client info |
| `/api/chat/conversations` | GET | Bearer | List chat conversations |
| `/api/chat/conversations` | POST | Bearer | Create new conversation |
| `/api/chat/conversations/<id>/messages` | GET | Bearer | Get messages |
| `/api/chat/conversations/<id>/messages` | POST | Bearer | Send message (auto-creates task) |
| `/api/chat/conversations/<id>/close` | POST | Bearer | Close conversation |
| `/api/chat/webhook/agent-response` | POST | None | Agent → chat (n8n/OpenClaw webhook) |
| `/api/chat/poll` | GET | Bearer | Poll for new messages + task updates |
| `/download/*` | GET | None | PDF document downloads |

### Database Schema (v2.1 Additions)

```sql
-- Task queue enhancements
ALTER TABLE task_queue ADD COLUMN display_name VARCHAR(255);
ALTER TABLE task_queue ADD COLUMN description TEXT;

-- Agent state enhancements
ALTER TABLE agent_state ADD COLUMN role VARCHAR(255);
ALTER TABLE agent_state ADD COLUMN role_description TEXT;
ALTER TABLE agent_state ADD COLUMN capabilities JSONB DEFAULT '[]';
ALTER TABLE agent_state ADD COLUMN avatar_emoji VARCHAR(10);
ALTER TABLE agent_state ADD COLUMN tier_access VARCHAR(50) DEFAULT 'all';

-- Client onboarding
ALTER TABLE saos_clients ADD COLUMN onboarding_status VARCHAR(50);
ALTER TABLE saos_clients ADD COLUMN temp_pin VARCHAR(10);
ALTER TABLE saos_clients ADD COLUMN temp_pin_expires_at TIMESTAMP;
ALTER TABLE saos_clients ADD COLUMN last_login_at TIMESTAMP;
ALTER TABLE saos_clients ADD COLUMN login_count INTEGER DEFAULT 0;

-- Client invitations
CREATE TABLE client_invitations (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES saos_clients(id),
    invite_code VARCHAR(64) UNIQUE,
    email VARCHAR(255),
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Frontend Architecture

| Component | Technology | Notes |
|-----------|-----------|-------|
| SPA | Vanilla HTML/CSS/JS | No framework dependency |
| Auth | Bearer token in localStorage | 30-day expiry, SHA-256 hashed |
| Chat polling | setInterval 5s | Real-time message updates |
| Mobile | Responsive CSS + hamburger nav | Touch-optimized, iOS safe areas |
| Modal system | CSS overlay + JS | Task detail + agent detail modals |

### Admin Tools

```bash
# Generate temp PIN for new client
python3 admin_client.py --create-temp-pin <client_id>

# List all clients
python3 admin_client.py --list-clients

# Check specific client status
python3 admin_client.py --client-status <client_id>
```

---

## 4. Service Tiers

| Tier | Price | Target | Key Features |
|------|-------|--------|-------------|
| Personal | $49/mo | Individuals | Email triage, calendar, reminders, research |
| Personal+ | $99/mo | Power users | + Voice, multi-device, expense tracking |
| Business | $299/mo | SMBs | Invoice processing, lead qualification, team chat |
| Enterprise | $799/mo | Large orgs | On-premise, HIPAA, white-glove, 4hr SLA |
| Private | $799/mo | Regulated | Air-gapped, zero cloud, audit trail |
| Accelerate | $249/mo | Startups | Cloud GPU, auto-scaling, fast deployment |

---

## 5. Security Model

### Network Security
- **Tailscale WireGuard** encryption for all traffic
- Tailnet-only access (no public internet exposure)
- HTTPS via Tailscale TLS termination

### Application Security
- PIN-based authentication (4–10 digits)
- Session tokens hashed with SHA-256
- 30-day token expiry with revocation
- Client-scoped data access (all queries filter by client_id)

### Data Security
- PostgreSQL stored locally on VPS
- No cloud data exposure (except Stripe — client's own account)
- All AI processing on local Ollama models

---

## 6. Dashboard Tabs (v2.1)

| Tab | Purpose | Key Features |
|-----|---------|-------------|
| Chat | Client ↔ Agent messaging | Conversation sidebar, auto-task creation, polling |
| Dashboard | Fleet overview | Metrics, agent cards with descriptions + capabilities |
| Services | Plan-specific services | Tier-based service list, infrastructure, support info |
| Tasks | Task management | Filterable list, clickable detail modal, descriptions |
| Activity | Recent activity | Last 20 tasks as feed, clickable for details |
| Docs | PDF downloads | Tier-specific document access |
| Settings | Account management | Change PIN, view account info, deployment details |

---

*Internal document. Not for client distribution.*