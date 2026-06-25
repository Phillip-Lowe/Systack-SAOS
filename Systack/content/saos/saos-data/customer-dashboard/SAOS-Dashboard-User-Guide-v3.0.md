# SAOS Dashboard User Guide

**Document ID:** SYS-DASH-UG-v3.0
**Version:** 3.0
**Status:** PRODUCTION READY
**Prepared for:** SAOS Clients
**Prepared by:** SOL — SyStack Operations Layer
**Builder:** SOL + ASSEMBLY
**Source System:** SAOS v2026.06
**Date:** June 25, 2026
**Support:** support@systack.net

---

## Introduction

The SAOS Client Portal is your command center for monitoring and interacting with your AI agent fleet. This guide covers every tab, the login process, PIN management, and the full client experience.

---

## Getting Started — First Time Login

### Step 1: Receive Your Invitation

When your SAOS account is created, your administrator will provide you with:

- **Client ID**: Your unique account number (e.g., `1`)
- **Temporary PIN**: A 6-digit code (valid for 24 hours)
- **Dashboard URL**: Your Tailscale-secured access link

### Step 2: Set Up Your Permanent PIN

1. Visit your dashboard URL
2. Click **"First time? Set up your PIN"**
3. Enter your Client ID and Temporary PIN
4. Choose a permanent PIN (4–10 digits)
5. Confirm your new PIN
6. Click **Set PIN & Continue**
7. You'll be automatically logged in

### Step 3: Regular Login

After setup, simply enter your **Client ID** and **PIN Code** on the login screen.

**Forgot your PIN?** Click **"Forgot PIN?"** on the login screen, enter your Client ID and registered email. A reset code will be generated and sent by your administrator.

---

## Dashboard Navigation

The top navigation bar provides access to **seven sections**:

| Tab | Icon | Purpose |
|-----|------|---------|
| **Chat** | 💬 | Real-time messaging with your AI agents |
| **Dashboard** | 📊 | Fleet status, metrics, agent overview |
| **Services** | 📦 | Your tier-specific services and features |
| **Tasks** | ✅ | Task history, filtering, and detail view |
| **Activity** | 📋 | Recent activity log with clickable items |
| **Docs** | 📄 | Documentation and guides |
| **Settings** | ⚙️ | Account info, PIN management, deployment details |

On mobile, tap the **☰ hamburger menu** to access all tabs.

---

## Chat Tab

Your primary way to interact with the SAOS fleet.

### Starting a Conversation

1. Click **+ New Chat** in the left sidebar
2. Optionally give your conversation a title
3. The conversation appears in your sidebar

### Sending Messages

- Type your message in the input box at the bottom
- Press **Enter** to send
- Press **Shift+Enter** for a new line

### What to Ask

Your agents can handle requests like:

- "Set up invoice processing for my accounting system"
- "Draft a response to the customer complaint about late delivery"
- "Summarize my unread emails from today"
- "Create a daily report of new leads"
- "Fix the error in my automation workflow"

### Agent Responses

Messages appear with:
- **Avatar** showing which agent responded (🛰️ SOL, 💻 CODY, etc.)
- **Timestamp** (e.g., "just now", "5m ago", "2h ago")
- **Task Badge** if the message created a task (e.g., "Task #42")

### Automatic Task Creation

When your message contains action words like "create", "build", "fix", "deploy", or "update", the system automatically creates a task and assigns it to SOL. A system message confirms the task creation in chat.

---

## Dashboard Tab

### Metrics Overview

Four metric cards show:
- **Active Tasks**: Currently being processed by agents
- **Pending**: Tasks awaiting agent assignment
- **Completed**: All-time completed tasks
- **Unread Messages**: Messages from agents you haven't read

### Agent Fleet

Each agent card displays:

| Element | Description |
|---------|-------------|
| **Avatar** | Emoji icon (🛰️ SOL, 💻 CODY, 🛠️ ASSEMBLY, etc.) |
| **Name** | Agent identifier |
| **Status** | IDLE, BUSY, ERROR, or OFFLINE |
| **Role** | Short title (e.g., "System Operations Liaison") |
| **Description** | Full explanation of what the agent does |
| **Capabilities** | Tag list of specific skills |

**Click any agent card** to see a detailed modal with full capabilities and status information.

### Your 10-Agent Fleet

