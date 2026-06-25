# SAOS Dashboard Mobile Access Guide

**Document ID:** SYS-MOB-v2.0
**Version:** 2.0
**Status:** PRODUCTION READY
**Prepared for:** SAOS Clients
**Prepared by:** SOL — SyStack Operations Layer
**Date:** June 25, 2026
**Support:** support@systack.net

---

## Overview

The SAOS Dashboard is fully responsive and works on mobile phones and tablets. This guide covers setup for iPhone/iPad and Android devices.

---

## Prerequisites

Before you begin:

- **Tailscale account** — Required for secure network access
- **Dashboard URL** — Provided by your SAOS administrator
- **Client ID + PIN** — Your login credentials

---

## iPhone / iPad Setup

### Step 1: Install Tailscale

1. Open the **App Store**
2. Search for **"Tailscale"**
3. Download and install the app
4. Open Tailscale and sign in with your account

### Step 2: Connect to the Tailnet

1. In the Tailscale app, tap the **toggle** to connect
2. Wait for the status to show **"Connected"**
3. You may need to accept a VPN configuration profile

### Step 3: Access the Dashboard

1. Open **Safari**
2. Type your dashboard URL (e.g., `https://phillips-macbook-air.tail573d57.ts.net/dashboard/`)
3. You should see the SAOS login screen
4. Enter your **Client ID** and **PIN**
5. Tap **Access Dashboard**

### Step 4: Save for Quick Access

**Option A: Add to Home Screen**
1. Tap the **Share** button (square with arrow)
2. Scroll down and tap **"Add to Home Screen"**
3. Name it "SAOS Dashboard" and tap **Add**
4. Now you have a dedicated app icon

**Option B: Bookmark**
1. Tap the **Share** button
2. Tap **"Add Bookmark"**
3. Save to your Bookmarks bar for one-tap access

---

## Android Setup

### Step 1: Install Tailscale

1. Open **Google Play Store**
2. Search for **"Tailscale"**
3. Download and install
4. Open Tailscale and sign in

### Step 2: Connect to the Tailnet

1. In the Tailscale app, tap the toggle to **connect**
2. Wait for **"Connected"** status
3. You may need to accept a VPN configuration

### Step 3: Access the Dashboard

1. Open **Chrome**
2. Type your dashboard URL
3. You should see the SAOS login screen
4. Enter your **Client ID** and **PIN**
5. Tap **Access Dashboard**

### Step 4: Save for Quick Access

**Option A: Add to Home Screen**
1. Tap the **⋮ menu** (three dots)
2. Tap **"Add to Home screen"**
3. Name it "SAOS Dashboard" and tap **Add**

**Option B: Bookmark**
1. Tap the **⋮ menu**
2. Tap the **star icon** (bookmark)
3. Save to your Bookmarks bar

---

## Mobile Features

### Navigation

- **Hamburger menu** (☰) — Tap to open tab navigation
- **Tap outside menu** — Closes the navigation panel
- **Swipe** — Scroll through conversation lists and content

### Chat

- **Tap ☰ in chat header** — Opens conversation sidebar
- **Tap ✕** — Closes the sidebar
- **Tap conversation** — Switches to that thread
- **Tap + New Chat** — Creates a new conversation

### Login

- **PIN fields** — Use numeric keyboard (auto-appears)
- **Tap "First time? Set up your PIN"** — For first-time users with temp PIN
- **Tap "Forgot PIN?"** — To request a reset

---

## Mobile-Specific Optimizations

The dashboard automatically adjusts for mobile:

- **Larger tap targets** — Buttons and links are easy to tap
- **iOS safe areas** — Respects notches, home bars, and status bars
- **No zoom on input** — Input fields use 16px font (prevents iOS auto-zoom)
- **Responsive grids** — Dashboard cards stack vertically on narrow screens
- **Sidebar slides** — Chat sidebar slides in from the left on mobile
- **Compact nav** — Navigation collapses to hamburger menu on small screens

---

## What Works on Mobile

All 7 tabs are fully functional:

| Tab | Mobile Experience |
|-----|-------------------|
| 💬 Chat | Slide-out sidebar, full chat with agents |
| 📊 Dashboard | Stacked metrics, scrollable agent cards |
| 📦 Services | Vertical service cards, scrollable |
| ✅ Tasks | Horizontal scroll table, click rows for detail modal |
| 📋 Activity | Feed layout, tap items for detail modal |
| 📄 Docs | Tap links to download PDFs |
| ⚙️ Settings | Form fields optimized for mobile input |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to server" | Ensure Tailscale is connected |
| Page shows blank white | Check Tailscale connection, refresh page |
| Login fields won't focus | Tap the field again, wait for keyboard |
| PIN keyboard doesn't show | Tap into the field again |
| Sidebar won't open | Tap ☰ in the chat header |
| Page too zoomed in | Pinch to zoom out, or reload page |
| PDF won't open in Safari | Tap and hold, choose "Open in Safari" |
| Dashboard loads slowly | Check mobile data/WiFi signal |

---

## Tips

- **Keep Tailscale connected** — The dashboard requires Tailscale to be active
- **Use WiFi when possible** — Faster than cellular for downloading PDFs
- **Bookmark the login page** — Saves time vs. typing the URL
- **Enable notifications** — If your browser asks, allow notifications for new chat messages

---

*For support, contact support@systack.net or message SOL through your dashboard.*