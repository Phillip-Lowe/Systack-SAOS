# SAOS Production Deployment Checklist

**Version:** 1.0  
**Date:** 2026-07-06  
**Status:** Active  

---

## Pre-Deployment

### Environment Variables
- [ ] `PGHOST` — Production PostgreSQL host (not localhost)
- [ ] `PGPORT` — Production PostgreSQL port (default: 5432)
- [ ] `PGDATABASE` — Production database name (recommend: `systack_memory`)
- [ ] `PGUSER` — Production database user (not `philliplowe`)
- [ ] `SAOS_INTERNAL_API_KEY` — Generate a strong random key (replace `saos-internal-dev-key`)
- [ ] `SYSTACK_ADMIN_PIN` — Set a strong admin PIN for Command Center
- [ ] `SYSTACK_VPS_CONFIG` — JSON array of VPS configurations
- [ ] `PGPASSWORD` — Set for backup script access

### Database
- [ ] Create production PostgreSQL database
- [ ] Run schema creation scripts (all tables)
- [ ] Insert default `saos_roles` (5 roles)
- [ ] Insert default `compliance_policies` (5 policies)
- [ ] Insert `agent_state` records (10 agents)
- [ ] Create first admin client account
- [ ] Set admin client role to `admin`
- [ ] Verify all tables exist: `\dt` should show 25+ tables

### Network
- [ ] Tailscale installed and connected on production server
- [ ] Tailscale ACLs configured to restrict access
- [ ] No public ports open (everything via Tailscale)
- [ ] CORS origins set to production domain only

### Security
- [ ] Replace `saos-internal-dev-key` with strong random key
- [ ] Set production admin PIN (not `1234`)
- [ ] Enable MFA on admin account
- [ ] Verify rate limiting is active (test with rapid login attempts)
- [ ] Verify RBAC is enforced (test customer role → admin endpoint → 403)
- [ ] Verify audit logging is working (login, check audit_log table)

---

## Deployment Steps

### 1. Database Setup
```bash
# Create production database
createdb -h <prod_host> systack_memory

# Run schema (from customer-dashboard directory)
python3 -c "
import psycopg2
conn = psycopg2.connect(host='<prod_host>', dbname='systack_memory', user='<prod_user>')
cur = conn.cursor()
# Run all CREATE TABLE statements from api.py
conn.commit()
"
```

### 2. Start Services
```bash
# Customer Portal
cd /path/to/customer-dashboard
PGHOST=<prod_host> PGPORT=5432 PGDATABASE=systack_memory PGUSER=<prod_user> \
SAOS_INTERNAL_API_KEY=<strong_key> \
python3 api.py --port 8768

# Command Center
cd /path/to/systack-command-center
SYSTACK_ADMIN_PIN=<strong_pin> \
PGHOST=<prod_host> PGPORT=5432 PGDATABASE=systack_memory PGUSER=<prod_user> \
python3 api.py --port 8770
```

### 3. Verify Deployment
```bash
# Run test suite
python3 tests/test_endpoints.py

# Run backup verification
python3 scripts/backup_verify.py

# Check Command Center
curl -H "X-Admin-PIN: <pin>" http://localhost:8770/api/fleet/services-health
```

---

## Post-Deployment

### Day 1
- [ ] All services responding (test_endpoints.py: 65/65 pass)
- [ ] First backup verified (backup_verify.py: all checks pass)
- [ ] Trust center accessible (GET /api/compliance/trust-center returns 200)
- [ ] Audit log entries being created (login, navigate, check audit_log)
- [ ] Rate limiting working (5 failed logins → 429)
- [ ] RBAC working (customer role → admin endpoint → 403)

### Week 1
- [ ] Daily backup cron running (check backup_log table)
- [ ] No unresolved security events
- [ ] No open incidents
- [ ] All compliance policies active
- [ ] Client onboarding tested end-to-end

### Ongoing
- [ ] Quarterly compliance policy review
- [ ] Monthly backup verification drill
- [ ] Weekly audit log review
- [ ] Daily health check (automated via Command Center)

---

## Rollback Plan

If deployment fails:
1. Stop all SAOS services
2. Restore database from latest verified backup: `psql -d systack_memory -f backup.sql`
3. Restart previous version
4. Investigate failure via audit_log and security_events

---

## Service Registry (Production)

| Service | Port | Environment Variables Required |
|---------|------|-------------------------------|
| Customer Portal | 8768 | PGHOST, PGPORT, PGDATABASE, PGUSER, SAOS_INTERNAL_API_KEY |
| Command Center | 8770 | SYSTACK_ADMIN_PIN, PGHOST, PGPORT, PGDATABASE, PGUSER, SYSTACK_VPS_CONFIG |
| Invoice Dashboard | 8766 | PGHOST, PGPORT, PGDATABASE, PGUSER |
| Webhook Bridge | 8767 | PGHOST, PGPORT, PGDATABASE, PGUSER |
| Booking Dashboard | 8772 | PGHOST, PGPORT, PGDATABASE, PGUSER |

---

*Created by SOL on 2026-07-06*