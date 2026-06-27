# Percy Deployment — UPDATED CONFIG v2.0 (2026-06-27)

**Date:** 2026-06-27
**Client:** Jacqueline, McDonald's GM
**VPS:** Vultr 4GB ($20/mo) — or upgrade to 8GB
**Status:** 🔄 READY TO DEPLOY

---

## What Changed Since June 5

### Critical Updates (Based on DOOBY/LOKI Local Success)

| Discovery | June 5 Config | June 27 Update | Why |
|-----------|--------------|----------------|-----|
| **Model** | qwen2.5:3b | **qwen2.5:3b** (keep) | Still the only reliable 4GB model |
| **Context** | 16K tokens | **4K–8K tokens** | 16K was too much; model swaps with 0.5GB free |
| **Bootstrap max** | Not set | **2,000 chars** | Truncates identity file injection per file |
| **Bootstrap total** | Not set | **4,000 chars** | Total across all injected files |
| **Context injection** | always | **continuation-skip** | Avoids re-injecting full files every turn |
| **Memory get** | Not set | **2,000 chars** | Limits memory excerpt size |
| **Tool result** | Not set | **2,000 chars** | Prevents huge tool outputs filling context |
| **Context pruning** | Not set | **softTrim** mode | Actively prunes old context before overflow |
| ** compaction** | reserveTokensFloor: 8192 | **disabled** | Compaction causes memory spikes; disable on 4GB |
| **Identity files** | 1,009 words | **<800 words** | Strip further; every token counts |
| **Heartbeat** | Not set | **disabled** | Saves context space and RAM |

### What We Learned from DOOBY/LOKI (June 27)

1. **qwen3.5:9b is too big for 4GB** — needs 10GB loaded, won't fit
2. **Context tokens directly control RAM** — lower context = less RAM used
3. **bootstrapMaxChars works** — limits how much of identity files inject
4. **continuation-skip is essential** — stops repeated full-file injection
5. **Tool results can overflow** — must cap with `toolResultMaxChars`
6. **No compaction on 4GB** — causes spikes that kill the process

---

## UPDATED Gateway Config (Ready to Deploy)

```json
{
  "gateway": {
    "mode": "local",
    "auth": {
      "mode": "none"
    },
    "port": 18789,
    "bind": "loopback",
    "tailscale": {
      "mode": "serve",
      "resetOnExit": false
    },
    "controlUi": {
      "allowedOrigins": [
        "http://localhost:18789",
        "http://127.0.0.1:18789",
        "https://percy-mcdonalds.taildd162e.ts.net"
      ],
      "allowInsecureAuth": true,
      "basePath": "/"
    }
  },
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://127.0.0.1:11434",
        "api": "ollama",
        "models": [
          {
            "id": "qwen2.5:3b",
            "name": "qwen2.5:3b",
            "reasoning": false,
            "input": ["text"],
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            },
            "contextWindow": 4096,
            "maxTokens": 2048,
            "compat": {
              "supportsTools": true,
              "supportsUsageInStreaming": false
            },
            "params": {
              "num_ctx": 4096,
              "num_thread": 2,
              "temperature": 0.7
            }
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/qwen2.5:3b",
        "fallbacks": []
      },
      "bootstrapMaxChars": 2000,
      "bootstrapTotalMaxChars": 4000,
      "contextInjection": "continuation-skip",
      "bootstrapPromptTruncationWarning": "off",
      "contextLimits": {
        "memoryGetMaxChars": 2000,
        "memoryGetDefaultLines": 50,
        "toolResultMaxChars": 2000,
        "postCompactionMaxChars": 1500
      },
      "contextPruning": {
        "mode": "softTrim",
        "keepLastAssistants": 3,
        "softTrimRatio": 0.4,
        "hardClearRatio": 0.8,
        "minPrunableToolChars": 500,
        "ttl": "30m"
      },
      "compaction": {
        "enabled": false
      },
      "timeoutSeconds": 120,
      "heartbeat": {
        "enabled": false
      },
      "memorySearch": {
        "model": "nomic-embed-text",
        "provider": "ollama"
      },
      "contextTokens": 4096
    },
    "list": [
      {
        "id": "percy",
        "identity": {
          "avatar": "🦉"
        },
        "workspace": "/root/.openclaw/workspaces/percy"
      }
    ]
  }
}
```

---

## Identity Files — STRIPPED v2.0 (Target: <800 words)

### SOUL.md (150 words max)

