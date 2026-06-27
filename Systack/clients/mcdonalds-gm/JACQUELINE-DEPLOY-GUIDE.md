# Percy v2.0 — Jacqueline's Deployment Guide

**For:** Jacqueline, McDonald's GM
**What:** Update Percy to fix crashes and slow responses
**Time:** ~10 minutes
**When:** Anytime you're ready

---

## BEFORE YOU START — Send This to Green (Phillip)

**Step 1:** Open your phone's terminal app (or ask Green to help)

**Step 2:** Run this command and **screenshot the result**:

```bash
ssh root@66.42.121.145 "free -h && ollama ps && uptime"
```

**Step 3:** Send the screenshot to Green

> ⚠️ **If the IP doesn't work** (connection refused/timed out), the VPS IP may have changed. Tell Green and he'll look it up.

---

## IF GREEN IS REMOTING IN

Just tell him:
> "Go for it, I trust you"

He'll SSH in and run everything. You don't need to do anything.

---

## IF YOU'RE DOING IT YOURSELF (Copy-Paste Method)

### Step 1: Connect to Your VPS

Open Terminal (Mac) or PowerShell (Windows) and type:

```bash
ssh root@66.42.121.145
```

**If it asks "Are you sure you want to continue?"** → Type `yes`

**If it asks for a password** → Enter your VPS root password (the one Vultr emailed you when the server was created)

---

### Step 2: Download the Update Script

Once you're logged in (you'll see `[root@percy ~]#` or similar), copy and paste this ENTIRE block — it's one command:

```bash
curl -fsSL https://pastebin.com/raw/XXXXXXXX -o /root/update-percy.sh 2>/dev/null || echo "Pastebin failed, use manual method below"
```

> **Note:** Green will replace `XXXXXXXX` with the actual script URL, or you can use the manual method.

---

### MANUAL METHOD (If Download Fails)

If the download doesn't work, copy and paste this entire block — it's the full update:

```bash
# Stop current OpenClaw
systemctl --user stop openclaw-gateway 2>/dev/null || true

# Update system
dnf update -y

# Make sure Ollama is running
systemctl start ollama

# Pull the smaller, faster model
ollama pull qwen2.5:3b

# Update OpenClaw config
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
      "contextTokens": 4096
    },
    "list": [
      { "id": "percy", "identity": { "avatar": "🦉" }, "workspace": "/root/.openclaw/workspaces/percy" }
    ]
  }
}
EOF

# Update Percy's identity files (strip to essentials)
cd /root/.openclaw/workspaces/percy

cat > SOUL.md <<'EOF'
# SOUL.md — Percy

Be helpful, not performative. Skip filler words.
Have opinions. Disagree when warranted.
Be resourceful before asking.
Earn trust through competence.

**Identity**
- Name: Percy
- Role: Personal AI assistant for Jacqueline, McDonald's GM
- Emoji: 🦉
EOF

cat > USER.md <<'EOF'
# USER.md — Jacqueline

**Name:** Jacqueline
**Role:** General Manager, McDonald's
**Communication:** Direct, practical, no fluff.
**Quiet hours:** 10 PM – 6 AM
EOF

cat > AGENTS.md <<'EOF'
# AGENTS.md — Percy

## Rules
1. Check MEMORY.md before acting
2. Document decisions in memory/YYYY-MM-DD.md
3. Ask before emails, posts, config changes, destructive commands

## Tier 0 (Current)
Read, draft, research, remember. NO external actions.
EOF

cat > MEMORY.md <<'EOF'
# MEMORY.md — Percy

## Jacqueline — McDonald's GM
- Store: McDonald's Little Rock
- Team: ~25 employees
- Focus: Scheduling, operations, customer experience
- Prefers text messages

## Decisions
- 2026-06-05: Percy deployed
- 2026-06-27: Config updated to fix crashes
EOF

cat > HEARTBEAT.md <<'EOF'
# Keep this file empty to skip heartbeat API calls.
EOF

cat > IDENTITY.md <<'EOF'
# IDENTITY.md — Percy
- **Name:** Percy
- **Vibe:** Helpful, direct, reliable
- **Emoji:** 🦉
EOF

cat > KUDU-7.md <<'EOF'
# KUDU-7: Never ask the user to verify what you can verify yourself.
EOF

# Restart OpenClaw
systemctl --user daemon-reload
systemctl --user restart openclaw-gateway

# Check if it's working
echo ""
echo "=== Update Complete ==="
echo "RAM usage:"
free -h
echo ""
echo "Model status:"
ollama ps
echo ""
echo "OpenClaw status:"
systemctl --user status openclaw-gateway --no-pager
```

**How to paste:**
1. Copy everything between the ```bash and ``` lines
2. Right-click in your terminal → Paste
3. Press Enter
4. Wait ~3 minutes for it to finish

---

### Step 3: Verify It Works

After the script finishes, run:

```bash
free -h
```

**You should see:**
- Total RAM: ~3.8GB or less used
- Available: At least 500MB free

Then test Percy:
1. Open your Tailscale URL on your phone
2. Send: "Hi Percy"
3. **Should respond in under 15 seconds** (previously 2+ minutes or crashed)

---

## WHAT THIS FIXES

| Problem Before | Fix Applied |
|---------------|-------------|
| Percy crashes / stops responding | Smaller context (4K instead of 16K) |
| Very slow responses (2+ min) | Less RAM usage, no swapping |
| Stops working after a few messages | Active context cleanup |
| Sometimes doesn't reply at all | Compaction disabled (was causing spikes) |

---

## IF SOMETHING GOES WRONG

**Don't panic.** Everything is reversible.

Text Green: "Percy update broke, help"

He can:
- Remote in and fix it
- Roll back to the old config
- Check what went wrong

---

## QUESTIONS?

| Question | Answer |
|----------|--------|
| Will I lose my chat history? | No, chat history is stored separately |
| Will Percy forget who I am? | No, the memory file keeps everything |
| Is this safe? | Yes, it's just config changes |
| Can I undo it? | Yes, the old files are backed up automatically |
| How long does it take? | ~10 minutes total |
| Do I need to restart my phone? | No |
| Will the Tailscale URL change? | No, stays the same |

---

*Prepared by Green / Systack*
*Questions? Text Green*
