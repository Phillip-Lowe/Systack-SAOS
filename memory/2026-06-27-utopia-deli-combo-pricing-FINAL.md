# Session Log: 2026-06-27 — Utopia Deli Combo Pricing Fix COMPLETE

**Time:** 2026-06-27 ~17:29 CDT
**Status:** ✅ COMPLETE — Frontend + Backend fixed, deployed, tested
**Files Modified:** `utopia-deli-temp/pickup-order/index.html`, `Utopia-Deli-Simple-Checkout-v4.json`

---

## Problem Statement

Utopia Deli order page was double-charging combo modifiers (Add Fries $5.00, Add Side Salad $5.00) in Square payments. Customer saw $23.00 instead of $18.00 for combo items.

Root cause: **Split pricing responsibility** — frontend was subtracting combo prices from base price while backend (n8n) was adding them back.

---

## Solution Applied (ORACLE Architecture)

### Frontend Fix (SOL)
**File:** `utopia-deli-temp/pickup-order/index.html`
**Commits:**
- `fa45e9d` — Frontend sends raw base_price_cents + untouched modifiers
- `cf5c6be` — Confirmation page updates (message, pickup time, footer fix)
- `b9428f9` — Keep customer name on confirmation page

**Changes:**
1. **Payload** — Sends RAW `base_price_cents` (item.price only) + modifiers untouched
2. **No combo math** — Frontend never calculates totals for backend
3. **Confirmation page** — "We've received your order." + "25 - 30 mins" pickup time
4. **Footer fix** — Inserted before confirmation instead of after

### Backend Fix (GREEN directly in n8n)
**File:** n8n workflow "Utopia-Deli-Simple-Checkout-v4"
**Node:** "Compute Totals"

**Changes:**
1. **Single pricing authority** — Backend calculates ALL totals
2. **Modifiers included** — `(item.modifiers || []).reduce((sum, m) => sum + (m.price_cents || 0), 0)`
3. **Square payload** — Final price only, modifiers display-only with `$0` amount
4. **Idempotency key** — Uses `$json.cart_id` instead of `$execution.id`

---

## Architecture Rule (BINDING)

> **"If backend calculates it, Square must NOT recalculate it"**

| Layer | Responsibility |
|-------|---------------|
| Frontend | UI + selection + raw data |
| Backend (n8n) | ALL calculations (single authority) |
| Square | Pass-through billing (final numbers only) |

---

## Test Case

**Order:**
- Base: $10 sandwich
- Modifier: +$1.50
- Qty: 2

**Expected:**
```
(10 + 1.50) × 2 = 23.00 + tax
```

**Before fix:** $26.00 (double charge) ❌
**After fix:** $23.00 (correct) ✅

---

## Files

- `memory/2026-06-27-utopia-deli-combo-pricing-FINAL.md` — This file
- `utopia-deli-temp/pickup-order/index.html` — Deployed frontend
- `Systack/n8n-workflows/deli/Utopia-Deli-Simple-Checkout-v4.json` — Backend workflow JSON

---

## Related Sessions

- `memory/2026-06-27-utopia-deli-combo-pricing-CORRECTED.md` — Previous attempt
- `memory/2026-06-27-utopia-deli-combo-pricing-update.md` — Initial fix attempt
- `memory/2026-06-26.md` — Session failure that led to RULE 9
- `memory/2026-06-05-n8n-sqlite-truth.md` — n8n SQLite known issues

---

## Key Lesson

The #1 production-killing bug in custom ordering systems: **"shared pricing responsibility"**

Fix: Centralize ALL pricing in backend. Frontend = display only. Square = pass-through.

---

*Session complete. System aligned. No double-charging.*
