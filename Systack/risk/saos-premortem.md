# SAOS Pre-Mortem: Why We Could Fail

*Internal risk assessment — not for client distribution. Goal: find problems before they find us.*

---

## 1. Why Would SAOS Fail as a Product?

### Missing Features Customers Expect
- **Mobile app** — Every competitor has one. Our dashboard is web-only.
- **QuickBooks/Xero integration** — Accountants demand this. Without it, adoption stalls.
- **Multi-user role management** — We have RBAC but no team invite/SSO. Clients expect this.
- **White-labeling** — Agencies want their own branding. Not available.
- **API rate limiting per client** — All clients share the same pool. Not scalable.
- **Real-time notifications** — No push notifications, no Slack integration. Everything is email.

### Technical Debt That Could Kill Us
- **Single PostgreSQL instance** — No read replicas, no failover. One crash = all clients down.
- **No connection pooling** — `SimpleConnectionPool(1,5)` works for 3 clients, not 30.
- **Ollama on same machine** — 16GB RAM can't run SAAS + LLMs simultaneously for multiple clients.
- **No containerization** — Manual deployment per client. Error-prone, time-consuming.
- **No CI/CD** — Deployments are manual Git pulls and restarts. Risk of human error.
- **State in SQLite files** — Not versioned, not backed up consistently.

### Competitors Who Do It Better
- **Zapier/Make** — More integrations, visual builder, self-serve onboarding.
- **Microsoft Power Automate** — Bundled with Office, enterprise sales channel.
- **Airbyte** — Better data pipeline architecture, open source community.
- **Make (formerly Integromat)** — Cheaper, simpler, better UI.

### Where the Moat Is Weakest
- **No proprietary data** — Any competitor can replicate our automations.
- **No network effects** — Each client is isolated. No value from having more clients.
- **No switching costs** — Clients can migrate their data out easily (good for them, bad for retention).
- **Local AI is replicable** — Ollama + OpenClaw is not unique to Systack.

---

## 2. Why Would Customers Leave?

### Month 2 Churn Drivers
- **"This is harder to set up than you said"** — Onboarding friction kills early enthusiasm.
- **"My first invoice didn't parse"** — First impression failure = instant distrust.
- **"Where's the mobile app?"** — Expectation gap from day one.
- **"I don't understand the dashboard"** — Too technical for non-technical business owners.
- **"The AI made a mistake"** — Hallucination in support drafting destroys trust.

### Month 12 Churn Drivers
- **"We're only using 2 of 6 features"** — Value perception erodes when usage is narrow.
- **"Found something cheaper"** — $299/mo is significant for small businesses.
- **"My nephew can build this in Python"** — Technical clients outgrow us.
- **"Support response is too slow"** — At 20+ clients, 1-person support breaks.
- **"No new features in 6 months"** — Product feels stagnant.

### The "Aha Moment" We Might Miss
- **Invoice auto-processing** — Client sees first invoice appear in dashboard without touching it.
- **First lead qualified automatically** — Sales team gets a scored lead ready to call.
- **Support draft saves 10 minutes** — Agent clicks "send" on a pre-written perfect response.
- **Missing these moments** → client never experiences value → churn.

### Onboarding Friction That Kills
- Tailscale setup is foreign to most small business owners.
- Git operations, SSH keys, environment variables = foreign language.
- "VPS provisioning" sounds like rocket science to a restaurant owner.
- VPS cost ($40-80/mo) is a surprise on top of SAOS fee.
- No self-serve onboarding — every client needs Green's time.

---

## 3. Why Would Onboarding Fail?

### Technical Setup Issues
- **Client's email doesn't support IMAP** — Many use Gmail web-only or Outlook 365.
- **PDFs are image-only** — OCR quality varies, client doesn't understand why it fails.
- **Firewall blocks Tailscale** — Corporate networks block UDP.
- **DNS propagation delays** — Client's domain takes 48 hours, they panic.
- **PostgreSQL port conflicts** — Client already runs something on 5432.
- **RAM insufficient** — Client's VPS is 4GB, we need 16GB.

### Knowledge Gaps
- **"What's a VPS?"** — Most clients have never heard of virtual servers.
- **"Why do I need Tailscale?"** — VPN is a foreign concept.
- **"Where do I find my email password?"** — App-specific passwords confuse everyone.
- **"How do I access the dashboard?"** — URL + PIN is non-obvious.
- **"What does 'Ollama' mean?"** — Technical jargon alienates.

### Wrong Expectations
- **"Set it and forget it"** — Reality: needs monitoring, tuning, occasional fixes.
- **"100% accuracy"** — AI makes mistakes. Client expects perfection.
- **"No training required"** — Staff needs to learn the system, verify outputs.
- **"It will replace my staff"** — No, it augments them. Unmet expectation = disappointment.
- **"$299 and I'm done"** — Hidden costs: VPS, domain, email setup, their time.

