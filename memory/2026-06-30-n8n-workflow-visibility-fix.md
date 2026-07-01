# 2026-06-30 06:46-06:58 CDT — n8n Workflows Not Visible in UI (FIXED)

## Problem
User reported n8n workflows not visible in UI. They were still in the database but appeared as empty canvases.

## Root Cause
`activeVersionId` was NULL in `workflow_entity` table for **38 of 60 workflows**. n8n UI uses `activeVersionId` to determine which version to display. When NULL, the UI shows an empty canvas even though node data exists in the `nodes` column.

This is the same bug documented in:
- `memory/2026-06-05-v2-empty-fix.md`
- `memory/2026-06-05-v2-empty-attempt2.md`
- `memory/n8n-architecture-actual.md`

## Fix Applied
1. **Backed up database:** `~/.n8n/database.sqlite.bak.20250630_065500`
2. **Stopped n8n:** `pkill -f "n8n start"`
3. **SQL fix:** `UPDATE workflow_entity SET activeVersionId = versionId WHERE activeVersionId IS NULL OR activeVersionId = '';`
4. **Restarted n8n:** `nohup ~/.n8n/start-n8n.sh`
5. **Verified:** All 60/60 workflows now have `activeVersionId = versionId` and `LENGTH(nodes) > 0`

## Verification
```
SELECT COUNT(*) FROM workflow_entity WHERE activeVersionId IS NULL OR activeVersionId = '';
→ 0 (was 38)

SELECT COUNT(*) as total, SUM(CASE WHEN activeVersionId IS NOT NULL AND activeVersionId != '' THEN 1 ELSE 0 END) as has_active_ver FROM workflow_entity;
→ 60|60
```

## Affected Workflows (38 total)
- SAOS Chat Bridge, Customer Support Drafting, Document Classification Engine, Scheduled Report Generator
- Add Another Item (x2), Cart Renderer + Router (x2), Constraint Evaluator Master
- Contact + Item + Cart (x2), Custom Constraint Validation
- Deli Online Order Disable Square Payment Link, Green Systems Lead Scraper, Outreach Sequencer
- Invoice Validation, MOD 1 Streetwear Daily, Order Received
- SOL-Test-Webhook-sqlite3, SOL-Test-sqlite3-Fixed, Schedule Conflict Detection
- Sol Blog Post (Simple/Webhook), Sol Test Workflow, Sol Webhook Test
- Square Refund/Void, Systack Lead Scraper, Client Onboarding (x2)
- Test-Webhook-Data-Structure, Utopia Deli variants (7 workflows)

## Key Lesson
n8n `activeVersionId = NULL` is a recurring issue. Any workflow that gets imported (via API or DB) without going through the UI Save flow can end up with NULL `activeVersionId`. The fix is always: `SET activeVersionId = versionId WHERE activeVersionId IS NULL`.

## Prevention
After importing workflows via API or DB, always run:
```sql
UPDATE workflow_entity SET activeVersionId = versionId WHERE activeVersionId IS NULL OR activeVersionId = '';
```