# SAOS Dashboard User Guide

**Document ID:** SYS-DASH-UG-v2.0
**Version:** 2.0
**Status:** PRODUCTION READY
**Prepared for:** SAOS Clients
**Prepared by:** SOL — SyStack Operations Layer
**Builder:** SOL + ASSEMBLY
**Source System:** SAOS v2026.06
**Date:** June 24, 2026
**Support:** support@systack.net

---

## Introduction

The SAOS Client Portal is your command center for monitoring and interacting with your AI agent fleet. This guide covers every tab and feature.

---

## Login

Visit your dashboard URL (provided during onboarding). You'll need:

- **Client ID**: Your unique account identifier
- **Access Token**: Optional — if you already have one from a previous session

If you don't have an access token, enter your Client ID and click **Access Dashboard**. The system will authenticate you and issue a token automatically (stored securely in your browser).

---

## Dashboard Navigation

The top navigation bar provides access to five sections:

| Tab | Icon | Purpose |
|-----|------|---------|
| **Chat** | 💬 | Real-time messaging with your AI agents |
| **Dashboard** | 📊 | Fleet status, metrics, agent overview |
| **Services** | 📦 | Your tier-specific services and features |
| **Tasks** | ✅ | Task history and status tracking |
| **Docs** | 📄 | Documentation and guides |

Your current plan is displayed as a colored badge in the top-right (e.g., "Business Fleet").

---

## Chat Tab

Your primary way to interact with the SAOS fleet.

### Starting a Conversation

1. Click **+ New Chat** in the left sidebar
2. Optionally give your conversation a title (e.g., "Invoice Setup" or "Agent Question")
3. The conversation appears in your sidebar

### Sending Messages

- Type your message in the input box at the bottom
- Press **Enter** to send
- Press **Shift+Enter** for a new line in the same message

### What to Ask

Your agents can handle requests like:

- "Set up invoice processing for my accounting system"
- "Draft a response to the customer complaint about late delivery"
- "Summarize my unread emails from today"
- "Create a daily report of new leads"
- "Fix the error in my automation workflow"

### Agent Responses

Messages appear with:
- **Avatar** showing which agent responded
- **Timestamp** (e.g., "just now", "5m ago", "2h ago")
- **Task Badge** if the message created a task (e.g., "Task #42")

### Typing Indicator

When an agent is composing a response, you'll see "SOL is typing" with animated dots.

---

## Dashboard Tab

### Tier Badge

At the top, your current plan is displayed (e.g., Business Fleet $299/mo, Enterprise Fleet $799/mo).

### Metrics Cards

| Metric | What It Shows |
|--------|---------------|
| **Active Tasks** | Currently running agent tasks |
| **Pending** | Tasks waiting for an agent to pick up |
| **Completed** | Total tasks completed |
| **Unread Messages** | New messages from agents you haven't read |

### Agent Fleet

A grid showing all agents assigned to your account:

| Agent | Role | Status |
|-------|------|--------|
| SOL | 🛰️ Orchestrator | Active when coordinating tasks |
| CODY | 💻 Build Engine | Active when building workflows |
| ASSEMBLY | 🛠️ Deployment | Active when deploying systems |
| VALI | ✅ Validation | Active when testing outputs |
| PESSI | ⚠️ Risk Analysis | Active when reviewing for errors |
| ORACLE | 🔮 Design | Active when planning architecture |
| ATLAS | 🗺️ Knowledge | Active when documenting |
| CHATTY | 💬 Communication | Active when drafting responses |
| GENI | 🎨 Creative | Active when generating content |
| JURIS | ⚖️ Legal | Active when reviewing compliance |

---

## Services Tab

**This is where you see exactly what you're paying for.**

### Your Included Services

A grid of cards showing every service included in your tier:

- **Icon** — Visual identifier for the service type
- **Name** — Service title (e.g., "Invoice Processing", "Lead Qualification")
- **Description** — What the service does
- **Status** — 🟢 Active (running) or 🟡 Setup Pending (being configured)

### Infrastructure

Shows your deployment details:

| Item | What It Means |
|------|---------------|
| **Infrastructure** | Cloud VPS or on-premise hardware |
| **AI Models** | Which local models power your agents |
| **Network** | How your data is secured (Tailscale, air-gapped, etc.) |
| **Management** | Who maintains the system |
| **Team Size** | How many users can access the portal |

### Support

| Detail | Your Level |
|--------|------------|
| **Support Channel** | Community forum, Email, Slack, or Phone |
| **Response Time** | From "best effort" to "4-hour SLA" |
| **Setup** | Self-install, Remote, or White-glove on-site |
| **Uptime SLA** | Percentage guaranteed (if applicable) |

---

## Tasks Tab

A complete history of all tasks processed by your agents.

### Task Table

| Column | What It Shows |
|--------|---------------|
| **ID** | Unique task number (e.g., #42) |
| **Type** | Category (e.g., client_request, automation, report) |
| **Agent** | Which agent handled the task |
| **Status** | DONE (green), PENDING (amber), FAILED (red), RUNNING (cyan) |
| **Created** | When the task was submitted |

### Task Creation

Tasks are created automatically when you:
- Send a chat message containing keywords like "create", "build", "fix", "help"
- Submit a request through an integration (email, webhook, etc.)

---

## Documents Tab

Access to all documentation relevant to your account.

### Available Documents

| Document | Purpose |
|----------|---------|
| **Quick Start Guide v3.0** | Get started with SAOS |
| **Service Manual v3.0** | Complete reference for your system |
| **Architecture Overview v2.0** | Technical architecture details |

**Enterprise and Private tier clients also receive:**
- **Enterprise Deployment Guide** — On-premise setup and compliance configuration

---

## Troubleshooting

### "Session Expired"

Your token expired. Click **Logout** and log in again with your Client ID.

### "Failed to Send Message"

- Check that you selected a conversation
- Ensure your message is not empty
- Check network connectivity

### Agent Not Responding

- Check the Dashboard tab to see if agents are online
- Agents may be busy with other tasks
- Try again in a few minutes

### Tasks Stuck in "PENDING"

- This usually means the agent queue is busy
- Tasks are processed in priority order
- Check Dashboard metrics for queue length

---

## Security

- All communication is encrypted via Tailscale VPN tunnel
- Your data never leaves your infrastructure (Private tier) or encrypted cloud VPS (Business/Enterprise)
- Access tokens expire after 30 days
- Log out when finished, especially on shared computers

---

## Contact Support

- **Email**: support@systack.net
- **Dashboard URL**: (your Tailscale URL, provided during onboarding)
- **Response Time**: Per your tier's SLA
