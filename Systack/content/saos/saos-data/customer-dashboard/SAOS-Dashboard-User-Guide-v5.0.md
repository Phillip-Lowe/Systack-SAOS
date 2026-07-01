# SAOS Dashboard User Guide

**Document ID:** SYS-DASH-UG-v6.0
**Version:** 6.0
**Status:** PRODUCTION READY
**Prepared for:** SAOS Clients
**Prepared by:** SOL — SyStack Operations Layer
**Date:** June 30, 2026
**Support:** support@systack.net

---

## Introduction

The SAOS Client Portal is your command center for monitoring and interacting with your AI agent fleet. This guide covers every tab, the login process, PIN management, and the full client experience.

---

## What's New in v5.0

- **Live Operations Tab** — Real-time agent heartbeat monitoring
- **Activity Audit Trail** — Task lifecycle events, deliverable uploads, and notifications
- **Deliverable Storage** — Upload and download files through the Tasks tab
- **Dynamic Services** — Services update automatically from backend configuration
- **Smart Error Handling** — Friendly retry UI when services are temporarily unavailable

---

## First-Time Onboarding Tour

When you first log in, an **interactive tour** guides you through the dashboard:

| Step | What You See |
|------|-------------|
| 1. 🛰️ Welcome | "Your AI fleet is ready" |
| 2. 💬 Chat | How to start conversations with agents |
| 3. 🔴 Live Ops | Real-time status monitoring |
| 4. 📦 Services | Your tier-specific services |
| 5. ✅ Tasks & Deliverables | Track work and download files |

- **Tap Next** to advance through steps
- **Tap Back** to revisit a step
- **Tap Skip** (top-right) to exit anytime
- The tour shows **once**. To see it again, go to **Settings → Restart Tour**

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

The top navigation bar provides access to **eight sections**:

| Tab | Icon | Purpose |
|-----|------|---------|
| **Chat** | 💬 | Real-time messaging with your AI agents |
| **Dashboard** | 📊 | Fleet status, metrics, agent overview |
| **Services** | 📦 | Your tier-specific services and features |
| **Tasks** | ✅ | Task history, filtering, detail view, file upload/download |
| **Activity** | 📋 | Recent activity log with lifecycle events |
| **Live Ops** | 🔄 | Real-time agent heartbeat status |
| **Docs** | 📄 | Documentation and guides |
| **Settings** | ⚙️ | Account info, PIN management, deployment details |

On mobile, tap the **☰ hamburger menu** to access all tabs. In the Chat tab, tap **📁 Chats** to open the conversation sidebar.

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

### Usage This Month

Below the metrics, your **usage dashboard** displays:

| Metric | What It Tracks |
|--------|---------------|
| Tasks Completed | Successful task completions this month |
| Agent Hours | Total AI processing hours consumed |
| n8n Runs | Automation workflow executions (with limit for Business tier) |
| Deliverables | Files stored (count + MB) |

**Limit indicators**: Metrics turn red when you're above 90% of your plan limit. Unlimited tiers show "Unlimited".

### Service Setup Progress

A **setup checklist** shows the configuration status of each service in your tier:

| Status | Meaning |
|--------|---------|
| ✅ Done | Fully configured and active |
| 🔄 Active | Configuration in progress |
| ⏳ Pending | Not yet set up — click **Setup** in Services tab to start |

The overall progress bar shows what percentage of your services are configured.

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
- **Current plan** badge display

Services are loaded dynamically from the backend — when Systack updates your plan, the changes appear automatically.

---

## Tasks Tab

### Task List

Each task row shows:
- **Task name** (human-readable, e.g., "Invoice Processing Setup")
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

### File Upload & Download

- **Upload deliverables**: Click the paperclip icon in task detail. Select a file from your device. The file is stored securely and linked to the task.
- **Download deliverables**: Files sent by agents appear with a download link in task detail and Activity tab.

**Supported file types**: PDF, images, documents, spreadsheets, code files. Maximum file size varies by plan.

---

## Activity Tab

Shows a real audit trail of events:

- **Task lifecycle events**: Created, started, completed, failed
- **Deliverable uploads**: Files uploaded by you or agents
- **Notifications sent**: Email/iMessage alerts dispatched
- **Login events**: When you accessed the dashboard

Each event shows:
- Status icon (🔄 Running, ⏳ Pending, ✅ Done, ❌ Failed, 💀 Dead, 📁 Upload)
- Event title and detail
- Timestamp
- **Clickable items** → same detail modal as Tasks tab

---

## Live Operations Tab

Real-time monitoring of your agent fleet:

### Agent Heartbeat Status

Each agent card shows:
- **Agent name** and avatar
- **💓 Active** — Agent responded within last 5 minutes (green)
- **⚠️ Stale** — No response in 5+ minutes (yellow, may be processing)
- **🔴 Offline** — Agent not responding (red, check Tasks tab)
- **Last heartbeat** timestamp (e.g., "2m ago", "15s ago")

### When to Use This Tab

- **Before important requests** — Confirm SOL and relevant agents are active
- **After task submission** — Watch agents pick up and process your task
- **Troubleshooting** — If responses are slow, check if agents are stale

---

## Docs Tab

Downloadable PDF documentation:

| Document | Description |
|----------|-------------|
| Quick Start Guide v7.0 | Get started with PIN auth and mobile access |
| Service Manual v7.0 | Complete SAOS system reference |
| Architecture Overview v5.0 | Technical architecture and components |
| Dashboard Mobile Access Guide v3.0 | iPhone and Android mobile setup |
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

### Onboarding Tour

Click **Restart Tour** to see the first-time guided walkthrough again. Useful for new team members or refresher training.

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
- **File upload** — Works on mobile browsers

---

## Troubleshooting

### Can't Log In

| Problem | Solution |
|---------|----------|
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

### "Service Temporarily Unavailable"

The dashboard API may be restarting. Click the **Retry** button or wait 30 seconds and refresh.

### Agent Shows "Stale"

An agent with ⚠️ Stale status hasn't responded in 5+ minutes. This is usually normal — the agent may be processing a large task. Check the Tasks tab to confirm. If stale for 30+ minutes, contact support.

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
| Upload files | Tasks tab → click task → paperclip icon |
| View agent health | Live Ops tab → check heartbeat timestamps |
| View activity history | Activity tab → scroll through events |
| Download docs | Docs tab → click any document |
| View account | Settings tab → Account Info |

---

*For technical support, contact support@systack.net or message SOL through your dashboard chat.*