```markdown
# SOUL.md — Percy

Be helpful, not performative. Skip filler words.
Have opinions. Disagree when warranted.
Be resourceful before asking.
Earn trust through competence.

**Boundaries**
- Private things stay private
- Ask before acting externally
- Never send half-baked replies

**Identity**
- Name: Percy
- Role: Personal AI assistant for Jacqueline, McDonald's GM
- Emoji: 🦉
```

### USER.md (100 words max)

```markdown
# USER.md — Jacqueline

**Name:** Jacqueline
**What to call her:** Jacqueline
**Role:** General Manager, McDonald's

**Priorities:**
- Employee scheduling and management
- Store operations and efficiency
- Customer satisfaction
- Work-life balance

**Communication:** Direct, practical, no fluff.
```

### AGENTS.md (200 words max)

```markdown
# AGENTS.md — Percy

## Critical Rules

1. **Check MEMORY.md before acting**
2. **Document decisions** in memory/YYYY-MM-DD.md
3. **Ask before** emails, posts, config changes, destructive commands

## Session Startup
Use runtime-provided context first. Don't manually reread files.

## Memory System
| Layer | File | Purpose |
|-------|------|---------|
| Daily | memory/YYYY-MM-DD.md | Raw events |
| Long-term | MEMORY.md | Rules + decisions |

## Tier Boundaries
**Current: TIER 0** — Read, draft, research, remember. NO external actions.

## Tools
Check SKILL.md before using tools.
```

### MEMORY.md (200 words max)

```markdown
# MEMORY.md — Percy

## Jacqueline — McDonald's GM

**Store:** McDonald's Little Rock location
**Team size:** ~25 employees
**Focus areas:** Scheduling, operations, customer experience

## Key Preferences
- Prefers text messages over calls
- Quiet hours: 10 PM – 6 AM
- Stores important info in phone notes

## Current Tasks
- Track weekly schedule changes
- Monitor employee time-off requests
- Prepare monthly reports

## Decisions Log
- 2026-06-05: Percy deployed on 4GB VPS
```

### HEARTBEAT.md (20 words)

```markdown
# Keep empty to skip heartbeat API calls.
```

### TOOLS.md (50 words)

```markdown
# TOOLS.md — Local Notes

**Nothing environment-specific yet.**
```

### IDENTITY.md (80 words)

```markdown
# IDENTITY.md — Percy

- **Name:** Percy
- **Creature:** Personal AI assistant
- **Vibe:** Helpful, direct, reliable
- **Emoji:** 🦉
```

### KUDU-7.md (30 words)

```markdown
# KUDU-7: Never ask the user to verify what you can verify yourself.
```

**TOTAL TARGET: ~730 words (~550 tokens)** ✅

---

## Deployment Script (One-Command Deploy)

Save as `deploy-percy-v2.sh` and run on VPS:

