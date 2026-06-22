# Workspace Recovery Report — 2026-06-22

## Summary
Post-cleanup sweep found **3 categories of issues**: duplicate files (safe to clean), orphaned files (need relocation), and stale copies (need reconciliation). Total: ~100+ duplicate memory files, 6 orphaned root files, and 2 divergent identity files.

---

## 🔴 CRITICAL: Divergent Identity Files (ROOT vs Sol-Knowledge)

The root-level identity files and their Sol-Knowledge copies have **diverged**. The root copies are OLDER/EMPTY.

| File | Root Status | Sol-Knowledge Status | Action |
|------|------------|---------------------|--------|
| `AGENTS.md` | Older (missing bootstrap section) | ✅ Current | **Copy Sol-Knowledge → root** |
| `SOUL.md` | ✅ Identical | ✅ Identical | None needed |
| `IDENTITY.md` | Empty (all fields blank) | Filled (Phillip/Green) | **Copy Sol-Knowledge → root** |
| `USER.md` | Empty (all fields blank) | Filled (Phillip/Green/Central) | **Copy Sol-Knowledge → root** |
| `MEMORY.md` | Current (2690 lines) | Older (2689 lines) | **Keep root, archive Sol-Knowledge** |

**Root cause:** Sol-Knowledge was set up as a vault copy, but the workspace root files are what OpenClaw loads at startup. When they diverge, the agent gets wrong/empty identity.

**Fix:**
```bash
cp /Users/philliplowe/.openclaw/workspaces/sol/Sol-Knowledge/01-Identity/AGENTS.md /Users/philliplowe/.openclaw/workspaces/sol/AGENTS.md
cp /Users/philliplowe/.openclaw/workspaces/sol/Sol-Knowledge/01-Identity/IDENTITY.md /Users/philliplowe/.openclaw/workspaces/sol/IDENTITY.md
cp /Users/philliplowe/.openclaw/workspaces/sol/Sol-Knowledge/01-Identity/USER.md /Users/philliplowe/.openclaw/workspaces/sol/USER.md
cp /Users/philliplowe/.openclaw/workspaces/sol/MEMORY.md /Users/philliplowe/.openclaw/workspaces/sol/Sol-Knowledge/02-Memory/MEMORY.md
```

---

## 🟡 MEDIUM: Orphaned Files at Workspace Root

These files belong elsewhere. They were likely left behind during a previous move/organization.

### 1. Utopia Deli Weekly Messaging JS Files
**Location:** Root (`utopia-deli-weekly-messaging-*.js`)
**Should be in:** `email-campaign/` (where `utopia-deli-all-days.js` already lives)
**Files:**
- `utopia-deli-weekly-messaging-code.js` (430 lines)
- `utopia-deli-weekly-messaging-v2.js` (456 lines)
- `utopia-deli-weekly-messaging-v3.js` (335 lines)
- `utopia-deli-weekly-messaging-v4.js` (335 lines)

**Action:** Move to `email-campaign/legacy-versions/` or delete if superseded by `utopia-deli-all-days.js`.

### 2. Orphaned `index.html`
**Location:** Root (`index.html`)
**Should be in:** `Systack/content/systack-site/` (where the actual site lives)
**Size:** Unknown, likely old redirect or stub.

**Action:** Check if it's the old redirect to `systack-site/`, then delete (CNAME handles this).

### 3. `MEMORY-RECOVERED.md` and `MEMORY-RECOVERED-B856.md`
**Location:** Root
**Status:** These are backup copies of MEMORY.md from recovery events.
- `MEMORY-RECOVERED.md`: 2689 lines (1 line shorter than current)
- `MEMORY-RECOVERED-B856.md`: 2717 lines (possibly from different recovery)

**Action:** Archive to `memory/recovered/` or delete once reviewed. Current `MEMORY.md` (2690 lines) is authoritative.

---

## 🟢 LOW: Duplicate Memory Files (`memory/` vs `memory/recovered/`)

~100 files exist in BOTH `memory/` and `memory/recovered/`. Spot checks show **identical MD5 hashes** — the recovery process created copies but the originals were already restored.

**Safe to delete:** Everything in `memory/recovered/` that has a matching filename in `memory/`.

**Files with NO match in `memory/` (keep these):**
- Check needed: some recovered files may be unique. Need to run a systematic diff.

**Quick cleanup command:**
```bash
# List recovered files that DON'T exist in memory/ (these are truly recovered)
for f in memory/recovered/*.md; do
  [ -f "memory/$(basename $f)" ] || echo "UNIQUE: $f"
done
```

---

## 🟢 LOW: Orphaned Credentials at Root

**Location:** `credentials/Green/` (root)
**Contents:**
- `Tailscale/Tailscale Auth Key`
- `Vultr/VULTR API`
- `n8n/n8n Openclaw api`

**Sol-Knowledge has the same keys PLUS MORE:**
- Same 3 keys exist in `Sol-Knowledge/credentials/Green/`
- PLUS: Ollama, Twilio, codes, postgres, sol, stripe, and The Utopia Deli credentials

**Action:** Root `credentials/` can be deleted — it's a subset. All credentials should live in `Sol-Knowledge/credentials/` (the canonical vault).

---

## 🟢 LOW: Duplicate Log Directories

**Two identical log directories exist:**
- `logs/deli-logs/` (6 files)
- `utopia-deli-revamp/logs/` (6 files)

Both contain checkout server logs and tunnel logs. Likely one is a copy.

**Action:** Keep `logs/deli-logs/` as the canonical location. Delete `utopia-deli-revamp/logs/` if it's a subset/copy.

---

## 📋 Recommended Cleanup Actions

### Immediate (Do Now)
1. **Fix identity divergence** — Copy Sol-Knowledge identity files to root
2. **Delete orphaned root credentials/** — It's a subset of Sol-Knowledge
3. **Move/delete orphaned JS files** — Either archive or delete the 4 root-level messaging JS files
4. **Remove MEMORY-RECOVERED backups** — Or archive to `memory/recovered/`

### Batch (Next Maintenance Window)
5. **Deduplicate memory/recovered/** — ~100 files are identical copies, safe to delete
6. **Consolidate log directories** — Keep one canonical location
7. **Remove old `index.html`** — If it's a stale redirect

---

## File Inventory Summary

| Category | Count | Action |
|----------|-------|--------|
| Duplicate memory files | ~100 | Delete from `memory/recovered/` |
| Orphaned root JS files | 4 | Move to `email-campaign/` or delete |
| Orphaned credentials | 3 files | Delete (subset of Sol-Knowledge) |
| Divergent identity files | 3 | Copy Sol-Knowledge → root |
| Recovered memory backups | 2 | Archive or delete |
| Duplicate log dirs | 1 | Consolidate |
| Orphaned `index.html` | 1 | Review then delete |

---

*Report generated by SOL — 2026-06-22*
