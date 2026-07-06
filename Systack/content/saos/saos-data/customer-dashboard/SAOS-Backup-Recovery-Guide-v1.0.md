# SAOS Backup & Recovery Guide

**Version:** 1.0  
**Date:** 2026-07-05  
**Status:** Active  

---

## Overview

SAOS uses pg_dump-based backups with automated restore verification to ensure data recoverability.

## Backup Strategy

| Aspect | Configuration |
|--------|--------------|
| Backup type | pg_dump (full logical export) |
| Format | SQL (plain text) |
| Frequency | Daily (manual or script) |
| Location | `~/saos-backups/` |
| Retention | 30 days rolling |
| Compression | None (plain SQL) |
| Encryption | Filesystem-level (AES-256) |

## Recovery Objectives

| Metric | Target | Verified |
|--------|--------|----------|
| RPO (Recovery Point Objective) | 24 hours | ✅ 24h (daily backup) |
| RTO (Recovery Time Objective) | 10 minutes | ✅ ~3 minutes (tested) |

## Verification Process

The `scripts/backup_verify.py` script performs:

1. **pg_dump** — Full database export
2. **SHA-256 checksum** — Integrity hash
3. **Test restore** — Create temporary database, restore backup
4. **Verification queries** — Check tables, record counts, data integrity
5. **Cleanup** — Drop test database
6. **Logging** — Results logged to `backup_log` table

### Running a Backup Verification

```bash
# Full backup + verify
python3 scripts/backup_verify.py --full

# Verify existing backup only
python3 scripts/backup_verify.py --verify-only /path/to/backup.sql
```

### Verification Checks

| Check | Description |
|-------|-------------|
| Table existence | All 10+ expected tables present |
| Client records | Client count matches |
| Audit log entries | Audit records present |
| Compliance policies | Active policies exist |
| RBAC roles | Role definitions present |

## Backup Log Table

All backup operations are logged to the `backup_log` PostgreSQL table:

| Field | Description |
|-------|-------------|
| backup_type | pg_dump, file_archive, config_backup |
| target | What was backed up |
| status | success, failed, verified |
| file_path | Backup file location |
| file_size_bytes | Backup file size |
| checksum_sha256 | Integrity hash |
| started_at / completed_at | Timing |
| verified_at | When restore test ran |
| verification_result | Check results |
| rpo_minutes / rto_minutes | Recovery metrics |
| notes | Additional info |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/backup-log` | admin, ops | View backup history |
| POST | `/api/admin/backup/run` | admin, ops | Trigger backup |
| GET | `/api/admin/backup/rpo-rto` | admin, ops | RPO/RTO metrics |

## Disaster Recovery

### Scenario: Database Corruption
1. Stop SAOS API service
2. Drop corrupted database
3. Restore from latest verified backup: `psql -d systack_memory -f backup.sql`
4. Restart SAOS API
5. Verify data integrity via dashboard
6. Estimated RTO: 5-10 minutes

### Scenario: Hardware Failure
1. Provision new server (or use backup hardware)
2. Install PostgreSQL, Python, dependencies
3. Restore backup from `~/saos-backups/`
4. Update Tailscale to point to new server
5. Restart SAOS API
6. Estimated RTO: 30-60 minutes (depends on provisioning)

### Scenario: Data Deletion (Accidental)
1. Identify deletion time from audit_log
2. Find backup from before deletion
3. Restore backup to test database
4. Extract deleted records
5. Insert recovered records into production
6. Estimated RTO: 15-30 minutes

---

*Last updated: 2026-07-05 by SOL.*