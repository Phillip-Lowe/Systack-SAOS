# SAOS Architecture Overview

**Document ID:** SYS-ARCH-v3.0
**Version:** 3.0
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
SAOS (Systack Agent Orchestration System) is a 10-agent AI fleet deployed on dedicated VPS instances, orchestrated via PostgreSQL task queues and accessible through Tailscale-secured networks.

---

## 1. Fleet Composition

### 10-Agent Canonical Fleet

| Tier | Agent | Emoji | Role | Capabilities |
|------|-------|-------|------|-------------|
| Execution | SOL | 🛰️ | Orchestrator | orchestration, execution, synthesis |
| Execution | CODY | 💻 | Build Engine | coding, voice, streaming |
| Execution | ASSEMBLY | 🛠️ | Deployment | n8n, workflows, credentials |
| Quality/Risk | VALI | ✅ | Validation | testing, validation, quality |
| Quality/Risk | PESSI | ⚠️ | Risk Analysis | security, validation, risk |
| Intelligence | ORACLE | 🔮 | Design/Architecture | design, research, planning |
| Intelligence | ATLAS | 🗺️ | Knowledge | memory, documentation |
| Engagement | CHATTY | 💬 | Communication | communication, onboarding, content |
| Engagement | GENI | 🎨 | Creative | image_gen, video_gen, creative |
| Compliance | JURIS | ⚖️ | Legal/Compliance | legal, regulatory oversight |

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
    ├─ Port 8768: Customer Portal API
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

## 3. Data Flow

### Customer Portal Data Flow

```
Dashboard HTML (index.html)
    ↓ fetch /api/auth/login (POST client_id + PIN)
Customer Portal API (api.py :8768)
    ↓
PostgreSQL (systack_memory)
    ├─ saos_clients (account info, auth_pin)
    ├─ client_auth_tokens (session tokens, expiry)
    ├─ agent_state (agent status)
    ├─ task_queue (task history)
    ├─ chat_conversations (chat threads)
    ├─ chat_messages (message history)
    └─ message_bus (inter-agent comms)
```

### Authentication Flow

```
User (Browser)
    ↓ POST /api/auth/login
    {client_id: int, pin: string}
    ↓
API validates PIN against saos_clients.auth_pin
    ↓
Generates secure random token (secrets.token_urlsafe)
    ↓
Stores token hash (SHA256) in client_auth_tokens
    ↓
Returns Bearer token to client
    ↓
Client stores in localStorage
    ↓
All subsequent requests: Authorization: Bearer <token>
    ↓
API validates token hash, checks expiry, revokes on logout
```

### Chat Flow

```
Client Dashboard
    ↓ POST /api/chat/conversations
    ↓ GET /api/chat/conversations/{id}/messages
    ↓ POST /api/chat/conversations/{id}/messages
Customer Portal API
    ↓
PostgreSQL chat_conversations + chat_messages
    ↓
Polling: GET /api/chat/poll?since={timestamp}
    ↓
Agent responses via webhook: POST /api/chat/webhook/agent-response
```

### Provisioning Pipeline

```
Stripe Checkout
    ↓
n8n Webhook (test/production)
    ↓
saos_provision_bridge.py (:8767)
    ↓
PostgreSQL task_queue (DEPLOY task)
    ↓
Orchestrator polls every 10s
    ↓
ASSEMBLY executes provision_vps.py
    ↓
Vultr API → VPS created
    ↓
Client email sent
```

---

## 4. Mobile Architecture

### Mobile-First Design Principles

| Feature | Implementation |
|--------|----------------|
| **Responsive breakpoints** | 768px (tablet), 480px (mobile) |
| **Touch targets** | Minimum 44px × 44px |
| **Safe areas** | `env(safe-area-inset-*)` for notches |
| **Navigation** | Hamburger menu (☰) on mobile |
| **Sidebar** | Slide-out overlay on mobile |
| **Input** | `inputmode="numeric"` for PIN, `font-size: 16px` to prevent iOS zoom |
| **Form validation** | JavaScript-only (button type="button"), no HTML5 validation |

### Mobile Authentication

```
iOS/Android
    ↓
Tailscale VPN connection
    ↓
HTTPS via Tailscale TLS (trusted on device)
    ↓
Dashboard HTML served from Flask (static_folder)
    ↓
JavaScript detects /dashboard path prefix for API calls
    ↓
PIN entry → fetch → Bearer token → localStorage
    ↓
Session persists until logout or 30-day expiry
```

### Mobile API Path Resolution

```
Tailscale serve configuration:
    /          → proxy http://127.0.0.1:18789 (Systack site)
    /dashboard → proxy http://127.0.0.1:8768 (Customer Portal)

Browser at https://host/dashboard/:
    fetch('/api/auth/login') → https://host/api/auth/login ❌ WRONG
    fetch('/dashboard/api/auth/login') → https://host/dashboard/api/auth/login ✓ CORRECT

Solution: API_BASE = '/dashboard' when path starts with '/dashboard'
```

---

## 5. Security Model

### Network Security
- **Tailnet-only** — no public internet exposure
- **HTTPS** — TLS termination via Tailscale
- **mTLS** — Tailscale handles device authentication

### Dashboard Authentication
- **PIN-based:** 4-digit PIN per client, stored in PostgreSQL
- **Session tokens:** Secure random 32-byte tokens, SHA256 hashed server-side
- **30-day expiry:** Automatic session cleanup
- **Revocation:** Logout clears token from database
- **Local storage:** Tokens stored in browser localStorage (secure context via HTTPS)

### Credential Management
- OAuth secrets: Never committed (see RULE 7)
- API keys: Stored in PostgreSQL, not files
- Tailscale keys: Rotated via admin console

---

## 6. Monitoring & Health

### Health Checks
- `/api/portal/health` — Customer portal API
- `/api/portal/status` — Full fleet status (requires auth)
- `/api/auth/me` — Session validation
- Tailscale serve status — `tailscale serve status`

### Logs
| Service | Log Location |
|---------|-------------|
| Customer Portal | `Systack/content/saos/saos-data/logs/customer-dashboard.log` |
| Fleet Dashboard | `Systack/content/saos/saos-data/logs/dashboard.log` |
| Invoice Pipeline | `Systack/content/saos/saos-data/logs/invoice-pipeline.log` |

---

## 7. Known Issues & TODO

### High Priority
- [ ] Vultr API key integration for auto-provisioning
- [ ] Stripe webhook production test

### Medium Priority
- [ ] Billing portal integration
- [ ] Agent performance metrics
- [ ] Cost tracking dashboard
- [ ] iOS Safari certificate trust for `.ts.net` URLs

### Completed
- [x] Customer portal static file serving
- [x] Tailscale serve configuration
- [x] LaunchAgent auto-restart
- [x] 10-agent fleet documentation
- [x] PIN-based authentication
- [x] Session token management
- [x] Mobile-responsive layout
- [x] Chat system with conversations
- [x] Activity audit trail

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-17 | Initial architecture |
| 2.0 | 2026-06-23 | Added customer portal, 10-agent fleet, Tailscale serve |
| 3.0 | 2026-06-25 | Added PIN authentication, session tokens, mobile architecture section, API path resolution, chat system |

**Latest version:** Internal wiki
