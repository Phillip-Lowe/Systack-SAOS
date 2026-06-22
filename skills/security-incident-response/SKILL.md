# Security Incident Response Skill

**Created:** 2026-06-22
**Purpose:** Standardized response to exposed secrets, credentials, or security incidents
**Status:** ACTIVE

---

## When This Skill Applies

- OAuth/API secrets exposed in public repos
- Credential files accidentally committed to git
- API keys leaked in logs, URLs, or messages
- Any unauthorized access suspected

---

## Response Protocol (10 Steps)

### 1. STOP
Do not continue normal operations. This is now a security incident.

### 2. DOCUMENT
Create incident log immediately:
```
memory/YYYY-MM-DD-security-incident-<name>.md
```

Required fields:
- What was exposed
- Where (file path, commit, URL)
- When discovered
- Severity (CRITICAL/HIGH/MEDIUM/LOW)

### 3. REMOVE FROM HEAD
```bash
rm "path/to/file"
git add -A
git commit -m "SECURITY: Remove exposed [type] credentials"
git push origin main
```

### 4. REWRITE GIT HISTORY
**Install BFG:** `brew install bfg`

```bash
# Clone mirror
git clone --mirror https://github.com/OWNER/REPO.git repo.git
cd repo.git

# Remove file from ALL commits
bfg --delete-files "exposed-file.json"

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (irreversible!)
git push --force
```

### 5. VERIFY REMOVAL
```bash
# Should return 404
curl -s "https://raw.githubusercontent.com/OWNER/REPO/main/path/to/file"
```

### 6. ADD .gitignore PROTECTION
```bash
# Create BEFORE any new credential files
cat > .gitignore << 'EOF'
# Secrets
*.env
*.key
*.pem
*secret*
*credential*
*token*
*password*
*api_key*
*oauth*.json
*google*.json
*maps*.json
credentials/
secrets/
tokens/
auth/
EOF

git add .gitignore
git commit -m "SECURITY: Add .gitignore credential protection"
git push origin main
```

### 7. ROTATE CREDENTIALS (User Must Do)

| Provider | Action | Where |
|----------|--------|-------|
| Google OAuth | Delete old client → Create new | cloud.google.com → APIs & Services → Credentials |
| Google Maps | Delete old key → Create new | Same console, API Keys |
| Stripe | Roll key | dashboard.stripe.com → Developers → API Keys |
| Any other | Rotate/Regenerate | Provider console |

### 8. CHECK FOR ABUSE
- Review provider logs for unauthorized usage
- Check billing dashboards for anomalies
- Look for unexpected API calls, data exports, or configuration changes

### 9. UPDATE DEPENDENT SYSTEMS
- n8n workflows
- Applications
- CI/CD pipelines
- Environment variables
- Any other service using the old credential

### 10. SAVE TO MEMORY
- Add entry to MEMORY.md pitfall catalog
- Update AGENTS.md if protocol changes
- Save incident log in `memory/`
- Create skill update if process improved

---

## Critical Rules

| # | Rule | Why |
|---|------|-----|
| 1 | **Never commit credential files** | Git history is permanent |
| 2 | **.gitignore must exist BEFORE files** | Prevention, not cleanup |
| 3 | **Never use shell expansion for keys** | zsh corrupts JWT strings |
| 4 | **Always verify removal with curl** | HEAD deletion ≠ history deletion |
| 5 | **Force-push is irreversible** | All collaborators must re-clone |
| 6 | **Rotate, don't just delete** | Exposure may have been exploited |
| 7 | **Document everything** | Future incidents will reference this |

---

## Brand Protection During Incidents

- **SAOS** is the product name
- **systack-saas** is the repo slug (legacy name)
- **Never** refer to SAOS as "SaaS" in any communication
- Always say: "SAOS codebase in systack-saas repo" if both must be mentioned

---

## Tools Required

| Tool | Install | Use |
|------|---------|-----|
| BFG | `brew install bfg` | History rewriting |
| git-filter-repo | `pip install git-filter-repo` | Alternative to BFG |
| git-secrets | `brew install git-secrets` | Pre-commit hook |
| truffleHog | `pip install truffleHog` | Repo scanning |

---

## Related Files

- `memory/2026-06-22-security-incident-oauth-exposure.md` — Example incident log
- `AGENTS.md` — RULE 7: Security Incident Response Protocol
- `TOOLS.md` — Credential security section
- `.gitignore` — Active protection rules

---

**Last Updated:** 2026-06-22
**Next Review:** After next incident or quarterly
