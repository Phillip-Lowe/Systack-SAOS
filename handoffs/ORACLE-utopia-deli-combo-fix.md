# ORACLE HANDOFF — Utopia Deli Combo Double-Charging Fix

**From:** SOL (failed multiple attempts)
**To:** ORACLE
**Date:** 2026-06-27 14:51 CDT
**Status:** 🔴 CRITICAL — Double-charging customers in production
**Issue:** Square payment page shows $23.00 for combo meal (should be $18.00)

---

## THE PROBLEM (With Screenshot Evidence)

**What customer sees on Square payment page:**
- Chik'n Club Sub: $23.00
- Order total: $23.00

**What customer should see:**
- Chik'n Club Sub (with combo): $18.00
- Order total: $18.00

**Screenshot:** `media://inbound/dev1---d8409c91-4f54-447d-85ad-62f1b7b41f00.png`

---

## ROOT CAUSE ANALYSIS

The problem is NOT in the frontend `index.html` — it's in the **n8n backend workflow** that creates the Square payment link.

### What the frontend sends to n8n webhook:
```json
{
  "items": [{
    "id": "chicken-club",
    "name": "Chik'n Club Sub",
    "qty": 1,
    "base_price_cents": 1350,  // <-- SOL's fix: $13.50 (base without combo)
    "modifiers": [
      {"code": "S_COMBO_FRIES", "label": "Add Fries", "price_cents": 500},  // $5.00
      {"code": "S_JALAP", "label": "Jalapeños", "price_cents": 100},       // $1.00
      {"code": "S_SAUCE_BBQ", "label": "BBQ", "price_cents": 50}          // $0.50
    ]
  }]
}
```

### What the n8n workflow sends to Square:
Looking at the workflow file `Systack/n8n-workflows/deli/Utopia-Deli-Simple-Checkout-v4.json`:

```javascript
// Line item builder:
line_items: $json.body.items.map(item => ({
  name: item.name,
  quantity: String(item.qty),
  base_price_money: {
    amount: Math.round(item.base_price_cents || (item.total_price_cents / item.qty)),
    currency: "USD"
  },
  modifiers: (item.modifiers || []).map(mod => ({
    name: mod.label || mod.mod_name || 'Unknown',
    base_price_money: {
      amount: Math.round((mod.price_delta || 0) * 100),  // <-- BUG: uses price_delta or 0
      currency: "USD"
    }
  }))
}))
```

### The Bug:
1. **Frontend sends:** `base_price_cents: 1350` (base without combo), `modifiers` with `price_cents: 500` (combo price)
2. **n8n workflow reads:** `base_price_money.amount = Math.round(item.base_price_cents || ...)` → $13.50
3. **n8n workflow reads modifiers:** `base_price_money.amount = Math.round((mod.price_delta || 0) * 100)` → $0.00!
   - Because `mod.price_delta` is undefined, it defaults to 0
   - OR if the workflow uses `mod.price_cents`, it might be using that directly

### Actually looking more carefully at the screenshot:
- The Square page shows: Chik'n Club Sub $16.50, Add Fries ($5.00), Jalapeños ($1.00), BBQ ($0.50)
- Total: $23.00

This means the Square page is showing the modifiers with their prices. The base price is $16.50 (not $13.50 or $15.00). 

**Chik'n Club Sub actual price is $15.00** (from menu-data.js: `price: 1500`).

So the calculation is:
- Base: $16.50 (this includes the combo price already!)
- Add Fries: $5.00 (shown as separate modifier)
- Jalapeños: $1.00
- BBQ: $0.50
- Total: $23.00

The issue is: **the base price already includes the combo price, AND the combo is also sent as a modifier with its price.**

### The n8n workflow is sending:
- `base_price_money` = $16.50 (this includes the combo)
- `modifiers` = Add Fries $5.00, Jalapeños $1.00, BBQ $0.50
- Square adds: $16.50 + $5.00 + $1.00 + $0.50 = $23.00

**The combo is being charged twice!**

---

## WHAT NEEDS TO BE FIXED

### Option 1: Fix the n8n workflow (Recommended)
The n8n workflow should subtract combo modifier prices from the base price before sending to Square, OR not send combo modifiers as separate line items with prices.

