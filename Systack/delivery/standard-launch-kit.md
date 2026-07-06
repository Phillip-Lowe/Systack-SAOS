# SAOS Standard Launch Kit

*The complete client onboarding and support package for SAOS deployments.*

---

## Section 1: Welcome Guide

### Welcome to SAOS

**SAOS (Systack Agent Operating System)** is an AI operations system that automates the repetitive, time-consuming tasks that slow your business down. From invoice processing to lead qualification, support drafting to document classification — SAOS handles the work so your team can focus on what matters: growing your business.

### What's Included in Your Tier

#### ✅ Business Tier ($299/month)
- [ ] **Customer Portal** — Secure login, real-time dashboard, document downloads
- [ ] **Invoice Processing Pipeline** — Automatic PDF extraction, data entry, dashboard tracking
- [ ] **Lead Qualification Bot** — AI scoring, instant alerts, notification routing
- [ ] **Support Drafting** — AI-generated response drafts for faster ticket resolution
- [ ] **Standard Support** — Email support, 24-hour response time
- [ ] **Weekly Reports** — Automated summary reports via email

#### ✅ Enterprise Tier ($799/month)
- **Everything in Business, plus:**
- [ ] **Document Classification** — OCR, auto-categorization, intelligent search
- [ ] **Scheduled Report Generator** — Custom reports, multiple formats, scheduled delivery
- [ ] **Command Center Access** — Admin dashboard, health monitoring, user management
- [ ] **Priority Support** — 4-hour critical response, direct escalation line
- [ ] **After-Hours Support** — 24/7 emergency coverage
- [ ] **Custom Feature Development** — Up to 2 custom workflows per quarter

### How to Log In

| Component | URL | Login Method |
|-----------|-----|--------------|
| Customer Portal | `https://portal.saos.systack.net` | Client ID + PIN |
| Command Center (Enterprise) | `https://command.saos.systack.net` | Client ID + PIN + MFA |

**Your Credentials:**
- **Client ID:** Provided in your welcome email
- **PIN:** Temporary PIN sent separately (change on first login)
- **MFA Setup:** Required for Enterprise (scan QR code with Google Authenticator)

**First Login Steps:**
1. Visit your portal URL
2. Enter Client ID and temporary PIN
3. Change your PIN to a secure 6-digit code
4. Enterprise: Scan MFA QR code
5. Save recovery codes (printed or password manager)

### Where to Get Help

| Channel | How to Access | Response Time |
|---------|--------------|---------------|
| **Email Support** | support@systack.net | 24 hours (Business), 4 hours (Enterprise) |
| **In-App Chat** | Chat icon in portal | Real-time during business hours |
| **Phone** | +1-501-274-6231 (Green) | Business hours (9 AM–6 PM CDT) |
| **Emergency Line** | Enterprise only | 24/7 for critical outages |

**Business Hours:** Monday–Friday, 9 AM–6 PM Central Time

### Your First 48 Hours

#### Hour 0–24: Access & Setup
- ✅ Receive welcome email with credentials
- ✅ Log in to Customer Portal
- ✅ Change temporary PIN
- ✅ Enterprise: Complete MFA setup
- ✅ Bookmark portal URL and save support contacts

#### Hour 24–48: First Experience
- ✅ Review your dashboard (sample data pre-loaded)
- ✅ Check first automated invoice or lead (if provisioned)
- ✅ Submit a test support ticket (optional)
- ✅ Review training video outline (Section 5)

**What to Expect:**
- Data will appear gradually as systems connect and process
- Some features need configuration before full activation
- Your Systack contact will reach out within 24 hours to schedule onboarding
- Questions are expected — this is new technology, and we're here to help

---

## Section 2: Implementation Guide

### Deployment Checklist

#### Pre-Deployment: What Systack Needs From You

| Service | What You Provide | Format |
|---------|-----------------|--------|
| **Invoice Processing** | Email address where invoices arrive | email@company.com |
| | Invoice format samples (PDF) | 2–3 example files |
| | Chart of accounts / vendor list | CSV or Excel |
| **Lead Qualification** | Website contact form URL | https://... |
| | CRM webhook endpoint (if any) | https://... |
| | Lead scoring criteria | Written requirements |
| **Support Drafting** | Support ticket system access | Login credentials |
| | Common response templates | Text files |
| | Product/service documentation | Links or files |
| **Document Classification** | Document types you process | List (e.g., contracts, invoices, HR docs) |
| | Sample documents for training | 5–10 per type |
| | Retention requirements | Days/months/years |
| **Report Generator** | Report types needed | List with fields |
| | Delivery schedule | Daily/weekly/monthly |
| | Recipient email addresses | CSV list |

