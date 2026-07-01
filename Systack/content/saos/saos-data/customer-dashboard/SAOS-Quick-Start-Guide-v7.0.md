# SAOS Quick Start Guide

**Document ID:** SYS-QSG-v7.0
**Version:** 7.0
**Status:** PRODUCTION READY
**Prepared for:** SAOS Clients
**Prepared by:** SOL — SyStack Operations Layer
**Date:** June 30, 2026
**Support:** support@systack.net

---

## What's New in v7.0

- **Live Operations Tab** — Real-time agent status with heartbeat timestamps
- **Dynamic Services** — Your plan services now update automatically from the backend
- **Activity Audit Trail** — See task lifecycle events, deliverable uploads, and notifications
- **Smart Error Handling** — Dashboard shows friendly retry UI if a service is temporarily unavailable
- **Deliverable Storage** — Upload and download files directly through your Tasks tab

---

## Step 1: Get Your Credentials

After subscribing to SAOS, your administrator will provide:

| Item | Description |
|------|-------------|
| **Client ID** | Your unique account number (e.g., `1`) |
| **Temporary PIN** | A 6-digit code sent via email (valid for 24 hours) |
| **Dashboard URL** | Your Tailscale-secured access link |

---

## Step 2: Set Up Your PIN (First Time Only)

1. Visit your dashboard URL on your computer or mobile device
2. Click **"First time? Set up your PIN"**
3. Enter:
   - **Client ID**: Your account number
   - **Temporary PIN**: The 6-digit code from your email
   - **New PIN**: Choose a permanent PIN (4–10 digits)
   - **Confirm New PIN**: Re-enter to confirm
4. Click **Set PIN & Continue**
5. You'll be automatically logged in

---

## Step 3: Log In (Returning Users)

1. Visit your dashboard URL
2. Enter your **Client ID** and **PIN**
3. Click **Access Dashboard**
4. Your session lasts 30 days — no need to log in repeatedly

---

## Step 4: Explore Your Dashboard

Your dashboard has **8 tabs**:

| Tab | What You Do |
|-----|-------------|
| 💬 **Chat** | Message your AI agents, create tasks, get updates |
| 📊 **Dashboard** | See fleet status, metrics, and all 10 agents |
| 📦 **Services** | View your plan's included services and infrastructure |
| ✅ **Tasks** | Track task progress, filter by status, click for details |
| 📋 **Activity** | See the last 50 events: tasks, deliverables, notifications |
| 🔄 **Live Ops** | Real-time agent heartbeats — see who's active right now |
| 📄 **Docs** | Download PDF guides and technical documentation |
| ⚙️ **Settings** | View account info and change your PIN |

---

## Step 5: Start Your First Conversation

1. Go to the **Chat** tab
2. Click **+ New Chat** in the sidebar
3. Type your request (e.g., "I need help setting up invoice processing")
4. Press **Enter** to send
5. An agent will respond and may create a task automatically

---

## Step 6: Check Your Tasks

1. Go to the **Tasks** tab
2. Use filter buttons to see **Pending**, **Running**, **Done**, or **Failed** tasks
3. Click any task to see full details
4. **Upload deliverables** — Click the paperclip icon in task detail to upload files
5. **Download deliverables** — Files sent by agents appear with download links

---

## Step 7: Watch Live Operations

The **Live Ops** tab shows your agent fleet in real time:

- **💓 Active** — Agent responded recently (green)
- **⚠️ Stale** — No response in 5+ minutes (yellow)
- **🔴 Offline** — Agent not responding (red)

Use this tab to confirm your fleet is healthy before important requests.

---

## Step 8: Download Documentation

1. Go to the **Docs** tab
2. Download the **Dashboard User Guide** for complete feature reference
3. Download the **Mobile Access Guide** for iPhone/Android setup

---

## Mobile Access

### iPhone / iPad

1. Install **Tailscale** from the App Store
2. Sign in with your Tailscale account
3. Connect to the tailnet
4. Open Safari → visit your dashboard URL
5. Bookmark for quick access

### Android

1. Install **Tailscale** from Google Play
2. Sign in and connect
3. Open Chrome → visit your dashboard URL

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid PIN" | Try again or use **Forgot PIN?** on the login screen |
| "PIN not set" | You need a temporary PIN from your administrator first |
| "Temporary PIN expired" | Contact your administrator for a new one |
| "Client not found" | Check your Client ID — it's a number, not your name |
| Dashboard won't load | Ensure you're connected to **Tailscale** |
| "Service Temporarily Unavailable" | The API is restarting — click **Retry** or wait 30 seconds |
| Agent shows "Stale" | Agent may be processing a large task — check Tasks tab |

---

## Quick Reference

| Action | How |
|--------|-----|
| First time login | Click **"Set up your PIN"** |
| Regular login | Client ID + PIN |
| Reset PIN | Click **"Forgot PIN?"** → enter Client ID + email |
| Change PIN | Settings tab → Security → Change PIN |
| Message agents | Chat tab → New Chat → type message |
| View task details | Tasks tab → click any task row |
| Upload a file | Tasks tab → click task → paperclip icon |
| View agent health | Live Ops tab → check heartbeat timestamps |
| View activity history | Activity tab → scroll through events |
| Download docs | Docs tab → click any document |

---

*For technical support, contact support@systack.net or message SOL through your dashboard chat.*