```bash
#!/bin/bash
set -e

echo "=== Percy v2.0 Deployment Script ==="
echo "VPS: 4GB RAM | Model: qwen2.5:3b | Context: 4K"

# 1. Update system
echo "[1/8] Updating system..."
dnf update -y

# 2. Install Ollama
echo "[2/8] Installing Ollama..."
curl -fsSL https://ollama.com/install.sh | sh
systemctl enable ollama
systemctl start ollama

# 3. Pull model
echo "[3/8] Pulling qwen2.5:3b..."
ollama pull qwen2.5:3b

# 4. Install OpenClaw
echo "[4/8] Installing OpenClaw..."
npm install -g openclaw

# 5. Run non-interactive setup
echo "[5/8] Running OpenClaw setup..."
openclaw onboard --non-interactive --provider ollama --model qwen2.5:3b --no-model-pull

# 6. Write config
echo "[6/8] Writing updated config..."
cat > /root/.openclaw/openclaw.json <<'EOF'
{
  "gateway": {
    "mode": "local",
    "auth": { "mode": "none" },
    "port": 18789,
    "bind": "loopback",
    "tailscale": { "mode": "serve", "resetOnExit": false },
    "controlUi": {
      "allowedOrigins": [
        "http://localhost:18789",
        "http://127.0.0.1:18789"
      ],
      "allowInsecureAuth": true
    }
  },
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://127.0.0.1:11434",
        "api": "ollama",
        "models": [
          {
            "id": "qwen2.5:3b",
            "name": "qwen2.5:3b",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 4096,
            "maxTokens": 2048,
            "compat": { "supportsTools": true, "supportsUsageInStreaming": false },
            "params": { "num_ctx": 4096, "num_thread": 2, "temperature": 0.7 }
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "ollama/qwen2.5:3b", "fallbacks": [] },
      "bootstrapMaxChars": 2000,
      "bootstrapTotalMaxChars": 4000,
      "contextInjection": "continuation-skip",
      "bootstrapPromptTruncationWarning": "off",
      "contextLimits": {
        "memoryGetMaxChars": 2000,
        "memoryGetDefaultLines": 50,
        "toolResultMaxChars": 2000,
        "postCompactionMaxChars": 1500
      },
      "contextPruning": {
        "mode": "softTrim",
        "keepLastAssistants": 3,
        "softTrimRatio": 0.4,
        "hardClearRatio": 0.8,
        "minPrunableToolChars": 500,
        "ttl": "30m"
      },
      "compaction": { "enabled": false },
      "timeoutSeconds": 120,
      "heartbeat": { "enabled": false },
      "memorySearch": { "model": "nomic-embed-text", "provider": "ollama" },
      "contextTokens": 4096
    },
    "list": [
      { "id": "percy", "identity": { "avatar": "🦉" }, "workspace": "/root/.openclaw/workspaces/percy" }
    ]
  }
}
EOF

# 7. Create workspace
echo "[7/8] Creating Percy workspace..."
mkdir -p /root/.openclaw/workspaces/percy
cd /root/.openclaw/workspaces/percy

# Write minimal identity files
cat > SOUL.md <<'EOF'
# SOUL.md — Percy

Be helpful, not performative. Skip filler words.
Have opinions. Disagree when warranted.
Be resourceful before asking.
Earn trust through competence.

**Boundaries**
- Private things stay private
- Ask before acting externally
- Never send half-baked replies

**Identity**
- Name: Percy
- Role: Personal AI assistant for Jacqueline, McDonald's GM
- Emoji: 🦉
EOF

cat > USER.md <<'EOF'
# USER.md — Jacqueline

**Name:** Jacqueline
**What to call her:** Jacqueline
**Role:** General Manager, McDonald's

**Priorities:**
- Employee scheduling and management
- Store operations and efficiency
- Customer satisfaction
- Work-life balance

**Communication:** Direct, practical, no fluff.
EOF

cat > AGENTS.md <<'EOF'
# AGENTS.md — Percy

## Critical Rules

1. **Check MEMORY.md before acting**
2. **Document decisions** in memory/YYYY-MM-DD.md
3. **Ask before** emails, posts, config changes, destructive commands

## Session Startup
Use runtime-provided context first. Don't manually reread files.

## Memory System
| Layer | File | Purpose |
|-------|------|---------|
| Daily | memory/YYYY-MM-DD.md | Raw events |
| Long-term | MEMORY.md | Rules + decisions |

## Tier Boundaries
**Current: TIER 0** — Read, draft, research, remember. NO external actions.

## Tools
Check SKILL.md before using tools.
EOF

cat > MEMORY.md <<'EOF'
# MEMORY.md — Percy

## Jacqueline — McDonald's GM

**Store:** McDonald's Little Rock location
**Team size:** ~25 employees
**Focus areas:** Scheduling, operations, customer experience

## Key Preferences
- Prefers text messages over calls
- Quiet hours: 10 PM – 6 AM
- Stores important info in phone notes

## Current Tasks
- Track weekly schedule changes
- Monitor employee time-off requests
- Prepare monthly reports

## Decisions Log
- 2026-06-05: Percy deployed on 4GB VPS
- 2026-06-27: Config v2.0 applied (reduced context, stripped files)
EOF

cat > HEARTBEAT.md <<'EOF'
# Keep this file empty to skip heartbeat API calls.
EOF

cat > TOOLS.md <<'EOF'
# TOOLS.md — Local Notes

**Nothing environment-specific yet.**
EOF

cat > IDENTITY.md <<'EOF'
# IDENTITY.md — Percy

- **Name:** Percy
- **Creature:** Personal AI assistant
- **Vibe:** Helpful, direct, reliable
- **Emoji:** 🦉
EOF

cat > KUDU-7.md <<'EOF'
# KUDU-7: Never ask the user to verify what you can verify yourself.
EOF

# 8. Install and start service
echo "[8/8] Installing and starting service..."
openclaw gateway install
systemctl --user daemon-reload
systemctl --user enable openclaw-gateway
systemctl --user start openclaw-gateway

# Open firewall
firewall-cmd --permanent --add-port=18789/tcp
firewall-cmd --reload

echo ""
echo "=== Deployment Complete ==="
echo "Next steps:"
echo "1. Install Tailscale: curl -fsSL https://tailscale.com/install.sh | sh"
echo "2. Authenticate: tailscale up --hostname percy-mcdonalds"
echo "3. Enable HTTPS: https://login.tailscale.com/admin/dns"
echo "4. Serve: tailscale serve --bg http://localhost:18789"
echo "5. Test: Send 'Hi Percy' from Jacqueline's phone"
echo ""
echo "RAM check: free -h"
echo "Model check: ollama ps"
echo "Logs: journalctl --user -u openclaw-gateway -f"
```

