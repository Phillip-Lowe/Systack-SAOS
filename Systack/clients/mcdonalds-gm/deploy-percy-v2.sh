#!/bin/bash
set -e

echo "=== Percy v2.0 Deployment Script ==="
echo "VPS: 4GB RAM | Model: qwen2.5:3b | Context: 4K"
echo "Date: 2026-06-27"
echo ""

# 1. Update system
echo "[1/8] Updating system..."
dnf update -y

# 2. Install Ollama
echo "[2/8] Installing Ollama..."
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.com/install.sh | sh
    systemctl enable ollama
    systemctl start ollama
else
    echo "Ollama already installed, skipping..."
    systemctl start ollama
fi

# 3. Pull model
echo "[3/8] Pulling qwen2.5:3b..."
ollama pull qwen2.5:3b

# 4. Install OpenClaw
echo "[4/8] Installing OpenClaw..."
if ! command -v openclaw &> /dev/null; then
    npm install -g openclaw
fi

# 5. Run non-interactive setup
echo "[5/8] Running OpenClaw setup..."
openclaw onboard --non-interactive --provider ollama --model qwen2.5:3b --no-model-pull

# 6. Write config
echo "[6/8] Writing updated v2.0 config..."
cat > /root/.openclaw/openclaw.json <<'CONFIG_EOF'
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
CONFIG_EOF

# 7. Create workspace with stripped identity files
echo "[7/8] Creating Percy workspace with v2.0 stripped files..."
mkdir -p /root/.openclaw/workspaces/percy
cd /root/.openclaw/workspaces/percy

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
echo "[8/8] Installing and starting OpenClaw service..."
openclaw gateway install
systemctl --user daemon-reload
systemctl --user enable openclaw-gateway
systemctl --user start openclaw-gateway || true

# Open firewall
firewall-cmd --permanent --add-port=18789/tcp 2>/dev/null || true
firewall-cmd --reload 2>/dev/null || true

echo ""
echo "=========================================="
echo "  Percy v2.0 Deployment Complete!"
echo "=========================================="
echo ""
echo "Model:        qwen2.5:3b"
echo "Context:      4,096 tokens"
echo "RAM target:   ~2.8GB used"
echo "Identity:     ~730 words (stripped)"
echo ""
echo "Next steps:"
echo "1. Install Tailscale:"
echo "   curl -fsSL https://tailscale.com/install.sh | sh"
echo ""
echo "2. Authenticate:"
echo "   tailscale up --hostname percy-mcdonalds"
echo ""
echo "3. Enable HTTPS: https://login.tailscale.com/admin/dns"
echo ""
echo "4. Start serving:"
echo "   tailscale serve --bg http://localhost:18789"
echo ""
echo "5. Test from Jacqueline's phone:"
echo "   Send 'Hi Percy' to the Tailscale URL"
echo ""
echo "Verification commands:"
echo "   free -h          # Check RAM"
echo "   ollama ps        # Check model loaded"
echo "   openclaw status  # Check gateway"
echo ""
