# Security Incident — OAuth Secret Exposed in Public Repo

**Date:** 2026-06-22 11:30 CDT
**Severity:** CRITICAL
**Status:** REMEDIATED

---

## What Happened

Google Cloud Platform detected and flagged an exposed OAuth client secret in the public GitHub repo `Phillip-Lowe/systack-saas`:

- **File:** `Sol-Knowledge/credentials/Green/n8n/Google maps api.json`
- **Client ID:** `964526683104-eij4huqs16t72irn6eg129h1gsgbbsl4.apps.googleusercontent.com`
- **Exposure:** Both OAuth client secret AND Google Maps API key were in the file
- **Root Cause:** Credential file committed to git without `.gitignore` protection

---

## Actions Taken

1. ✅ **Removed file from current HEAD** — commit `cdbd82e`
2. ✅ **Rewrote git history with BFG** — removed from all 59 commits
3. ✅ **Force-pushed cleaned history** — commit `6b98abc`
4. ✅ **Added `.gitignore`** — prevents future credential leaks
5. ✅ **Verified removal** — GitHub raw URL returns 404

---

## Still Required (User Action)

| Action | Status | Where |
|--------|--------|-------|
| Rotate OAuth client secret | ❌ PENDING | Google Cloud Console → APIs & Services → Credentials |
| Regenerate Google Maps API key | ❌ PENDING | Google Cloud Console → APIs & Services → Credentials |
| Check logs for unauthorized usage | ❌ PENDING | Google Cloud Console → Monitoring → Logs |
| Update n8n / applications with new creds | ❌ PENDING | Your services |

---

## Lessons Learned

1. **No credential files in git. Ever.** Even "temporary" commits are permanent in history.
2. **`.gitignore` must be created BEFORE any credential files exist in the repo.**
3. **Repo name `systack-saas` ≠ product name SAOS.** I incorrectly referred to the product as "SaaS" in the incident notification — brand confusion. Added to pitfall catalog.
4. **BFG is the right tool** — `git-filter-repo` is cleaner but requires Python module installation.

---

## Prevention

- `.gitignore` now protects: `*secret*`, `*credential*`, `*oauth*`, `*google*.json`, `*maps*.json`, `credentials/` directory
- Consider adding pre-commit hooks (e.g., `truffleHog`, `git-secrets`) to catch future exposures

---

**Next Review:** Verify credential rotation is complete before end of day.
