# SAOS Dashboard Audit — IN PROGRESS
**Date:** 2026-06-29 05:51 CDT  
**Status:** 🔄 AUDITING — Multiple issues found

---

## 🔴 CRITICAL BUG #1: PIN Change Doesn't Take Effect Until Re-Login

**What you reported:** Changed PIN, but old PIN still works on next login

**Root Cause Found:**
1. `change_pin()` in `api.py` updates `auth_pin` in database ✅
2. BUT it does NOT invalidate existing auth tokens
3. The user's current token remains valid (30-day expiry)
4. When user logs out and tries new PIN — it works (database has new PIN)
5. When user tries old PIN — it ALSO works... wait, no. Let me verify...

**Actually:** The login endpoint checks `auth_pin` directly. So:
- Old PIN should NOT work after change
- New PIN SHOULD work after change
- BUT the user stays logged in with old token, so they never experience the new PIN

**The REAL Bug:** After PIN change, the frontend:
- Shows success message
- Does NOT clear `localStorage` token
- Does NOT redirect to login
- User continues with old session, never testing new PIN
- On next visit (after token expiry), new PIN works — but user thinks it doesn't

**Fix Required:**
```javascript
// After successful PIN change:
localStorage.removeItem('token');
localStorage.removeItem('client');
alert('PIN updated. Please log in again with your new PIN.');
window.location.reload();
```

---

## 🟡 ISSUE #2: No Token Invalidation on PIN Change

**Security concern:** If PIN is compromised and changed, old tokens still work for 30 days.

**Fix:** Add to `change_pin()`:
```sql
UPDATE client_auth_tokens SET revoked_at = NOW() 
WHERE client_id = ? AND revoked_at IS NULL
```

---

## ✅ VERIFIED WORKING

1. **Document Downloads** — `/download/quickstart-v5` returns `200` with PDF content-type
2. **Dashboard HTML** — Returns `200` with proper HTML
3. **Auth Required** — `/api/portal/status` returns `401` without token
4. **API Syntax** — `api.py` passes `ast.parse()`
5. **Database** — `saos_clients` table exists with proper structure

---

## 🔄 STILL TO VERIFY

1. Services tab pricing display (need login)
2. "Request Setup" button creates task
3. Activity tab shows real events
4. Live Ops shows agent status
5. Chat system works end-to-end
6. Deliverables upload/download
7. n8n email dispatcher (already fixed by Green)

---

## FILES CHECKED

| File | Status | Notes |
|------|--------|-------|
| `api.py` | ✅ Syntax OK | PIN change bug found |
| `index.html` | ✅ Modified | Pricing display added |
| Database | ✅ Connected | `saos_clients` table confirmed |
| `/download/*` | ✅ Working | Returns PDFs |

## NEXT STEPS

Continue audit — test Services tab, Tasks tab, Activity tab, Live Ops
