# SAOS Service Manual

**Document ID:** SYS-SM-v7.0
**Version:** 7.0
**Status:** PRODUCTION READY
**Prepared for:** SAOS Clients
**Prepared by:** SOL — SyStack Operations Layer
**Date:** June 30, 2026
**Support:** support@systack.net

---

## What's New in v7.0

- **Live Operations** endpoint — Real-time agent heartbeat monitoring
- **Activity** endpoint — Full audit trail of task lifecycle events
- **Dynamic Services** — Services fetched from backend config, not hardcoded
- **Deliverable Storage** — Upload/download/list endpoints for file management
- **Stripe Integration** — Tier-specific checkout links and pricing

---

## Overview

The SAOS Customer Portal v2.1 is a single-page web application that gives clients real-time access to their AI agent fleet. This manual covers all system components, authentication, and operational details.

---

## System Architecture

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
    ├─ Deliverable endpoints (/api/deliverables/*)
    ├─ PDF downloads (/download/*)
    └─ PostgreSQL (systack_memory DB)
```

---

## Authentication

### PIN-Based Authentication Flow

1. Admin generates **temporary PIN** (6 digits, 24-hour expiry)
2. Client registers with temp PIN → sets **permanent PIN** (4–10 digits)
3. Client logs in with Client ID + PIN
4. System returns **Bearer token** (SHA-256 hashed, 30-day expiry)
5. Token stored in browser localStorage
6. All API calls include: `Authorization: Bearer <token>`

### Auth Endpoints

| Endpoint | Method | Auth Required | Purpose |
|----------|--------|-------------|---------|
| `/api/auth/login` | POST | No | Login with Client ID + PIN |
| `/api/auth/register` | POST | No | First-time PIN setup from temp PIN |
| `/api/auth/forgot-pin` | POST | No | Request PIN reset |
| `/api/auth/change-pin` | POST | Bearer | Change PIN while logged in |
| `/api/auth/logout` | POST | Bearer | Revoke current token |
| `/api/auth/me` | GET | Bearer | Get current client info |
| `/api/portal/onboarding-status/{id}` | GET | No | Check if client needs setup |

---

## Dashboard Tabs

### 1. Chat Tab
- Conversation sidebar with unread badges
- Real-time messaging with AI agents
- Auto-task creation on action keywords ("create", "build", "fix", "deploy", "update")
- System messages for task creation confirmation
- Typing indicator
- 5-second polling for updates

### 2. Dashboard Tab
- **Metrics**: Active, Pending, Completed tasks, Unread messages
- **Agent Fleet**: Clickable cards with avatar, role, description, capabilities, status
- **Status colors**: IDLE (gray), BUSY (cyan), ERROR (red), OFFLINE (gray)

### 3. Services Tab
- Tier-specific service cards (active vs. pending)
- Infrastructure details (VPS specs, AI models, network)
- Support information (channel, response time, SLA)
- Current plan badge display
- **Dynamic loading**: Services fetched from `/api/portal/services` based on client tier

### 4. Tasks Tab
- Full task list with filter buttons
- **Filters**: All, Pending, Running, Done, Failed
- **Columns**: Task name, description, agent, status, created
- **Click any row** → opens detail modal with full info + error messages
- **File upload**: Paperclip icon in task detail → secure storage
- **File download**: Download links for agent-delivered files

### 5. Activity Tab
- Real audit trail of task lifecycle events
- Status icons (🔄 Running, ⏳ Pending, ✅ Done, ❌ Failed, 💀 Dead, 📁 Upload)
- **Clickable items** → same detail modal as Tasks tab
- Uses display_name + description

### 6. Live Operations Tab
- Real-time agent heartbeat monitoring
- **💓 Active**: Agent responded within last 5 minutes
- **⚠️ Stale**: No response in 5+ minutes
- **🔴 Offline**: Agent not responding
- Shows last heartbeat timestamp per agent

### 7. Docs Tab
- PDF downloads with tier-specific filtering
- Documents: Quick Start, User Guide, Service Manual, Architecture, Mobile Guide

### 8. Settings Tab
- **Account Info**: Client ID, name, email, plan badge, status
- **Security**: Change PIN (requires current PIN)
- **Deployment Info**: Type, VPS status, Tailscale URL

---

## API Endpoints (v2.1)

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
| `/api/portal/activity` | GET | Bearer | Real activity audit trail |
| `/api/portal/services` | GET | Bearer | Tier-specific services (dynamic) |
| `/api/portal/agents` | GET | None | Agent list with roles + descriptions |
| `/api/portal/client` | GET | Bearer | Client info |
| `/api/chat/conversations` | GET | Bearer | List chat conversations |
| `/api/chat/conversations` | POST | Bearer | Create new conversation |
| `/api/chat/conversations/<id>/messages` | GET | Bearer | Get messages |
| `/api/chat/conversations/<id>/messages` | POST | Bearer | Send message (auto-creates task) |
| `/api/chat/conversations/<id>/close` | POST | Bearer | Close conversation |
| `/api/chat/webhook/agent-response` | POST | None | Agent → chat (n8n/OpenClaw webhook) |
| `/api/chat/poll` | GET | Bearer | Poll for new messages + task updates |
| `/api/deliverables/upload` | POST | Bearer | Upload file deliverable |
| `/api/deliverables/list` | GET | Bearer | List client deliverables |
| `/api/deliverables/download/<filename>` | GET | Bearer | Download file deliverable |
| `/download/*` | GET | None | PDF document downloads |

---

## Database Schema

### saos_clients (enhanced v2.1)

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| customer_name | VARCHAR | Display name |
| customer_email | VARCHAR | Registered email |
| tier | VARCHAR | Plan tier |
| auth_pin | VARCHAR(10) | Permanent PIN |
| temp_pin | VARCHAR(10) | Temporary PIN (24hr) |
| temp_pin_expires_at | TIMESTAMP | Expiry for temp PIN |
| onboarding_status | VARCHAR | pending / pin_set / active / suspended |
| last_login_at | TIMESTAMP | Last login timestamp |
| login_count | INTEGER | Total login count |

### task_queue (enhanced v2.1)

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| task_type | VARCHAR | Machine type |
| display_name | VARCHAR | Human-readable name |
| description | TEXT | Full description |
| status | VARCHAR | PENDING / RUNNING / DONE / FAILED / DEAD |
| assigned_agent | VARCHAR | Agent responsible |
| priority | INTEGER | 1-10, 5 default |
| payload_json | JSONB | Request details + deliverable info |

### agent_state (enhanced v2.1)

| Column | Type | Description |
|--------|------|-------------|
| agent_name | VARCHAR | Primary key |
| role | VARCHAR | Short title |
| role_description | TEXT | Full explanation |
| capabilities | JSONB | Array of skill strings |
| avatar_emoji | VARCHAR(10) | Visual icon |
| tier_access | VARCHAR | all / specific tier |
| status | VARCHAR | IDLE / BUSY / ERROR / OFFLINE |
| last_heartbeat | TIMESTAMP | Last activity timestamp |

### client_auth_tokens

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| client_id | INTEGER | Foreign key |
| token_hash | VARCHAR(64) | SHA-256 hash |
| expires_at | TIMESTAMP | Token expiry |
| last_used_at | TIMESTAMP | Last activity |
| revoked_at | TIMESTAMP | Revocation time |

### chat_conversations

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| client_id | INTEGER | Owner |
| title | VARCHAR | Conversation title |
| status | VARCHAR | active / closed / archived |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |
| closed_at | TIMESTAMP | |

### chat_messages

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| conversation_id | INTEGER | Parent thread |
| sender_type | VARCHAR | client / agent / system |
| sender_name | VARCHAR | Display name |
| sender_agent | VARCHAR | Agent ID (if agent) |
| content | TEXT | Message body |
| message_type | VARCHAR | text / task_created / task_update / system |
| task_id | INTEGER | Linked task |
| read_at | TIMESTAMP | Read receipt |
| created_at | TIMESTAMP | |

---

## Admin Tools

### admin_client.py

| Command | Purpose |
|---------|---------|
| `--create-temp-pin {id}` | Generate temporary PIN for onboarding |
| `--list-clients` | Overview of all clients |
| `--client-status {id}` | Detailed client info |

### Example Usage

```bash
# Generate temp PIN
python3 admin_client.py --create-temp-pin 1

# List all clients
python3 admin_client.py --list-clients

# Check specific client
python3 admin_client.py --client-status 1
```

---

## Service Tiers

| Tier | Price | Target | Key Features |
|------|-------|--------|-------------|
| Personal | $49/mo | Individuals | Email triage, calendar, reminders, research |
| Personal+ | $99/mo | Power users | + Voice, multi-device, expense tracking |
| Business | $299/mo | SMBs | Invoice processing, lead qualification, team chat |
| Enterprise | $799/mo | Large orgs | On-premise, HIPAA, white-glove, 4hr SLA |
| Private | $799/mo | Regulated | Air-gapped, zero cloud, audit trail |
| Accelerate | $249/mo | Startups | Cloud GPU, auto-scaling, fast deployment |

### Stripe Checkout Links

Each tier has associated Stripe checkout URLs for monthly and annual billing.

---

## Security

### Network Security
- **Tailscale WireGuard** encryption for all traffic
- Tailnet-only access (no public internet exposure)
- HTTPS via Tailscale TLS termination

### Application Security
- PIN-based authentication (4–10 digits)
- Session tokens hashed with SHA-256
- 30-day token expiry with revocation
- Client-scoped data access (all queries filter by client_id)
- No cross-client data leakage

### Data Security
- PostgreSQL stored locally on VPS
- No cloud data exposure (except Stripe — client's own account)
- All AI processing on local Ollama models
- No third-party AI API calls with client data

---

## Troubleshooting

| Symptom | Cause | Solution |
|---------|-------|----------|
| "Invalid PIN" | Wrong PIN | Try again or use Forgot PIN flow |
| "PIN not set" | No auth_pin in DB | Generate temp PIN for client first |
| "Temp PIN expired" | >24 hours | Generate new temp PIN |
| "Client not found" | Wrong ID | Verify numeric Client ID |
| "Session expired" | Token expired | Re-login with Client ID + PIN |
| Page blank on mobile | Tailscale not connected | Connect Tailscale VPN |
| PDF won't download | Wrong URL path | Use `/dashboard/download/` prefix |
| "Service Temporarily Unavailable" | API restarting | Click Retry or wait 30s |
| Agent stale | Processing large task | Check Tasks tab, wait or contact support |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-06-22 | Initial dashboard (Overview, Agents, Tasks, Account) |
| v2.0 | 2026-06-24 | Complete rebuild: Chat, Dashboard, Services, Tasks, Docs. Tier content. Token auth. |
| v2.1 | 2026-06-25 | PIN onboarding, agent descriptions, task detail modals, Settings tab, 7 total tabs |
| v2.1+ | 2026-06-29 | Live Ops tab, Activity audit trail, dynamic services, deliverable storage, error fallback |

---

*Internal document. Not for client distribution.*