#### Post-Deployment: What You Receive From Systack

| Item | Description | Timeline |
|------|-------------|----------|
| **VPS IP Address** | Your dedicated server | Day 1 |
| **Tailscale Invite** | Secure network access | Day 1 |
| **Dashboard URL** | Your branded portal | Day 1 |
| **Service Credentials** | Login details for each service | Day 2 |
| **API Documentation** | Integration endpoints | Day 3 |
| **Test Data** | Sample records for validation | Day 3 |

### Typical Implementation Timeline

#### Days 1–3: Provisioning
- **Day 1:** VPS provisioned, Tailscale network configured, portal deployed
- **Day 2:** Service containers built, databases initialized, credentials generated
- **Day 3:** Internal connectivity tested, basic health checks passing

#### Days 4–7: Configuration
- **Day 4:** Email integration configured (invoices, notifications)
- **Day 5:** Form endpoints connected (leads, support)
- **Day 6:** Document types and categories defined
- **Day 7:** Report templates built and scheduled

#### Days 8–14: Testing
- **Days 8–10:** End-to-end testing with sample data
- **Days 11–12:** Client validation and feedback
- **Days 13–14:** Bug fixes and adjustments

#### Day 15: Go-Live
- Final health check
- Production data flow begins
- Monitoring activated
- Handoff to ongoing support

### Go/No-Go Criteria

#### Critical (Must Pass)
- [ ] Portal login works with Client ID + PIN
- [ ] MFA functional (Enterprise)
- [ ] Invoice emails are received and processed
- [ ] At least 1 invoice shows correct extracted data in dashboard
- [ ] Lead form submissions route to dashboard with scores
- [ ] Support tickets generate AI drafts
- [ ] No critical security vulnerabilities (SSL, auth, injection)

#### Important (Should Pass)
- [ ] Documents upload and classify correctly (>90% accuracy)
- [ ] Reports generate and email successfully
- [ ] Dashboard shows real-time data within 5 minutes of event
- [ ] Mobile access works (responsive design)
- [ ] Backup verification completes successfully

#### Nice to Have (Can Launch Without)
- [ ] Custom branding fully applied
- [ ] Advanced analytics configured
- [ ] Additional user accounts created

---

## Section 3: FAQ

### "What if the AI makes a mistake?"

AI is powerful but not perfect. Every automated action in SAOS is designed with human oversight:

- **Invoice Processing:** Extracted data is flagged with confidence scores. Low-confidence fields are highlighted for review.
- **Lead Scoring:** Scores are suggestions, not decisions. Your team always makes the final call.
- **Support Drafting:** AI generates a draft, but a human must approve before sending.
- **Document Classification:** Misclassified documents can be re-tagged, and the system learns from corrections.

**Correction Process:** Click "Flag for Review" on any automated result. Our team investigates within 24 hours and retrains the model if needed.

### "Is my data safe?"

Yes. SAOS implements multiple layers of security:

- **Encryption:** All data encrypted in transit (TLS 1.3) and at rest (AES-256)
- **Access Control:** Role-based permissions (RBAC) with 5 permission levels
- **Authentication:** PIN-based login with optional MFA (Enterprise)
- **Rate Limiting:** Per-endpoint request limits with automatic blocking
- **Audit Logging:** Every action logged with timestamp, user, and action
- **Local Processing:** AI models run on your own VPS — your data never leaves your infrastructure

### "What happens if the system goes down?"

- **Uptime Commitment:** 99.5% monthly uptime for Business, 99.9% for Enterprise
- **Monitoring:** We monitor all services 24/7 from our Command Center
- **Alerting:** Automatic alerts to Systack team on any service degradation
- **Recovery:** Most issues resolve within 15 minutes. Critical issues within 4 hours.
- **Communication:** Status updates posted to your portal and emailed to admins
- **Data Safety:** Daily backups with 6-minute recovery time if needed

### "Can I export my data?"

Yes, anytime. Your data is yours.

- **Format:** JSON, CSV, or SQLite database dump
- **Delivery:** Download link via email within 24 hours of request
- **Scope:** All data or specific date ranges
- **Cost:** No charge for standard exports. Complex custom exports may incur fee.

### "How do I add a new user?"

- **Business:** Contact Systack support. We'll add users within 24 hours.
- **Enterprise:** Use the Command Center User Management tab. Add users instantly.
- **User Types:** Admin (full access), Manager (read + modify), Viewer (read-only)
- **Cost:** Up to 5 users included in Business. Unlimited in Enterprise.

### "What if I want to cancel?"

- **Notice:** 30 days written notice
- **Data Export:** Full export provided within 30 days of cancellation
- **Refund:** 30-day satisfaction guarantee for new clients. Prorated refund for annual plans.
- **No Hard Feelings:** We want you to succeed, even if that's not with us.

