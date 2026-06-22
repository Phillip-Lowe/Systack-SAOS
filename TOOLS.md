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