| Agent | Role | What They Do |
|-------|------|-------------|
| 🛰️ SOL | System Operations Liaison | Main point of contact. Coordinates the fleet, handles strategic requests. |
| 💻 CODY | Code Agent | Writes, reviews, and deploys code. Website changes, API integrations. |
| 🛠️ ASSEMBLY | Integration Builder | Connects your tools. Workflows between Stripe, Slack, email, databases. |
| ✅ VALI | Validation Agent | Quality control. Reviews code, tests automations, verifies data integrity. |
| ⚠️ PESSI | Risk Agent | Identifies what could go wrong. Edge cases, security risks, failure modes. |
| 🔮 ORACLE | Research Agent | Deep research, analysis, strategic evaluation. Technology assessment. |
| 🗺️ ATLAS | Deployment Agent | Infrastructure and DevOps. Servers, Tailscale, keeps systems running. |
| 💬 CHATTY | Communication Agent | Messaging, outreach, content creation. Drafts emails, social posts. |
| 🎨 GENI | Creative Agent | Images, videos, creative assets. Marketing visuals and multimedia. |
| ⚖️ JURIS | Legal & Compliance | Reviews for compliance, audits configs, ensures legal requirements are met. |

---

## Services Tab

Shows services included in your plan tier:

- **Active services** (🟢) are currently running
- **Setup Pending** services (🟡) require configuration

Also displays:
- **Infrastructure** details (VPS, AI models, network)
- **Support** information (channel, response time, SLA)

---

## Tasks Tab

### Task List

Each task row shows:
- **Task name** (human-readable, e.g., "Client Request" instead of "client_request")
- **Description** (what the task actually does)
- **Task ID** and **Priority** badges
- **Assigned agent**
- **Status** (PENDING, RUNNING, DONE, FAILED, DEAD)
- **Created timestamp**

### Task Filtering

Filter buttons at the top let you quickly filter by status:
- **All** — Show all tasks
- **Pending** — Awaiting agent
- **Running** — Currently processing
- **Done** — Completed successfully
- **Failed** — Encountered an error

### Task Detail View

**Click any task row** to open a detail modal showing:
- Full task name and description
- Status badge
- Assigned agent
- Priority level
- Created and completed timestamps
- Error messages (if any)

---

## Activity Tab

Shows the 20 most recent tasks as an activity feed with:
- Status icon (🔄 Running, ⏳ Pending, ✅ Done, ❌ Failed, 💀 Dead)
- Task name and ID
- Description preview
- Status pill and assigned agent
- Timestamp

**Click any activity item** to see the full task detail modal.

---

## Docs Tab

Downloadable PDF documentation:

| Document | Description |
|----------|-------------|
| Quick Start Guide v4.0 | Get started with PIN auth and mobile access |
| Service Manual v4.0 | Complete SAOS system reference |
| Architecture Overview v3.0 | Technical architecture and components |
| Dashboard Mobile Access Guide | iPhone and Android mobile setup |
| Enterprise Deployment Guide | On-premise setup (Enterprise/Private tiers only) |

---

## Settings Tab

### Account Information

View your:
- Client ID
- Name and email
- Current plan tier (with badge)
- Account status

### Security — Change PIN

1. Click **Change PIN** button
2. Enter your current PIN
3. Enter your new PIN (4–10 digits)
4. Click **Update PIN**
5. Confirmation message appears

### Deployment Info

View your:
- Deployment type (vultr, on-premise, etc.)
- VPS status
- Tailscale access URL (if configured)

---

## Mobile Access

### iPhone/iPad

1. Install **Tailscale** from the App Store
2. Sign in with your Tailscale account
3. Connect to the tailnet
4. Open Safari and visit your dashboard URL
5. Bookmark for quick access

### Android

1. Install **Tailscale** from Google Play
2. Sign in and connect
3. Open Chrome and visit your dashboard URL

### Mobile Features

- **Hamburger menu** for tab navigation
- **Slide-out sidebar** for chat conversations
- **Touch-optimized** input areas (prevents iOS zoom)
- **Responsive layout** — all tabs work on mobile

---

## Troubleshooting

### Can't Log In

| Problem | Solution |
|---------|---------|
| "Invalid PIN" | Check your PIN. Try again or use the Forgot PIN flow |
| "PIN not set" | You need a temporary PIN from your administrator first |
| "Temporary PIN has expired" | Contact your administrator for a new one |
| "Client not found" | Check your Client ID — it's a number, not your name |

### Session Expired

If you see "Session expired", you'll be automatically logged out. Simply log back in with your Client ID and PIN. Sessions last 30 days.

### Page Won't Load

- Ensure you're connected to **Tailscale** (required for remote access)
- Check with your administrator that the dashboard service is running
- Try refreshing the page

---

## Quick Reference

| Action | How |
|--------|-----|
| Log in | Client ID + PIN |
| First time setup | Click "First time? Set up your PIN" |
| Reset PIN | Click "Forgot PIN?" → enter Client ID + email |
| Change PIN | Settings tab → Security → Change PIN |
| Message agents | Chat tab → New Chat → type message |
| View tasks | Tasks tab → click any row for details |
| View agent info | Dashboard tab → click any agent card |
| Download docs | Docs tab → click any document |
| View account | Settings tab → Account Info |

---

*For technical support, contact support@systack.net or message SOL through your dashboard chat.*