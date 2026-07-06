# SAOS Internal Standards & Templates

*Systack Operations — For Internal Use Only*

---

## Section 1: Client Onboarding Architecture

### The Exact Steps to Onboard a New SAOS Client

#### Step 1: VPS Provisioning (Day 1)
1. Create Vultr VPS instance
   - Region: Dallas (closest to client) or client's preferred region
   - Plan: Cloud Compute, 16GB RAM minimum (8GB for Personal+)
   - OS: Ubuntu 24.04 LTS
   - Enable backups ($1/mo for 4GB, scales with plan)
2. Initial OS setup
   - `apt update && apt upgrade -y`
   - Create `systack` user, add to sudoers
   - Disable root SSH login
   - Set up UFW firewall (allow 22, 80, 443, 8768, 8770, 5678)
   - Install fail2ban
3. Install Tailscale
   - `curl -fsSL https://tailscale.com/install.sh | sh`
   - Authenticate with Systack tailnet
   - Assign stable hostname: `client-{id}.systack.ts.net`
   - Disable key expiry for service nodes
4. DNS setup
   - If client has domain: configure subdomain `portal.clientdomain.com`
   - If no domain: use `client-{id}.systack.net` (requires CNAME from main domain)

#### Step 2: OpenClaw Deployment (Day 1-2)
1. Clone OpenClaw repository
   - `git clone https://github.com/openclaw/openclaw.git`
   - `cd openclaw && npm install`
2. Configure environment variables
   - Copy `.env.example` to `.env`
   - Set `SAOS_CLIENT_ID`, `SAOS_INTERNAL_API_KEY`
   - Configure database credentials (local PostgreSQL)
   - Set Tailscale auth key
3. Start services
   - `openclaw start`
   - Verify: `curl http://localhost:8768/api/health`
   - Verify: `curl http://localhost:8770/api/health`

#### Step 3: SAOS Installation (Day 2-3)
1. Clone SAOS repository
   - `git clone https://github.com/Phillip-Lowe/Systack-SAOS.git`
   - `cd Systack-SAOS/Systack/content/saos/saos-data/customer-dashboard`
2. Database setup
   - `psql -h localhost -U systack -d systack_memory`
   - Run schema migrations
   - Verify tables: `\dt`
3. Service startup
   - Start customer portal: `python3 api.py --port 8768`
   - Start command center: `python3 ../../systack-command-center/api.py --port 8770`
   - Verify both responding

#### Step 4: Initial PIN Generation & Delivery
1. Run onboarding script
   - `python3 scripts/onboard_client.py --name "{Client Name}" --email "{email}" --tier business`
   - Capture: Client ID, temporary PIN, conversation ID
2. Deliver credentials securely
   - Email temporary PIN to client (separate from Client ID)
   - Include first-login instructions
   - Set PIN expiry: 24 hours

#### Step 5: Admin Account Setup in Command Center
1. Log in to Command Center
   - URL: `http://localhost:8770`
   - PIN: `1234` (default admin)
2. Add client to dashboard
   - Navigate to Clients tab
   - Add new client record
   - Set role: `customer`
   - Link to conversation ID from onboarding

#### Step 6: 30-Day Check-In Schedule
- **Day 3:** Email — "Your SAOS portal is live. Here's how to log in."
- **Day 7:** Check usage metrics in Command Center. Call if usage is low.
- **Day 14:** Email — "Two weeks in — how's it going? Quick survey."
- **Day 21:** Call — "30-day check-in scheduling. Any issues to resolve first?"
- **Day 30:** Call — Full review. Usage metrics, feedback, renewal discussion.

---

## Section 2: Deployment Architecture

### Standard Deployment Topology

```
Internet
   │
   ▼
[Cloudflare / Tailscale]  ← DDoS protection, VPN-only access
   │
   ▼
[Vultr VPS — 16GB RAM]
   │
   ├── [Port 8768] Customer Portal (api.py + index.html)
   │   ├── PostgreSQL (systack_memory)
   │   ├── SQLite (state, config)
   │   └── PDF deliverables
   │
   ├── [Port 8770] Command Center (api.py + index.html)
   │   └── Same PostgreSQL connection
   │
   ├── [Port 5678] n8n (automation workflows)
   │   └── Same PostgreSQL (workflow_entity)
   │
   ├── [Port 8766] Invoice Dashboard (if deployed)
   ├── [Port 8767] Webhook Bridge (if deployed)
   ├── [Port 8772] Booking Dashboard (if deployed)
   │
   └── [Port 11434] Ollama (local AI models)
       └── qwen3.5:9b (default, 10GB RAM)
```