### "Do I need technical knowledge?"

No. SAOS is designed for business owners, not engineers.

- **Setup:** Systack handles all technical setup
- **Training:** Included in onboarding (1 hour session)
- **Support:** Available via email, chat, or phone
- **Dashboard:** Intuitive, no-code interface
- **Enterprise:** Includes priority support and custom training

### "What's the difference between Business and Enterprise?"

| Feature | Business ($299/mo) | Enterprise ($799/mo) |
|---------|---------------------|---------------------|
| Users | Up to 5 | Unlimited |
| Support | 24-hour response | 4-hour critical, 24-hour standard |
| After-Hours | ❌ | ✅ 24/7 emergency |
| Document Classification | ❌ | ✅ |
| Scheduled Reports | Basic | Custom |
| Command Center | ❌ | ✅ |
| Custom Workflows | ❌ | Up to 2/quarter |
| SLA | 99.5% uptime | 99.9% uptime |

### "How do I contact support?"

- **Email:** support@systack.net (24-hour response)
- **Chat:** In-app chat icon in your portal (business hours)
- **Phone:** +1-501-274-6231 (business hours)
- **Emergency:** Enterprise clients have 24/7 emergency line

### "Can you add custom features?"

- **Business:** Standard features only. Request features for future roadmap consideration.
- **Enterprise:** Up to 2 custom workflows per quarter included. Additional custom development at $150/hour.
- **Process:** Submit feature request → Systack evaluates → Quote provided → Development begins

---

## Section 4: Support Guide

### How to Open a Support Ticket

**Best Method: Email**
- Send to: support@systack.net
- Subject: [URGENT] or [STANDARD] + brief description
- Include: Screenshot, error message, steps to reproduce, Client ID

**Alternative: In-App Chat**
- Click chat icon in portal
- Describe issue
- Attach screenshots if applicable
- Response within business hours

**Phone (Business Hours)**
- Call: +1-501-274-6231
- Best for: Urgent issues, complex questions, walkthroughs

### What to Include in a Support Request

Every support request should include:
1. **Client ID** (found in portal settings)
2. **Service affected** (invoice processing, leads, etc.)
3. **What happened** (specific description)
4. **What you expected** (expected behavior)
5. **Steps to reproduce** (if applicable)
6. **Screenshots** (if UI-related)
7. **Error messages** (copy-paste exact text)
8. **When it started** (first noticed, how often)

### Response Time Commitments

| Priority | Definition | Business | Enterprise |
|----------|-----------|----------|------------|
| **Critical** | Service completely down, no workaround | 24 hours | 4 hours |
| **High** | Major feature broken, workaround exists | 48 hours | 24 hours |
| **Standard** | Minor issue, feature request | 72 hours | 48 hours |
| **Low** | Question, documentation request | 1 week | 72 hours |

### Escalation Process

1. **Level 1:** Submit ticket to support@systack.net
2. **Level 2:** If unresolved in committed time, auto-escalates to Green
3. **Level 3:** If still unresolved, scheduled call with Green
4. **Enterprise:** Direct line to Green for critical issues

### Emergency Contacts

- **Green (Founder):** +1-501-274-6231
- **Support Email:** support@systack.net
- **Emergency Line:** Enterprise clients only

### After-Hours Support (Enterprise Only)

- **Coverage:** 24/7 for critical issues
- **Response:** Within 1 hour for critical outages
- **Method:** Emergency line → Green paged
- **Scope:** Service outages, data loss, security incidents

---

## Section 5: Training Videos Outline

### Video 1: "How to Review Auto-Processed Invoices"
**Key Points:**
- Where invoices appear in dashboard
- How to verify extracted data
- Confidence scores and what they mean
- How to flag errors for review
- Bulk approval workflow

**Screen Recording Notes:**
- Show invoice list view
- Click into single invoice detail
- Point out vendor name, total, line items
- Show confidence indicators (green/yellow/red)
- Demonstrate "Approve" and "Flag" buttons
- Show bulk actions

**Common Mistakes:**
- Approving without checking totals
- Ignoring yellow confidence flags
- Not updating vendor list when new vendors added

---

### Video 2: "Understanding Your Lead Scores"
**Key Points:**
- What lead scoring means
- How scores are calculated
- Hot vs warm vs cold leads
- What to do with each score level
- How to customize scoring criteria

**Screen Recording Notes:**
- Show leads dashboard
- Point out score column and color coding
- Click into lead detail
- Show score breakdown (source, engagement, fit)
- Demonstrate filtering by score

**Common Mistakes:**
- Calling cold leads first
- Ignoring high-scoring leads
- Not updating lead status after contact