---

## SSH Deploy Commands (Copy-Paste Ready)

If you have SSH access, run these:

```bash
# 1. Copy deploy script to VPS
scp deploy-percy-v2.sh root@66.42.121.145:/root/

# 2. SSH in and run
ssh root@66.42.121.145 "chmod +x /root/deploy-percy-v2.sh && /root/deploy-percy-v2.sh"

# 3. Verify deployment
ssh root@66.42.121.145 "systemctl --user status openclaw-gateway && free -h && ollama ps"

# 4. Check for context overflow errors
ssh root@66.42.121.145 "grep -i 'overflow\|context\|truncat' /tmp/openclaw/openclaw-*.log 2>/dev/null || echo 'No overflow errors found'"
```

---

## Post-Deploy Verification Checklist

| # | Check | Command | Expected |
|---|-------|---------|----------|
| 1 | Gateway running | `systemctl --user status openclaw-gateway` | ✅ active |
| 2 | Port open | `ss -tlnp | grep 18789` | ✅ listening |
| 3 | Model loaded | `ollama ps` | ✅ qwen2.5:3b |
| 4 | RAM OK | `free -h` | ✅ <3.5GB used |
| 5 | Config valid | `openclaw config validate` | ✅ valid |
| 6 | No overflow | `grep -i overflow /tmp/openclaw/*.log` | ❌ none found |
| 7 | Tailscale serve | `tailscale serve status` | ✅ HTTPS URL |
| 8 | Test message | Send "Hi Percy" from phone | ✅ Response <15s |
| 9 | Context stable | Chat for 10+ turns | ✅ No silent failures |

---

## If It Still Fails

### Option A: Further Reduce Context (Emergency)

If 4K still overflows, drop to:

```json
{
  "contextWindow": 2048,
  "maxTokens": 1024,
  "bootstrapMaxChars": 1000,
  "bootstrapTotalMaxChars": 2000,
  "contextTokens": 2048,
  "params": { "num_ctx": 2048 }
}
```

**Trade-off:** Very short conversations, but stable.

### Option B: Upgrade to 8GB VPS (Recommended)

| VPS | Model | Context | Status |
|-----|-------|---------|--------|
| 4GB | qwen2.5:3b | 4K | ⚠️ Tight, may swap |
| 8GB | qwen2.5:7b | 16K | ✅ Comfortable |
| 16GB | qwen2.5:14b | 32K | ✅ Premium |

**Upgrade command:**
```bash
# On Vultr dashboard: Resize plan → 8GB
# Then on VPS:
ollama pull qwen2.5:7b
# Update openclaw.json: model → qwen2.5:7b, contextWindow → 16384
systemctl --user restart openclaw-gateway
```

---

## Comparison: Old vs New Config

| Parameter | June 5 Config | June 27 Config | Impact |
|-----------|--------------|----------------|--------|
| Model | qwen2.5:3b | qwen2.5:3b | Same |
| Context | 16,384 | **4,096** | -75% RAM per turn |
| Max tokens | 8,192 | **2,048** | Less output, faster |
| Bootstrap/file | unlimited | **2,000 chars** | Limits identity injection |
| Bootstrap total | unlimited | **4,000 chars** | Hard cap on system prompt |
| Context injection | always | **continuation-skip** | No re-injection |
| Memory excerpt | unlimited | **2,000 chars** | Prevents memory bloat |
| Tool result | unlimited | **2,000 chars** | Prevents tool bloat |
| Compaction | reserve 8K | **disabled** | No compaction spikes |
| Pruning | none | **softTrim** | Actively trims old context |
| Heartbeat | not set | **disabled** | Saves space |
| Identity words | 1,009 | **~730** | -28% tokens |
| Expected RAM | 3.5GB | **~2.8GB** | +0.7GB headroom |

---

## Files

| File | Location |
|------|----------|
| This config | `Systack/clients/mcdonalds-gm/PERCY-CONFIG-v2.0.md` |
| Deploy script | `Systack/clients/mcdonalds-gm/deploy-percy-v2.sh` |
| Old config | `Systack/clients/mcdonalds-gm/FINAL-WORKING-CONFIG.md` |
| Playbook | `Systack/clients/mcdonalds-gm/DEPLOYMENT-PLAYBOOK.md` |
| Identity files | `Systack/clients/mcdonalds-gm/percy-workspace/*.md` |

---

*Config v2.0 — Updated based on DOOBY/LOKI local verification*
*Ready for deployment*