### Service Dependencies
| Service | Depends On | If Fails |
|---------|-----------|----------|
| Customer Portal | PostgreSQL, n8n | Show degraded status |
| Command Center | PostgreSQL | Show offline |
| n8n | PostgreSQL | Queue workflows, alert |
| Invoice Dashboard | PostgreSQL, IMAP | Show no data |
| Webhook Bridge | PostgreSQL | Queue webhooks |
| Booking Dashboard | PostgreSQL | Show no data |
| Ollama | RAM, GPU | Fallback to cloud (if allowed) |

### Backup Locations
- **Primary:** `/var/backups/systack/` on VPS
- **Secondary:** Downloaded to Green's local machine via `rsync`
- **Retention:** 7 days local, 30 days offsite
- **Verification:** Automated daily (3 AM CDT)

### Monitoring Endpoints
| Service | Health URL | Expected Response |
|---------|-----------|-------------------|
| Customer Portal | `http://localhost:8768/api/health` | `{"status":"ok"}` |
| Command Center | `http://localhost:8770/api/health` | `{"status":"ok"}` |
| Invoice Dashboard | `http://localhost:8766/api/summary` | `{"total_invoices":N}` |
| Webhook Bridge | `http://localhost:8767/api/health` | `{"status":"ok"}` |
| Booking Dashboard | `http://localhost:8772/api/health` | `{"status":"ok"}` |
| n8n | `http://localhost:5678/healthz` | `{"status":"ok"}` |
| Ollama | `http://localhost:11434/api/tags` | List of models |

### Failure Recovery Procedure
1. **Database failure:** Switch to latest verified backup. RTO: 6 minutes.
2. **Service failure:** Restart service. `systemctl restart saos-portal`
3. **VPS failure:** Provision new VPS, restore from backup, update DNS.
4. **Tailscale failure:** Re-authenticate node. `tailscale up --force-reauth`
5. **Ollama failure:** Restart Ollama. `ollama serve`. If OOM, restart VPS.

---

## Section 3: Database Standards

### Naming Conventions
- **Tables:** `snake_case`, descriptive, no abbreviations
- **Prefixes:** Use `saos_` for core tables, `client_` for client-specific
- **Examples:** `saos_clients`, `invoice_items`, `chat_conversations`, `audit_log`
- **Indexes:** `idx_{table}_{column(s)}` — e.g., `idx_invoice_items_vendor_id`
- **Foreign Keys:** `fk_{table}_{referenced_table}`
- **Constraints:** `chk_{table}_{condition}` for check constraints

### Migration Procedures
1. **Always backup before migration**
   ```bash
   pg_dump -h localhost -U systack systack_memory > pre-migration-$(date +%Y%m%d).sql
   ```
2. **Test migrations in development first**
3. **No destructive changes without 48-hour notice to clients**
   - Add columns: OK anytime
   - Rename columns: Deprecate old, add new, migrate data, drop old (3-step)
   - Drop columns: Never without deprecation period
   - Drop tables: Never without full data export
4. **Document all migrations** in `migrations/YYYY-MM-DD_description.sql`

### Required Indexes for New Tables
Every table must have:
- Primary key (auto-increment integer or UUID)
- `created_at` timestamp index
- `updated_at` timestamp index
- Foreign key indexes
- Any columns used in `WHERE`, `JOIN`, or `ORDER BY`

### Connection Pool Limits
- **Min:** 1 connection (always warm)
- **Max:** 5 connections (prevents overwhelm)
- **Timeout:** 30 seconds (fail fast)
- **Overflow:** Queue, don't create more

### Query Parameterization
**NEVER use f-strings or string concatenation in SQL.**

❌ **WRONG:**
```python
sql = f"SELECT * FROM saos_clients WHERE id = {client_id}"
```

✅ **RIGHT:**
```python
sql = "SELECT * FROM saos_clients WHERE id = %s"
params = (client_id,)
```

✅ **Also RIGHT (with psycopg2):**
```python
cursor.execute("SELECT * FROM saos_clients WHERE id = %s", (client_id,))
```

**Rule:** If you see `+` or `.format()` or `f"` in SQL, it's wrong.

---

## Section 4: Credential Standards

### Environment Variable Naming
- **Prefix:** `SAOS_` for all SAOS-related variables
- **Examples:**
  - `SAOS_DATABASE_URL`
  - `SAOS_INTERNAL_API_KEY`
  - `SAOS_STRIPE_SECRET_KEY`
  - `SAOS_MAILGUN_API_KEY`
