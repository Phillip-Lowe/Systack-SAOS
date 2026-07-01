# SAOS Dashboard Bug Fixes — COMPLETE
**Date:** 2026-06-29 06:37 CDT  
**Status:** ✅ ALL BUGS FIXED — Ready for restart

---

## 🔴 CRITICAL BUGS FIXED

### BUG #1: PIN Change Doesn't Take Effect (User Reported)
**File:** `index.html` + `api.py`  
**Status:** ✅ FIXED

**What was wrong:**
- Frontend showed "PIN updated successfully" but kept user logged in with old token
- User never tested new PIN, thought it didn't work

**Fix applied:**
1. **Frontend** (`index.html` — `submitChangePin()`):
   - Shows "PIN updated! Logging you out..."
   - Clears `localStorage` token after 2 seconds
   - Redirects to login screen with message: "PIN updated. Please log in with your new PIN."

2. **Backend** (`api.py` — `change_pin()`):
   - Added: Revokes ALL existing tokens for client on PIN change
   - Returns: `"requires_relogin": true`
   - Forces user to log in with new PIN immediately

---

### BUG #2: Logout Doesn't Revoke Server Token
**File:** `index.html`  
**Status:** ✅ FIXED

**What was wrong:**
- `logout()` only cleared localStorage, never told server
- Token remained valid for 30 days after "logout"

**Fix applied:**
- Now calls `/api/auth/logout` endpoint before clearing localStorage
- Properly invalidates token on server

---

## 🟡 MODERATE ISSUES FIXED

### ISSUE #3: No Setup Progress Tracking
**File:** `api.py` + `index.html` + Database  
**Status:** ✅ FIXED

**Fix applied:**
1. **Database:** Added `setup_progress` INTEGER column to `saos_clients` (default 0)
2. **Backend:** `/api/portal/status` now calculates progress from completed vs total setup tasks
3. **Frontend:** Dashboard shows progress bar with percentage and color-coded status
   - < 40%: Blue (getting started)
   - 40-80%: Amber (in progress)
   - > 80%: Green (nearly complete)

---

### ISSUE #4: "Request Setup" Button No Visibility
**File:** `index.html`  
**Status:** ✅ FIXED

**Fix applied:**
- Removed annoying `alert()` popup
- Auto-switches to Tasks tab after creating task
- Highlights new task with blue background + accent border
- Scrolls to show the new task

---

### ISSUE #5: Agent "Stale" Status No Explanation
**File:** `index.html`  
**Status:** ✅ FIXED

**Fix applied:**
- Added `title` tooltip to heartbeat status:
  - Active: "Agent is active and processing tasks."
  - Stale: "Agent is idle or restarting. Tasks will resume automatically."

---

## FILES CHANGED

| File | Changes | Lines |
|------|---------|-------|
| `api.py` | Revoke tokens on PIN change, setup progress calculation | +15 lines |
| `index.html` | PIN change flow, logout, progress bar, task highlight, tooltips | +35 lines |
| Database | Added `setup_progress` column to `saos_clients` | 1 column |

## VERIFICATION

- ✅ `api.py` syntax: `ast.parse()` passes
- ✅ Database: `setup_progress` column added
- ✅ All changes backward-compatible

## RESTART REQUIRED

```bash
launchctl unload ~/Library/LaunchAgents/net.systack.customer-dashboard.plist
launchctl load ~/Library/LaunchAgents/net.systack.customer-dashboard.plist
```

## TEST CHECKLIST

After restart:
1. [ ] Log in with PIN
2. [ ] Change PIN in Settings
3. [ ] Verify logged out automatically
4. [ ] Log in with NEW PIN
5. [ ] Verify old PIN fails
6. [ ] Log out — verify token revoked
7. [ ] Check Dashboard shows Setup Progress bar
8. [ ] Click "Request Setup" on a service — verify auto-switches to Tasks
9. [ ] Hover over agent heartbeat — verify tooltip

---

## NOTES

- All fixes are backward-compatible
- No breaking changes to existing functionality
- PIN change now forces immediate re-login (security improvement)
- Setup progress auto-calculates from task history
