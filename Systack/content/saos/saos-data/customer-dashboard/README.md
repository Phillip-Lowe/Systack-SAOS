# SAOS Customer Dashboard

Client-facing portal for SAOS (Systack Agent Orchestration System) customers.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Full client dashboard — Chat, Dashboard, Services, Tasks, Docs tabs |
| `api.py` | Flask API serving client-scoped fleet data + real-time chat |
| `n8n-chat-bridge.json` | n8n workflow for bridging chat messages to agent responses |
| `schema.sql` | Database schema for chat + auth tables |
| `README.md` | This file |

## Quick Start

```bash
# Start the API (also serves index.html statically)
python3 api.py --port 8768

# Or use Flask directly
flask --app api.py run --port 8768

# Open in browser
open http://localhost:8768/
```

## API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Get Bearer token from client_id |
| `/api/auth/logout` | POST | Revoke current token |
| `/api/auth/me` | GET | Get current client info |

### Portal
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/portal/health` | GET | Health check (no auth) |
| `/api/portal/status` | GET | Fleet overview + client record |
| `/api/portal/tasks` | GET | Task history (last 50) |
| `/api/portal/agents` | GET | All agent states (no auth) |
| `/api/portal/client` | GET | Single client account details |

### Chat
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat/conversations` | GET | List conversations for client |
| `/api/chat/conversations` | POST | Create new conversation |
| `/api/chat/conversations/{id}/messages` | GET | Get messages |
| `/api/chat/conversations/{id}/messages` | POST | Send message |
| `/api/chat/conversations/{id}/close` | POST | Close conversation |
| `/api/chat/poll` | GET | Poll for new messages/tasks |
| `/api/chat/webhook/agent-response` | POST | Webhook for agents to reply |

## Dashboard Tabs

1. **Chat** — Real-time messaging with AI agents. Create conversations, send messages, receive agent responses.
2. **Dashboard** — Status metrics (active/pending/completed tasks, unread messages), agent fleet grid with roles.
3. **Services** — **Tier-specific** service cards showing exactly what the client is paying for, infrastructure details, support SLA.
4. **Tasks** — Full task history table with status pills (DONE/PENDING/FAILED/RUNNING).
5. **Docs** — Tier-filtered documentation (Base + Enterprise/Private get extra deployment guide).

## Auth

**Token-based authentication** using `Authorization: Bearer <token>` header.

- Tokens are generated on login and stored in browser localStorage
- Tokens expire after 30 days
- Current fallback: `?client_id=` query parameter (for direct testing)

## Service Tiers

The dashboard adapts content based on the client's `tier` field:

| Tier | Price | What's Shown in Services Tab |
|------|-------|-----------------------------|
| personal | $49/mo | Email, calendar, tasks, notes, research |
| personal+ | $99/mo | Above + multi-device, voice, expense tracking |
| business | $299/mo | Invoice processing, lead qualification, team Slack, reports |
| enterprise | $799/mo | Above + on-premise, HIPAA, white-glove, 4hr SLA |
| private | $799/mo | Document extraction, invoice, support, compliance audit |
| accelerate | $249/mo | Invoice, support, data entry, lead qual, reports |

## Design

- Dark theme matching Systack brand (`#001a2d` base)
- Accent: `#00a1db` / `#00c5e0` (Systack cyan)
- Responsive grid layout
- Real-time polling every 5 seconds for chat updates
- Tab-based navigation with sticky header

## External Access

- **Local**: http://localhost:8768/
- **Public**: `https://portal.systack.net`
- **Security**: Tailscale VPN required for external access

## Related

- Internal fleet dashboard: port 8765
- Invoice dashboard: port 8766
- SAOS site: `systack-site/saos/index.html`
- Fleet agent pages: `fleet/` directory

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-06-22 | Initial dashboard with Overview, Agents, Tasks, Account tabs |
| v2.0 | 2026-06-24 | Complete rebuild: Chat, Dashboard, Services, Tasks, Docs tabs. Tier-specific content. Real-time chat. Token auth. |