---

### Video 3: "Using AI Drafts for Faster Responses"
**Key Points:**
- How AI drafts are generated
- When to use vs. when to write from scratch
- How to customize drafts
- Sending drafts directly vs. editing first
- Training the AI on your tone

**Screen Recording Notes:**
- Show support ticket queue
- Click "Generate Draft" button
- Show draft appearing in compose area
- Demonstrate editing the draft
- Show "Send" vs "Save as Template"

**Common Mistakes:**
- Sending drafts without reading
- Not providing feedback on bad drafts
- Expecting perfect drafts on first day

---

### Video 4: "Finding Documents Instantly"
**Key Points:**
- Uploading documents
- How classification works
- Search by category, date, content
- Tagging and organizing
- Downloading and sharing

**Screen Recording Notes:**
- Show upload area
- Demonstrate drag-and-drop upload
- Show classification happening
- Show search bar and filters
- Demonstrate advanced search (date range, type)

**Common Mistakes:**
- Not uploading documents (system can't classify what it doesn't have)
- Expecting instant search on newly uploaded docs (takes 30 seconds)
- Not using tags for organization

---

### Video 5: "Reading Your Weekly Reports"
**Key Points:**
- Report delivery (email + portal)
- Key metrics explained
- Historical comparison
- Customizing report content
- Sharing reports with team

**Screen Recording Notes:**
- Show email with report attachment
- Open PDF report
- Point out key sections (summary, details, trends)
- Show portal report archive
- Demonstrate report customization

**Common Mistakes:**
- Not reading reports (missing important trends)
- Not sharing with team
- Not comparing week-over-week

---

### Video 6: "Navigating Your SAOS Dashboard"
**Key Points:**
- Dashboard layout overview
- Real-time metrics
- Navigation menu
- User profile and settings
- Mobile access

**Screen Recording Notes:**
- Show login screen
- Show main dashboard after login
- Point out navigation sidebar
- Show each major section (invoices, leads, support, docs, reports)
- Show mobile view (responsive design)
- Show profile settings

**Common Mistakes:**
- Not checking dashboard regularly
- Missing alerts and notifications
- Not updating profile information

### Video Distribution
- **Primary:** YouTube unlisted (private link, not searchable)
- **Backup:** Loom (if YouTube upload fails)
- **Portal:** Embedded in dashboard help section
- **Format:** 1080p MP4, 5 minutes each, with captions

---

## Section 6: Pricing and Billing FAQ

### What's Included in Each Tier

**Business ($299/month):**
- Customer Portal access
- Invoice Processing Pipeline
- Lead Qualification Bot
- Support Drafting
- Standard support (24-hour response)
- Weekly automated reports
- Up to 5 users

**Enterprise ($799/month):**
- Everything in Business
- Document Classification
- Scheduled Report Generator (custom)
- Command Center access
- Priority support (4-hour critical)
- After-hours emergency support
- Unlimited users
- Up to 2 custom workflows per quarter

**Private ($799/month):**
- Everything in Enterprise
- On-premise deployment option
- Dedicated server (no multi-tenant)
- Custom compliance requirements
- White-labeling

### What's NOT Included

- **VPS Hosting:** $40-80/month (billed by Vultr, not Systack)
- **Domain Registration:** $10-15/year (if custom domain)
- **Email Hosting:** If not using existing provider
- **Third-Party Tools:** QuickBooks, Stripe, Salesforce, etc.
- **Custom Development:** Beyond included workflows (Enterprise: $150/hour)
- **Data Migration:** From existing systems ($500-2000 one-time)
- **Training Beyond Onboarding:** Additional sessions at $150/hour

### How Billing Works

- **Cycle:** Monthly, due on the 1st of each month
- **Payment:** Credit card via Stripe (automatic)
- **Invoice:** Sent via email on the 1st
- **Terms:** Net 15 (payment due by 15th)
- **Late Fee:** 1.5% per month on overdue balances
- **Proration:** Mid-month signups prorated to next month

### How to Upgrade/Downgrade

- **Upgrade:** Contact support. Effective immediately or next billing cycle.
- **Downgrade:** Contact support. Effective next billing cycle.
- **No Penalty:** No fees for tier changes.
- **Data:** All data preserved during tier changes.

### Refund Policy

- **30-Day Satisfaction Guarantee:** New clients can cancel within 30 days for full refund of first month's fee.
- **Annual Plans:** Prorated refund if cancelled mid-year.
- **No Questions Asked:** Refund processed within 5 business days.
- **Exceptions:** Custom development work is non-refundable once delivered.

---

*This Standard Launch Kit is a living document. Updated as services evolve. Last updated: 2026-07-06.*
