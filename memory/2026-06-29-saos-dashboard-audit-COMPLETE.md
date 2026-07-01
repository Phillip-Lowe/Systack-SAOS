# SAOS Dashboard Audit — COMPLETE
**Date:** 2026-06-29 05:51 CDT  
**Auditor:** SOL (autonomous)  
**Status:** ✅ AUDIT COMPLETE — Multiple issues found, all documented

---

## 🔴 CRITICAL BUGS (Fix Immediately)

### BUG #1: PIN Change Doesn't Force Re-Login (User Reported)
**File:** `index.html` — `submitChangePin()` function  
**What:** After PIN change, user continues with old session. New PIN only works after manual logout.

**Root Cause:**
```javascript
// Current code — only shows success message
successEl.textContent = 'PIN updated successfully';
setTimeout(() => document.getElementById('changePinForm').style.display = 'none', 2000);
// ❌ Does NOT clear token
// ❌ Does NOT redirect to login
```

**Fix Required:**
```javascript
// After successful PIN change:
successEl.textContent = 'PIN updated. Please log in again.';
localStorage.removeItem('saos_token');
localStorage.removeItem('saos_client_id');
token = null;
setTimeout(() => {
    document.getElementById('appContainer').classList.remove('active');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('loginError').textContent = 'PIN updated. Please log in with your new PIN.';
}, 1500);
```

**Also:** Backend `change_pin()` should revoke all existing tokens:
```sql
UPDATE client_auth_tokens SET revoked_at = NOW() 
WHERE client_id = ? AND revoked_at IS NULL
```

---

### BUG #2: Logout Doesn't Revoke Server Token
**File:** `index.html` — `logout()` function  
**Security Risk:** Token remains valid on server for 30 days after "logout"

**Current:**
```javascript
function logout() {
    localStorage.removeItem('saos_token');
    token = null;
    location.reload();
}
```

**Fix:**
```javascript
async function logout() {
    // Tell server to revoke
    if (token) {
        await api('POST', '/api/auth/logout');
    }
    localStorage.removeItem('saos_token');
    localStorage.removeItem('saos_client_id');
    token = null;
    client = null;
    location.reload();
}
```

---

## 🟡 MODERATE ISSUES

### ISSUE #3: No Setup Progress Tracking
**What:** Dashboard shows "Setup: X% complete" but it's static/hardcoded  
**Impact:** Clients can't see what's actually configured vs. what's pending

**Fix:** Add `setup_progress` INTEGER column to `saos_clients` and update it when services are actually configured.

---

### ISSUE #4: Agent Heartbeat Shows "Stale" But Doesn't Explain Why
**What:** Agent shows "⚠️ Stale • 1h ago" but no explanation or action  
**Impact:** Client confusion — "is my system broken?"

**Fix:** Add tooltip: "Agent is idle or restarting. Tasks will resume automatically."

---

### ISSUE #5: "Request Setup" Button Creates Task But No Visibility
**What:** Button works, but client can't see task status after clicking  
**Impact:** Client doesn't know if anything happened

**Fix:** After creating task, auto-switch to Tasks tab and highlight the new task.

---

## ✅ VERIFIED WORKING

| Feature | Status | Notes |
|---------|--------|-------|
| Document Downloads | ✅ | All 6 PDFs serve correctly |
| Dashboard HTML | ✅ | Returns 200 with proper content |
| Auth Required | ✅ | 401 without token |
| API Syntax | ✅ | `ast.parse()` passes |
| Database Connection | ✅ | `saos_clients` table confirmed |
| Services Config | ✅ | Dynamic from backend |
| Activity Log | ✅ | Real events, not task duplicates |
| Agent Heartbeat | ✅ | Shows stale/active status |
| Error Fallback | ✅ | Graceful API failure UI |

---

## 📊 DASHBOARD GAPS vs. ACTUAL OFFERINGS

From June 29 review (still accurate):
- ✅ Services aligned with real products
- ✅ Pricing visible in Services tab
- ✅ Stripe checkout links working
- ❌ No "Upgrade" flow (just links to Stripe)
- ❌ No billing management (cancel, change plan)
- ❌ No usage metrics (n8n runs used, agents active hours)

---

## 🔧 RECOMMENDED FIXES (Priority Order)

| Priority | Issue | Effort | File |
|----------|-------|--------|------|
| 🔴 P0 | PIN change → force re-login | 5 min | `index.html` |
| 🔴 P0 | Logout → revoke server token | 5 min | `index.html` + `api.py` |
| 🟡 P1 | Setup progress tracking | 30 min | `api.py` + DB |
| 🟡 P1 | Request Setup → show task | 10 min | `index.html` |
| 🟢 P2 | Agent stale tooltip | 5 min | `index.html` |
| 🟢 P2 | Usage metrics | 1 hour | New endpoint |

---

## SECURITY RECOMMENDATIONS

1. **PIN storage:** Currently plaintext in `auth_pin`. Should be hashed with bcrypt.
2. **Token expiry:** 30 days is long. Consider 7 days + refresh.
3. **Rate limiting:** No rate limit on login attempts. Add 5-attempt lockout.

---

## FILES CHECKED

- ✅ `api.py` (1372 lines) — Syntax OK, logic bugs found
- ✅ `index.html` (2681 lines) — Modified for pricing, bugs found
- ✅ Database — Connected, structure verified
- ✅ PDF files — All present and serving

---

## SESSION NOTES

- Executed autonomously while Green was driving
- Stopped immediately when user returned
- Found PIN bug that user already experienced
- Documented all findings comprehensively
- No loops encountered during audit
- Ready for Green's decision on which fixes to apply
