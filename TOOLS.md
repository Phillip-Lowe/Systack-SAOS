# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

## Related

- [Agent workspace](/concepts/agent-workspace)

---

## Skills Database (Updated 2026-06-30)

**Location:** `~/.openclaw/skills/`
**Total:** 32 skills (all with SKILL.md)

### Recently Added (24)
From `Sol-Knowledge/tools/skills/` — discovered gap where documented skills were never installed:
- ai-consultation-orchestrator
- auto-research
- automator-runbook-generator
- booking-frontend
- catering-lead-system
- client-onboarding
- cold-email-engine
- dashboard-api
- fleet-orchestrator
- green-content-calendar
- green-email-outreach
- green-lead-scraper
- green-n8n-monitor
- invoice-pipeline
- linkedin-lead-gen-outreach
- mcporter-skill
- n8n-error-catcher
- n8n-workflow-automation
- pdf-generation
- productivity-automation-kit
- sage-lite-memory
- site-deployer
- stripe-payment-integration
- vps-provisioning

### Existing (8)
- branded-pdf-generator
- kling-ai
- local-image-gen
- local-video-gen
- local-voice-streaming
- n8n
- n8n-workflow-builder
- sol-voice-agent

### Discovery Source
Also check `Sol-Knowledge/tools/skills/` for additional skill documentation not yet installed.

---

## Credential Security (Added 2026-06-22)

### Exposed Credential Response
**Tool:** BFG Repo-Cleaner (`brew install bfg`)
**Process:**
```bash
# 1. Clone mirror
git clone --mirror https://github.com/Phillip-Lowe/systack-saas.git
cd systack-saas.git

# 2. Delete file from all history
bfg --delete-files "filename.json"

# 3. Clean reflog and garbage collect
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. Force push
git push --force
```

### .gitignore Rules (Always Active)
- `*secret*`, `*credential*`, `*token*`, `*password*`, `*api_key*`
- `*oauth*.json`, `*google*.json`, `*maps*.json`
- `credentials/`, `secrets/`, `tokens/`, `auth/` directories

### Never Commit
- Any file with "secret", "credential", "token", "password" in name
- JSON files containing OAuth configs
- API keys in any format
- Private keys (.pem, .key, .p12)

### Pre-Commit Protection
**Recommended:** `git-secrets` or `truffleHog` pre-commit hooks
**Install:** `brew install git-secrets`
**Setup per repo:**
```bash
git secrets --install
git secrets --register-aws  # or custom patterns
```

---

## BlueBubbles (iMessage Bridge)

**Status:** ✅ Working as of 2026-06-25
**Server:** http://phillips-macbook-air.tail573d57.ts.net:1234
**Phone:** +15012746231

### Delivery Config for Cron Jobs
All cron jobs that notify Green must include:
```json
"delivery": {
  "mode": "announce",
  "channel": "bluebubbles",
  "to": "+15012746231"
}
```

### Common Error (Fixed)
`"Delivering to BlueBubbles requires --to <handle|chat_guid:GUID>"`
→ Fix: Add explicit `channel` and `to` fields to delivery object.

### When BlueBubbles Breaks
- Check server is running: `brew services list | grep bluebubbles`
- Server URL must be reachable (Tailscale or localhost)
- If disabled in config: update `openclaw.json` → `channels.bluebubbles.enabled = true`

---

## Git Repos

| Repo | URL | Purpose |
|------|-----|---------|
| systack (workspace) | `origin` | Main workspace, agent configs |
| systack-saas | `systack-saas` | SAOS product codebase |

**⚠️ systack-saas contains PUBLIC history** — never commit credentials there.

---

## Incident Response Contacts

| Service | Where to Rotate | What to Check |
|---------|----------------|---------------|
| Google OAuth | cloud.google.com → APIs & Services → Credentials | Client ID: `964526683104-eij4huqs16t72irn6eg129h1gsgbbsl4` |
| Google Maps API | Same console, API Keys section | Check billing for unauthorized usage |
| n8n | n8n.systack.net → Settings → API | Update webhook/credential configs |

---

## SAOS Documentation Pipeline

**Location:** `~/.openclaw/skills/branded-pdf-generator/`
**Script:** `scripts/generate_pdf.py`
**Stack:** pandoc (MD→HTML) + pyppeteer/Chromium (HTML→PDF)

### Usage
```bash
# Single file
python3 ~/.openclaw/skills/branded-pdf-generator/scripts/generate_pdf.py input.md output.pdf --title "Title"

# All SAOS docs
cd ~/.openclaw/workspaces/sol/Systack/content/saos/saos-data/customer-dashboard
for md in SAOS-*.md; do
  pdf="${md%.md}.pdf"
  python3 ~/.openclaw/skills/branded-pdf-generator/scripts/generate_pdf.py "$md" "$pdf"
done
```

### Document Version Matrix
| Document | Current MD | Current PDF | Pages | Audience |
|----------|-----------|-------------|-------|----------|
| Quick Start Guide | **v7.0** | **v7.0** | 5 | Client |
| Dashboard User Guide | **v6.0** | **v6.0** | 10 | Client |
| Service Manual | **v7.0** | **v7.0** | 10 | Client |
| Architecture Overview | **v5.0** | **v5.0** | 10 | Internal |
| Mobile Access Guide | **v4.0** | **v4.0** | 7 | Client |
| Enterprise Deployment | — | v1.0 | 4 | Enterprise/Private |

### Dashboard Doc Routes (api.py)
- `/download/quickstart-v7` → Quick Start v7.0
- `/download/user-guide-v6` → User Guide v6.0
- `/download/manual-v7` → Service Manual v7.0
- `/download/architecture-v5` → Architecture v5.0 (internal)
- `/download/mobile-guide-v4` → Mobile Guide v4.0
- `/download/enterprise-guide` → Enterprise Deployment v1.0
- *(Backward compat: `/download/user-guide-v5` → User Guide v6.0, `/download/mobile-guide-v3` → Mobile Guide v4.0)*

### Known Issues
- pyppeteer Chromium often fails on macOS — script falls back to Brave Browser
- If Brave also fails: `brew install --cask google-chrome`
