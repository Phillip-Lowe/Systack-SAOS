# SAOS iOS Safari `.ts.net` Certificate Trust — Resolution Plan
**Date:** 2026-06-30
**Status:** ⏳ IN PROGRESS — Plan created, awaiting implementation

---

## Problem

iOS Safari blocks access to `*.ts.net` Tailscale URLs with certificate error:
- **Error:** "This Connection Is Not Private" / "Certificate Invalid"
- **Root cause:** Tailscale's `.ts.net` certificates are trusted on macOS but NOT automatically trusted on iOS
- **Impact:** Customers cannot access SAOS dashboard on iPhone/iPad via Tailscale

---

## Root Cause Analysis

| Platform | Tailscale Trust | Mechanism |
|----------|----------------|-----------|
| macOS | ✅ Trusted | Tailscale system extension registers certificates with Keychain |
| iOS | ❌ NOT Trusted | No system extension model on iOS; `.ts.net` certs from LetsEncrypt need manual trust |
| Android | ⚠️ Varies | May work, may need manual trust depending on ROM |

The `.ts.net` domains use LetsEncrypt certificates. iOS requires explicit user action to trust certificates for domains that aren't preloaded in the HSTS list or part of a trusted app profile.

---

## Solutions (Ranked by Feasibility)

### Option 1: Custom Domain + Valid SSL (RECOMMENDED)
**What:** Point a custom domain (e.g., `dashboard.systack.net`) to the Tailscale IP via A record, use a real SSL certificate.
**How:**
1. Buy/acquire `dashboard.systack.net` (or use existing `systack.net`)
2. Add A record pointing to the Tailscale IPv4 (100.x.x.x) or public IP
3. Use Tailscale serve with `--https` but override the cert
4. OR: Use Cloudflare Tunnel (cloudflared) instead of Tailscale serve — gives you a real public domain

**Pros:** ✅ Works on all devices natively, professional appearance  
**Cons:** Requires public domain, slightly more complex setup  
**Effort:** 2 hours  
**Cost:** $0 (Cloudflare Tunnel free tier) or use existing domain  

---

### Option 2: Cloudflare Tunnel (Zero Trust)
**What:** Replace Tailscale serve with Cloudflare Tunnel — no `.ts.net` needed.
**How:**
1. Install `cloudflared` on the MacBook Air
2. Create tunnel in Cloudflare dashboard
3. Point tunnel to `localhost:8768`
4. Assign hostname like `saos.systack.net` or `dashboard.systack.net`
5. Cloudflare handles SSL automatically

**Pros:** ✅ No cert issues on any device, built-in DDoS protection, analytics  
**Cons:** Requires Cloudflare account, dependency on Cloudflare  
**Effort:** 1 hour  
**Cost:** $0 (free tier covers this)  

---

### Option 3: Manual iOS Certificate Install
**What:** Have users manually install and trust the Tailscale/LetsEncrypt certificate.
**How:**
1. Export the `.ts.net` certificate from the server
2. Host it at a trusted URL
3. User downloads the `.cer` file on iOS
4. User goes to Settings → General → VPN & Device Management → installs profile
5. User goes to Settings → About → Certificate Trust Settings → enables trust

**Pros:** Works with existing setup  
**Cons:** ❌ Terrible UX, requires user action every cert renewal (90 days), friction kills adoption  
**Effort:** 30 min to build docs, infinite user friction  

---

### Option 4: Tailscale App + MagicDNS (Partial)
**What:** Use the Tailscale iOS app — once connected, `.ts.net` names resolve.
**How:**
1. Install Tailscale app on iOS
2. Connect to the tailnet
3. Access `phillips-macbook-air.tail573d57.ts.net/dashboard/`

**Current state:** ❌ Even with Tailscale app connected, Safari still shows cert error for `.ts.net`  
**Why:** The cert is valid (LetsEncrypt) but iOS Safari doesn't auto-trust it without user interaction.

---

## RECOMMENDED APPROACH: Option 2 (Cloudflare Tunnel)

### Why This Option
- Free (Cloudflare Tunnel is $0)
- Zero cert issues — Cloudflare issues and manages real certs
- No `.ts.net` dependency
- Works on any device, any browser
- Adds DDoS protection and analytics as bonus
- Can keep Tailscale for backend mesh (don't need to remove it)

### Implementation Steps

| Step | Action | Time |
|------|--------|------|
| 1 | Verify Cloudflare account for `systack.net` | 5 min |
| 2 | Install `cloudflared` on MacBook Air (`brew install cloudflared`) | 5 min |
| 3 | Authenticate cloudflared to Cloudflare account | 5 min |
| 4 | Create tunnel in Cloudflare dashboard | 10 min |
| 5 | Configure tunnel: `localhost:8768` → `dashboard.systack.net` | 10 min |
| 6 | Run cloudflared as service (launchd or keep open) | 10 min |
| 7 | Test on iOS Safari | 5 min |
| 8 | Update dashboard docs with new URL | 10 min |
| | **Total** | **~1 hour** |

### Rollback Plan
- Keep Tailscale serve running in parallel
- If Cloudflare Tunnel fails, revert to `*.ts.net` URLs
- Zero downtime: both can run simultaneously

---

## Fallback: Option 1 (Custom Domain A Record)

If Cloudflare Tunnel doesn't work:
1. Create subdomain `dashboard.systack.net`
2. Point A record to the public IP of the VPS (if public) or the Tailscale IP
3. Use `certbot` to get real LetsEncrypt certificate
4. Configure nginx or similar reverse proxy

This requires either:
- Public IP for the MacBook Air (not typical), OR
- A VPS in the middle that proxies to the MacBook via Tailscale

More complex but fully independent.

---

## Immediate Workaround (While Implementing)

For current iOS users:
1. Open Tailscale iOS app
2. Connect to tailnet
3. Use Chrome or Firefox instead of Safari (they may handle the cert differently)
4. OR: Access dashboard via desktop and use the mobile responsive view there

---

## Files to Update After Fix

| File | Update |
|------|--------|
| `index.html` | Remove any hardcoded `.ts.net` references, update help text |
| `SAOS-Dashboard-Mobile-Access-Guide-*.md` | Add iOS cert trust section |
| `systack-site/saos/` | Update onboarding links if any point to `.ts.net` |

---

## Decision Required

**Green — which option do you want?**

| Option | Effort | Cost | UX |
|--------|--------|------|-----|
| A. Cloudflare Tunnel | 1 hour | $0 | ✅ Perfect |
| B. Custom domain A record | 2 hours | $0 | ✅ Perfect |
| C. Manual iOS cert install | 30 min | $0 | ❌ Terrible |
| D. Do nothing (use desktop) | 0 | $0 | ⚠️ Limiting |

My recommendation: **Option A (Cloudflare Tunnel)** — 1 hour, zero cost, solves the problem permanently.

Ready to implement when you confirm.