### Integration Breaks First
- **QuickBooks sync** — API changes, auth expires, data format mismatches.
- **Slack notifications** — Workspace permissions, rate limits.
- **Email IMAP** — Provider blocks "suspicious" automated connections.
- **Webhook callbacks** — Client's firewall drops callbacks, silent failures.
- **Square/Stripe** — API version changes, breaking changes without notice.

---

## 4. Why Would Support Become Overwhelming?

### Client Count Breakpoints
- **5 clients** — Manageable. Green handles directly.
- **15 clients** — First support bottleneck. Questions pile up.
- **30 clients** — Need dedicated support person. Green can't handle alone.
- **50 clients** — Need support team. Ticket system required.
- **100 clients** — Need support infrastructure. SLA commitments.

### Most Common Questions
1. "Why didn't my invoice process?"
2. "How do I reset my PIN?"
3. "Can you add [custom feature]?"
4. "The dashboard says [error], what does that mean?"
5. "Is my data safe?"
6. "How do I export my data?"
7. "Can you integrate with [tool we don't support]?"
8. "Why is the AI giving weird answers?"
9. "How do I add a new user?"
10. "What does this metric mean?"

### Issues That Can't Be Solved Remotely
- **Client's internet is down** — Can't access VPS.
- **Client's email server blocks IMAP** — Need IT admin to whitelist.
- **Client's PDFs are corrupted** — Need to fix at source.
- **Client's VPS provider has outage** — Out of our control.
- **Client's staff refuses to use the system** — Change management issue.
- **Client's Tailscale network is misconfigured** — Need network admin access.

### When We Need Support Staff
- **At 20 clients** — Green is spending 20+ hours/week on support.
- **At 30 clients** — Need part-time support person ($25-40/hr).
- **At 50 clients** — Need full-time support hire ($60-80k/yr).
- **At 100 clients** — Need support team ($150-200k/yr).

---

## 5. What Creates Legal/Compliance Liability?

### Data Exposure Risks
- **Invoice data in plain text DB** — No field-level encryption for sensitive data.
- **Audit logs contain PII** — If leaked, GDPR/CCPA violation.
- **Client credentials in environment variables** — If VPS is compromised, all client data exposed.
- **No data segregation** — Multi-tenant database, no row-level security guarantees.
- **Backup files unencrypted** — pg_dump files sit on disk in plain text.
- **Log files contain API keys** — If logs are exposed, credentials leaked.

### Regulatory Requirements We Might Miss
- **GDPR** — EU clients need right to erasure, data portability. We don't have automated tools.
- **CCPA** — California clients need opt-out, deletion. No self-serve option.
- **HIPAA** — Healthcare clients need BAAs, encryption, access logs. Not HIPAA-ready.
- **PCI-DSS** — If we ever handle payment card data, massive compliance burden.
- **SOX** — Enterprise clients need audit trails, change management. Not there yet.
- **State privacy laws** — Virginia, Colorado, Connecticut have new laws.

### When AI Makes Bad Decisions
- **Wrong invoice total extracted** — Client pays wrong amount, damages vendor relationship.
- **Support draft is offensive** — AI drafts inappropriate response, client sends it.
- **Lead scored wrong** — Sales team wastes time on bad lead, misses good one.
- **Document misclassified** — Wrong category, wrong retention policy, legal exposure.
- **Report has wrong numbers** — Client makes business decision on bad data.

### Invoice Data Leak
- **What if**: SAOS DB is breached, all client invoice data exposed.
- **Impact**: Vendor relationships damaged, financial details public, regulatory fines.
- **Who's liable**: Systack, under the MSA. Client could sue for damages.
- **Mitigation**: Encrypt at rest, encrypt in transit, minimize data retention, cyber insurance.

---

## 6. Why Would Pricing Fail?

### Is $299 Too Cheap?
- **Yes, for the value delivered** — Automating invoice processing saves 10+ hours/month. That's worth $500+ to a business.
- **But no, for the market** — Small businesses compare to software, not labor. $299 feels expensive.
- **Underpricing signals low quality** — "If it's only $299, how good can it be?"

### Is $299 Too Expensive?
- **For solo businesses** — Yes. They need Personal+ tier ($99-149).
- **For businesses <5 employees** — Yes. Value prop is weak.
- **For businesses 10+ employees** — No. ROI is clear.
- **Hidden costs amplify price** — $299 + $40 VPS = $339/mo. That's real money.

### What They Compare Us To
- **Bookkeeper** — $200-400/mo. They think we're replacing a person.
- **QuickBooks** — $30-80/mo. They think we're accounting software.
- **Zapier** — $20-50/mo. They think we're a workflow tool.
- **Hiring a VA** — $5-15/hr on Upwork. They think we're outsourcing.