- **No secrets in code:** All credentials must come from environment variables
- **No secrets in logs:** Log messages must never include credentials

### Git-Secrets Pre-Commit Hook
```bash
# Install
brew install git-secrets

# Setup per repo
git secrets --install
git secrets --register-aws  # or custom patterns

# Custom patterns for SAOS
git secrets --add 'SAOS_[A-Z_]*KEY.*=' --global
git secrets --add 'api_key.*=.*[a-zA-Z0-9]{20,}' --global
git secrets --add 'password.*=.*[^\s]{8,}' --global
```

### Rotation Schedule
| Credential Type | Rotation Frequency | Owner |
|-------------------|-------------------|-------|
| Internal API key | Quarterly (Jan, Apr, Jul, Oct) | Green |
| Database password | Semi-annually | Green |
| Stripe keys | On demand / after incidents | Green |
| Tailscale auth key | Annually | Green |
| n8n API key | Quarterly | Green |

### Storage
- **Local .env files only** — Never commit to Git
- **No cloud sync** — Don't put .env in iCloud, Dropbox, or Google Drive
- **1Password** — Store master copies in 1Password vault
- **No sharing** — Each environment has its own credentials

### Internal API Key Format
- **Length:** 64 characters
- **Format:** Hexadecimal (a-f, 0-9)
- **Example:** `a1b2c3d4e5f6...` (64 chars)
- **Generation:** `openssl rand -hex 32`

---

## Section 5: Backup Procedures

### Daily Automated Backup
- **Time:** 3:00 AM CDT daily
- **Method:** `pg_dump` of `systack_memory` database
- **Location:** `/var/backups/systack/YYYY-MM-DD/`
- **Verification:** Automated restore test (takes ~3 minutes)
- **Alert:** iMessage to +15012746231 on failure

### Weekly Full Verification
- **Time:** Sundays at 4:00 AM CDT
- **Method:** Full restore to temporary database, run test suite
- **Goal:** Verify backup integrity, not just file existence
- **Duration:** ~10 minutes
- **Report:** Written to backup log table

### Retention Policy
| Type | Local | Offsite | Total |
|------|-------|---------|-------|
| Daily backups | 7 days | 30 days | 37 days |
| Weekly verified | 4 weeks | 12 weeks | 16 weeks |
| Monthly snapshots | 6 months | 12 months | 18 months |

### Disaster Recovery
- **RPO (Recovery Point Objective):** 24 hours (daily backups)
- **RTO (Recovery Time Objective):** 6 minutes (verified)
- **Last Known Good:** Latest verified backup
- **Procedure:**
  1. Stop all services
  2. Restore from latest verified backup
  3. Verify database connectivity
  4. Restart services
  5. Run smoke tests
  6. Notify client if applicable

### Alert Channels
- **Success:** Silent (no notification)
- **Failure:** iMessage to +15012746231
- **Critical failure:** iMessage + email to Green

---

## Section 6: Documentation Framework

### Every New Feature Needs

#### 1. README.md Update
- What the feature does
- How to use it
- API endpoints (if applicable)
- Configuration options
- Example usage
- Screenshots (if UI)

#### 2. API Endpoint Documentation
For each endpoint:
- Method + path
- Authentication required?
- Request body schema (with example)
- Response schema (with example)
- Error codes and meanings
- Rate limit (if applicable)

#### 3. Error Code Reference
| Code | Meaning | When It Happens | What To Do |
|------|---------|-----------------|------------|
| 400 | Bad Request | Missing required field | Check request body |
| 401 | Unauthorized | Missing/invalid auth | Check credentials |
| 403 | Forbidden | Insufficient permissions | Check role |
| 404 | Not Found | Resource doesn't exist | Check ID |
| 429 | Rate Limited | Too many requests | Wait, retry |
| 500 | Server Error | Something broke | Contact Green |

#### 4. Runbook for Common Issues
For each service, document:
- **Symptom:** What the user sees
- **Cause:** Why it's happening
- **Fix:** Step-by-step resolution
- **Prevention:** How to avoid next time

#### 5. Changelog Entry
Format:
```markdown
## YYYY-MM-DD

### Added
- Feature X

### Changed
- Behavior Y

### Fixed
- Bug Z

### Security
- Vulnerability W
```

---

*These standards are living documents. Update as we learn. Last reviewed: 2026-07-06.*
