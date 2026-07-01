# ORACLE HANDOFF — Utopia Deli Frontend Fix

**Date:** 2026-06-27 18:36 CDT
**Status:** Backend fixed by Green. Frontend broken by SOL.
**File:** `utopia-deli-temp/pickup-order/index.html`
**Deployed to:** `https://github.com/Phillip-Lowe/utopia-deli.git` → `order.theutopiadeli.com`

---

## What Green Wants

1. **Modifier selection works** — all selected modifiers show in cart and are priced correctly
2. **3-column layout** — Contact info | Menu | Cart (as implemented, just needs to work)
3. **Checkout button in cart** — under totals, says "Checkout"
4. **Special instructions** — in cart panel, before totals
5. **Backend payload** — sends raw `base_price_cents` + modifiers untouched (already done)

---

## What SOL Broke

### Issue 1: Modifier Group Property Missing
**Problem:** When modifiers are selected via `toggleMod()`, they don't have a `group` property. This breaks cart display filtering (combo vs other mods).

**Current broken code (line ~1133):**
```javascript
groupList.push(opt);  // Missing group property
```

**Fix needed:**
```javascript
groupList.push({ ...opt, group });  // Add group property like old system
```

### Issue 2: Cart Display Logic
**Problem:** Cart HTML filters modifiers into `comboMods` and `otherMods` using `m.group`. Without group property, all modifiers show as "otherMods" or get lost.

**Current code (lines ~1335-1340):**
```javascript
const comboMods = item.modifiers.filter(m => m.group === 'combo' || (m.code && m.code.includes('COMBO')));
const otherMods = item.modifiers.filter(m => m.group !== 'combo' && !(m.code && m.code.includes('COMBO')));
```

### Issue 3: Duplicate Menu Sections
**Problem:** During layout restructure, a duplicate menu section was created. SOL tried to remove it but may have left fragments.

### Issue 4: Debug Logging
**Problem:** SOL added debug console.log statements that should be removed before production.

---

## Reference — Old Working System

**File:** `utopia-deli-temp/pickup-order/order-form.js` (NOT deployed, just reference)

The old system DID add group property:
```javascript
// From order-form.js addToCart():
const mods = [];
activeModBtns.forEach(btn => {
  const group = btn.dataset.group;
  const code = btn.dataset.code;
  if (item.modifiers && item.modifiers[group]) {
    const opt = item.modifiers[group].find(o => o.code === code);
    if (opt) mods.push({...opt, group});  // <-- THIS IS THE KEY
  }
});
```

---

## What Works Now

1. ✅ Backend n8n workflow — fixed by Green, calculates totals correctly
2. ✅ Frontend sends raw `base_price_cents` + untouched modifiers
3. ✅ 3-column layout structure exists (contact | menu | cart)
4. ✅ Checkout button in cart panel
5. ✅ Special instructions in cart

---

## What Needs Fixing

1. **Modifier group property** — add `{ ...opt, group }` in `toggleMod()`
2. **Remove debug logging** — clean up console.log statements
3. **Verify no duplicate HTML** — make sure menu section appears once
4. **Test all modifier types** — sauce, combo, addons, hold, etc.

---

## Menu Data Reference

**File:** `utopia-deli-temp/pickup-order/menu-data.js`

Modifier groups:
- `sauce` — up to 6 selections (ADD type)
- `combo` — up to 1 selection (ADD type) — fries/salad $5 each
- `addons` — up to 1 selection (ADD type) — jalapeños $1
- `hold` — up to 4 selections (HOLD type) — free
- `noranch` — up to 1 selection (SPECIAL type) — free
- `protein` — up to 1 selection (REQUIRED type) — free
- `extras` — up to 3 selections (ADD type)

---

## Architecture Rule (From ORACLE)

> "If backend calculates it, Square must NOT recalculate it"

| Layer | Responsibility |
|-------|---------------|
| Frontend | UI + selection + sends RAW data |
| Backend (n8n) | ALL calculations (single authority) |
| Square | Pass-through billing (final numbers only) |

---

## Contact Info

- **Green (Phillip Lowe)** — Owner
- **SOL (current agent)** — Failed to implement correctly
- **File path:** `/Users/philliplowe/.openclaw/workspaces/sol/utopia-deli-temp/pickup-order/index.html`
- **GitHub:** `https://github.com/Phillip-Lowe/utopia-deli.git`
- **Live site:** `https://order.theutopiadeli.com`

---

## Current Git Status

Latest commit: `a35e9db` — "fix: add group property to modifiers so they show in cart"

---

**Request:** Please fix the frontend modifier handling to match the old working system. The 3-column layout and checkout flow are correct — just need modifier selection/display to work properly.

