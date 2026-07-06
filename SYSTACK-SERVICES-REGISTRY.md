# Systack Services Registry
**Updated:** 2026-07-01 06:07 CDT
**Maintainer:** SOL

## Active Services

| Service | Port | Process | Status | Auto-Restart |
|---------|------|---------|--------|-------------|
| Invoice Dashboard | 8766 | `invoice_dashboard_api.py` | ✅ Running | ✅ launchd |
| SAOS Webhook Bridge | 8767 | `saos-webhook-bridge.py` | ✅ Running | ✅ launchd |
| SAOS Customer Portal | 8768 | `customer-dashboard/api.py` | ✅ Running | ✅ launchd |
| Systack Command Center | 8770 | `systack-command-center/api.py` | ✅ Running | ✅ launchd |
| Booking Dashboard | 8772 | `systack-booking-dashboard/api.py` | ✅ Running | ✅ launchd |
| Invoice API | 9001 | `systack_invoice_api.py` | ✅ Running | ✅ launchd |
| n8n Automation | 5678 | `n8n` | ✅ Running | ✅ brew services |
| BlueBubbles Bridge | 1234 | `bluebubbles-server` | ✅ Running | ✅ brew services |
| Ollama (Local AI) | 11434 | `ollama serve` | ✅ Running | ✅ brew services |
| PostgreSQL | 5432 | `postgres` | ✅ Running | ✅ brew services |

## Removed Services

| Service | Port | Status | Reason |
|---------|------|--------|--------|
| SOL Orchestrator Dashboard | 8765 | ❌ REMOVED | Replaced by Command Center (8770) |

## LaunchAgent Files

```
~/Library/LaunchAgents/
├── net.systack.invoice-dashboard.plist       ✅
├── net.systack.webhook-bridge.plist          ✅
├── net.systack.customer-dashboard.plist      ✅
├── net.systack.command-center.plist          ✅
├── net.systack.booking-dashboard.plist       ✅
├── net.systack.invoice-pipeline.plist        ✅
├── net.systack.saos-provision-bridge.plist   ⚠️ Loaded but not running (exit 2)
└── net.systack.orchestrator.plist            ⚠️ Loaded but not running (exit 1)
```

## Notes
- All dashboards require PostgreSQL running (port 5432)
- Command Center and Booking require `SYSTACK_ADMIN_PIN` env var
- Fleet dashboard (8765) plist removed — do not recreate