### ROI They Need to See
- **Time savings** — "You save 15 hours/month" (must be concrete, measured).
- **Error reduction** — "Zero invoice entry errors" (must be provable).
- **Speed** — "Invoices processed in <60 seconds" (must be demonstrable).
- **Cost comparison** — "Cheaper than a part-time bookkeeper" (must be apples-to-apples).

### When They Question Value
- **Month 2**: "Am I really using this?"
- **Month 6**: "Have I saved enough time to justify this?"
- **Month 12**: "What new features have you added?"
- **Renewal time**: "Can I get a discount?"
- **Economic downturn**: "This is the first thing we're cutting."

---

## 7. What If the AI Fleet Doesn't Work?

### Model Failures on Client Data
- **Medical abbreviations** — OCR misreads "PRN" as "PRM", wrong medication.
- **Restaurant shorthand** — "86 shrimp" means out of stock, not 86 units.
- **Invoice line items** — "Misc" and "Adjustment" confuse classification.
- **Multilingual documents** — Spanish invoices, French receipts. Model trained on English.
- **Handwritten notes** — Scanned handwritten forms. OCR quality drops significantly.

### Unacceptable Latency
- **Invoice processing >5 minutes** — Client expects near-real-time. >5 min feels broken.
- **Support draft >30 seconds** — Agent waiting. Frustration builds.
- **Dashboard load >3 seconds** — Feels slow. User confidence drops.
- **Lead qualification >1 hour** — Sales team loses momentum.
- **Report generation >10 minutes** — Scheduled reports need to arrive promptly.

### When Ollama Crashes
- **Out of memory** — Model too big for available RAM. 7B model needs 8GB+.
- **Context window overflow** — Too much text in prompt. Model chokes.
- **GPU driver issues** — macOS updates break CUDA/Metal compatibility.
- **Model corruption** — Downloaded model is corrupted. Re-download needed.
- **Port conflict** — Something else using 11434. Silent failure.

### When AI Is Wrong
- **Invoice total is off by $0.01** — Accounting nightmare. Client can't trust system.
- **Vendor name is wrong** — "John's Plumbing" parsed as "John's Planing". Payment goes wrong.
- **Support draft is too casual** — "Hey dude, thanks for your email!" — Unprofessional.
- **Lead is scored "hot" but is actually a competitor** — Wastes sales time, embarrassing.
- **Document classified as "invoice" but is actually a contract** — Wrong retention, legal exposure.

---

## Risk Summary Table

| Risk Area | Risk Rating | Probability | Impact | Mitigation | Early Warning |
|-----------|-------------|-------------|--------|------------|---------------|
| Missing mobile app | High | 70% | Medium | Build responsive PWA | Clients asking for mobile |
| Single Postgres instance | Critical | 60% | Critical | Read replicas, failover | Performance degradation |
| Onboarding friction | High | 80% | High | Self-serve onboarding wizard | Support tickets spike |
| Support overload at 15 clients | Critical | 75% | Critical | Hire support at 15 clients | Green working >40hrs/week |
| HIPAA compliance gap | Critical | 40% | Critical | Get HIPAA audit, BAA | Healthcare inquiries |
| AI accuracy <85% | High | 50% | High | Better models, human review | Client complaints about errors |
| $299 price resistance | Medium | 60% | Medium | Case studies, ROI calculator | Low conversion rate |
| Ollama OOM crashes | High | 55% | High | Containerization, monitoring | Error logs show OOM |
| Invoice data leak | Critical | 20% | Critical | Encryption, access control | Security audit findings |
| Competitor feature parity | Medium | 65% | Medium | Differentiation, niche focus | Clients mentioning competitors |
| Staff refusal to adopt | Medium | 45% | High | Change management, training | Low usage metrics |
| No QuickBooks integration | High | 70% | High | Build integration | Every sales call mentions it |

---

## Actions to Take Now

1. **Build QuickBooks/Xero integration** — #1 requested feature, blocking sales.
2. **Create self-serve onboarding** — Reduce Green's time per client from 4 hours to 30 minutes.
3. **Encrypt sensitive DB fields** — At minimum, invoice totals, vendor names, client credentials.
4. **Set up read replica** — Even one read replica eliminates single point of failure.
5. **Document the "aha moments"** — Train onboarding to deliver these in first 48 hours.
6. **Build ROI calculator** — Show concrete time/cost savings for each client.
7. **Create support ticket system** — Before we have 15 clients, not after.
8. **Get cyber insurance** — Covers data breach liability.
9. **Build containerized deployment** — Docker Compose, one-command deploy.
10. **Create mobile-responsive dashboard** — At minimum, view-only mobile experience.

---

*This document is a living risk register. Review monthly. Add new risks as discovered. Celebrate mitigations.*
