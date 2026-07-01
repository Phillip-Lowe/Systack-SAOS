# SAOS Fixes Applied — 2026-06-30

## Issues Fixed Today

### 1. ✅ n8n Database Restored to SQLite
- **Problem:** Accidentally switched n8n to PostgreSQL (empty database)
- **Fix:** Restored `~/.n8n/start-n8n.sh` to original SQLite config
- **Status:** n8n running on SQLite with all workflows

### 2. ✅ Duplicate Invoice Workflow Disabled
- **Problem:** Two invoice workflows active, causing socket errors
- **Fix:** Disabled duplicate `vDUXHG8oCM5QvT0u` in n8n database
- **Status:** Only one invoice workflow active

### 3. ✅ SAOS Email Notification Dispatcher Fixed
- **Problem:** Missing "Fetch Pending Notifications" node, wrong port (8765)
- **Fix:** Re-imported complete workflow JSON with correct port (8768)
- **Status:** Working with all nodes

### 4. ✅ SAOS Chat Bridge Imported
- **Problem:** `n8n-chat-bridge.json` existed but not in n8n database
- **Fix:** Imported to n8n as new active workflow
- **Status:** Active and working

### 5. ✅ 3 Missing Service Workflows Created
- **Problem:** Customer Support Drafting, Document Classification, Scheduled Reports had no automation
- **Fix:** Created n8n workflows for all 3 services
- **Files:**
  - `n8n-customer-support-drafting.json`
  - `n8n-document-classification.json`
  - `n8n-scheduled-report-generator.json`
- **Status:** All imported and active in n8n

### 6. ✅ Database Tables Created
- **Problem:** No usage tracking or service setup progress
- **Fix:** Created `usage_metrics` and `service_setup` tables in PostgreSQL
- **Status:** Tables ready, API endpoints added

### 7. ✅ API Endpoints Added
- **Problem:** No way to track usage or setup progress
- **Fix:** Added to `api.py`:
  - `GET /api/portal/usage`
  - `GET /api/portal/setup-progress`
  - `POST /api/portal/setup-progress`
- **Status:** Working and tested

### 8. ✅ Search Function Fixed
- **Problem:** Two search bars (desktop + mobile), neither worked properly
- **Fix:** Consolidated to ONE search bar that works on both desktop and mobile
- **Changes:**
  - Removed mobile-specific search bar from HTML
  - Removed mobile search JavaScript functions
  - Updated CSS to show search bar on mobile
  - Search now works across all screen sizes
- **Status:** Working

### 9. ✅ Centralized Pricing Config
- **Problem:** Pricing scattered across multiple files
- **Fix:** Created `pricing-config.json` with all tiers, features, and billing actions
- **Status:** Ready for implementation

## Current Status Summary

| Component | Status |
|-----------|--------|
| Dashboard API | ✅ Running (port 8768) |
| n8n Workflows | ✅ 10 active SAOS workflows |
| Database | ✅ 26 tables (24 + 2 new) |
| Search | ✅ Fixed, one bar works everywhere |
| Authentication | ✅ Working |

## Files Changed
- `~/.n8n/start-n8n.sh`
- `~/.n8n/database.sqlite`
- `api.py` (customer-dashboard)
- `index.html` (customer-dashboard)
- `pricing-config.json` (new)
- `n8n-customer-support-drafting.json` (new)
- `n8n-document-classification.json` (new)
- `n8n-scheduled-report-generator.json` (new)

## Remaining Gaps
1. ⚠️ Tailscale auth key is "PLACEHOLDER" (intentional - Green has real key in credentials)
2. ⚠️ Orchestrator daemon disabled (intentional - was wasting compute)
3. ⏸️ Onboarding tour not built
4. ⏸️ Usage metrics not being populated (API ready, needs integration)
5. ⏸️ Setup progress shows 0% (API ready, needs frontend integration)

## Testing Notes
- Search endpoint tested: Returns 8 results for "invoice" query
- API health: OK
- n8n health: OK
- All workflows active and configured