In the n8n workflow's Square line item builder:
```javascript
line_items: $json.body.items.map(item => {
  // Separate combo modifiers from regular modifiers
  const comboMods = (item.modifiers || []).filter(m => 
    m.group === 'combo' || (m.code && m.code.includes('COMBO'))
  );
  const regularMods = (item.modifiers || []).filter(m => 
    m.group !== 'combo' && !(m.code && m.code.includes('COMBO'))
  );
  
  // Calculate combo price to subtract from base
  const comboPrice = comboMods.reduce((s, m) => s + (m.price_cents || 0), 0);
  
  return {
    name: item.name,
    quantity: String(item.qty),
    base_price_money: {
      amount: Math.round((item.base_price_cents - comboPrice) || (item.total_price_cents / item.qty)),
      currency: "USD"
    },
    modifiers: regularMods.map(mod => ({
      name: mod.label || mod.mod_name || 'Unknown',
      base_price_money: {
        amount: Math.round((mod.price_cents || mod.price_delta || 0) * 100),
        currency: "USD"
      }
    }))
  };
})
```

Wait, this is wrong too. The issue is that the Square API might not support this approach.

### Option 2: Fix the n8n workflow to not send combo modifiers as priced items
Instead of sending combo modifiers as separate line item modifiers, send them as part of the item name or description, or send them as $0 modifiers.

### Option 3: Fix the frontend to send the correct base price
The frontend should send `base_price_cents` as the base price WITHOUT combo, and send combo modifiers with their actual prices. This is what SOL tried to do, but the backend is not using the data correctly.

Actually, looking at the screenshot again: the base price is $16.50, not $15.00 or $13.50. Where is $16.50 coming from?

Chik'n Club Sub price is $15.00. Add Fries combo is $5.00. If the backend is adding both: $15.00 + $5.00 = $20.00. But the screenshot shows $16.50 as base.

Wait, the screenshot shows:
- Chik'n Club Sub: $16.50 (strikethrough) $23.00
- This is the item name + price shown by Square

Actually, looking at the screenshot more carefully:
- The main price shown is $23.00 at the top
- The item breakdown shows: Chik'n Club Sub $16.50 (but this might be the per-item total after some calculation)
- Add Fries ($5.00), Jalapeños ($1.00), BBQ ($0.50)

The total is $23.00 which equals $16.50 + $5.00 + $1.00 + $0.50 = $23.00. But $16.50 doesn't match any known price.

Chik'n Club Sub price is $15.00. Maybe the $16.50 includes something else? Or maybe the backend is calculating something wrong.

ORACLE: Please analyze the n8n workflow and the actual data flow to find where the double-charging occurs. The key is that the Square API is receiving both the combo price in the base price AND the combo price as a modifier.

---

## FILES TO INSPECT

1. **n8n workflow:** `Systack/n8n-workflows/deli/Utopia-Deli-Simple-Checkout-v4.json`
   - Specifically the "Create Square Payment Link" node
   - Look at how it processes `items` and `modifiers`

2. **Frontend:** `utopia-deli-temp/pickup-order/index.html` (already fixed by SOL, but not working)
   - The `handleCheckout` function sends `base_price_cents` and `modifiers`
   - Verify what data is actually being sent

3. **Live test:** Use browser dev tools to see the actual webhook payload
   - Open browser console, place test order, check network tab
   - See what JSON is sent to `https://n8n.systack.net/webhook/utopia-deli-order-v4`

---

## WHAT SOL HAS ALREADY TRIED (And Failed)

1. Changed frontend `addToCart` to exclude combo from price calculation (undercharged customers)
2. Changed frontend checkout payload to subtract combo from base price (didn't fix backend)
3. Updated cart display to show "(included)" (cosmetic only)
4. Pushed to wrong repo initially, then pushed to correct repo `utopia-deli.git`
5. GitHub Pages rebuilt at 14:46:54 CDT with new code

**The issue persists because the fix needed is in the n8n backend, not the frontend.**

---

## URGENCY

**Customers are being double-charged RIGHT NOW.** Every combo order is overcharged by $5.00. This needs immediate attention.

---

## HANDOFF FROM SOL

I failed to understand the complete architecture. I kept trying to fix the frontend code when the real issue is in the n8n backend workflow. I also confused which repo to push to and made multiple incorrect edits.

ORACLE: Please take over and fix the n8n workflow so combo modifiers are not double-charged in Square.

**Screenshot evidence:** `media://inbound/dev1---d8409c91-4f54-447d-85ad-62f1b7b41f00.png`
