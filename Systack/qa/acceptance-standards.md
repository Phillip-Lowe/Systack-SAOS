# SAOS Acceptance Standards
## System Operations Liaison (SOL) — Quality Assurance & Delivery Checklist
### Version: 1.0 | Effective: 2026-07-06
### Status: ACTIVE — Use for every SAOS deployment

---

## How to Use This Document

1. Before any SAOS service goes to production, **every PASS criterion must be demonstrably true**.
2. If **any FAIL criterion is observed**, halt deployment and escalate to the assigned engineer.
3. This document is a contract. A client can hold Systack to these standards.
4. Print/screenshot the relevant section and attach it to the deployment ticket.

---

## Service 1: Invoice Processing Pipeline

### Overview
Email arrives at a dedicated address → PDF is extracted → vendor is matched → line items are parsed → data is written to the database → invoice appears on the dashboard.

### PASS Criteria (All Must Be True)

| # | Criterion | Target | How to Verify |
|---|-----------|--------|---------------|
| 1.1 | Email arrives at dedicated address | 100% of invoices sent to `invoices@systack.net` | Check inbox/mail server logs |
| 1.2 | PDF downloads within 30 seconds of email arrival | ≤30s | Timestamp email arrival vs. PDF saved to disk |
| 1.3 | Vendor name extracted with ≥85% accuracy | ≥85% | Compare extracted vendor name to known vendor list |
| 1.4 | Invoice total extracted matches original PDF total | = PDF total, tolerance ±$0.01 | Manual reconciliation of 10 sample invoices |
| 1.5 | Line items match original PDF total | Sum of line items = extracted total, tolerance ±$0.01 | Manual reconciliation of 10 sample invoices |
| 1.6 | Data written to `invoice_items` table | 100% of processed invoices | Query database for matching invoice ID |
| 1.7 | Dashboard displays invoice within 60 seconds of email arrival | ≤60s | Observe dashboard refresh after test email |
| 1.8 | Alert sent on processing failure (unreadable PDF, parse error, etc.) | 100% of failures trigger alert | Trigger failure with corrupted test PDF, confirm alert |

### FAIL Criteria (Any One = Immediate Escalation)

| # | Failure Mode | Remediation Path |
|---|-------------|------------------|
| 1.F1 | PDF not downloadable (corrupted, password-protected, oversized >50MB) | Reject email with auto-reply, notify sender, queue for manual review |
| 1.F2 | OCR returns garbled text (image-only PDF, low resolution <150 DPI) | Flag for manual review, do not attempt auto-extraction |
| 1.F3 | Extracted total ≠ original PDF total by >$0.01 | Halt pipeline, notify engineer, do not write to database |
| 1.F4 | Database insert fails (constraint violation, connection timeout) | Retry 3× with exponential backoff, then escalate |
| 1.F5 | Dashboard shows stale data >60 seconds old | Refresh pipeline, check database replication lag |
| 1.F6 | Alert not sent when anomaly detected | Escalate to monitoring team immediately |

### Test Data Requirements

| Item | Specification | Source |
|------|--------------|--------|
| Sample invoices (10) | Mix of PDF types: text-based, image-based, mixed | Generate or source from client |
| Known vendor list | ≥20 vendors with variations (e.g., "ACME Corp", "ACME Corporation") | Client CRM or synthetic data |
| Edge case invoices | Scanned image PDF, password-protected PDF, oversized PDF, missing vendor info | Synthetic generation |
| Expected outputs | Manually verified correct extraction for each test invoice | Human QA |

### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Image-only PDF (no text layer) | Attempt OCR; if confidence <70%, flag for manual review |
| Password-protected PDF | Reject with notification; do not attempt brute force |
| Oversized PDF (>50MB) | Reject with notification; suggest split or compressed version |
| Missing vendor name | Attempt fuzzy match on address/phone; if no match, flag for manual review |
| Multiple invoices in one PDF | Process each independently; ensure line items are not conflated |
| Duplicate invoice (same number, vendor) | Detect and flag; do not double-enter; notify user |
| Currency mismatch (e.g., USD vs. EUR) | Detect currency code; if unsupported, flag for manual review |

---

## Service 2: Lead Qualification Bot

### Overview
Form input → scoring algorithm → alert → CRM sync → notification.

### PASS Criteria (All Must Be True)

| # | Criterion | Target | How to Verify |
|---|-----------|--------|---------------|
| 2.1 | Form submission received via webhook | 100% of submissions | Check webhook logs for 200 OK response |
| 2.2 | Lead score calculated within 10 seconds | ≤10s | Timestamp form submission vs. score in database |
| 2.3 | Score accuracy: ≥90% alignment with manual scoring | ≥90% | Compare bot score to human expert score for 50 leads |
| 2.4 | Alert sent to assigned sales rep within 15 seconds for hot leads (score ≥80) | ≤15s | Trigger test hot lead, confirm alert receipt |
| 2.5 | CRM record created/updated within 30 seconds | ≤30s | Query CRM API for matching lead ID |
| 2.6 | Notification delivered to Slack/email with correct lead details | 100% of alerts | Inspect notification payload vs. original form data |
| 2.7 | No duplicate CRM entries for same lead email | 0 duplicates | Submit same email twice; verify single CRM record |
| 2.8 | Audit log entry created for every scored lead | 100% of leads | Query `lead_audit_log` table |

### FAIL Criteria (Any One = Immediate Escalation)

| # | Failure Mode | Remediation Path |
|---|-------------|------------------|
| 2.F1 | Webhook not received (form provider down, URL misconfigured) | Monitor webhook endpoint health; alert on 5xx errors |
| 2.F2 | Score calculation timeout (>30s) | Optimize algorithm or increase worker resources |
| 2.F3 | CRM sync fails (API rate limit, auth expired, validation error) | Retry 3× with backoff; if persistent, escalate to CRM admin |
| 2.F4 | Alert not sent for hot lead (score ≥80) | Escalate immediately; manually notify sales rep |
| 2.F5 | Duplicate CRM entry created | Merge duplicates; review deduplication logic |
| 2.F6 | Score falls outside expected range (e.g., negative, >100) | Reject and flag for review; do not alert |

### Test Data Requirements

| Item | Specification | Source |
|------|--------------|--------|
| Sample form submissions (50) | Mix of hot (score ≥80), warm (50-79), cold (<50) leads | Synthetic generation |
| Known good/bad lead profiles | Industry, company size, job title, budget range | Client ICP or synthetic data |
| Duplicate submissions | Same email, slightly different data | Synthetic generation |
| Malformed submissions | Missing required fields, invalid email, XSS attempts | Synthetic generation |

### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Duplicate email with different data | Update existing CRM record, do not create duplicate |
| Missing required field (e.g., email) | Reject with 400 error; do not score or alert |
| Invalid email format | Reject with 400 error; do not score or alert |
| Score exactly at threshold (e.g., 80.0) | Treat as hot lead; alert sent |
| CRM API rate limited | Queue retry; do not drop lead |
| CRM authentication expired | Alert admin; queue leads for retry |
| Form submission with spam indicators | Score low or reject; do not alert sales |

---

## Service 3: Customer Support Drafting

### Overview
Ticket analysis → draft response → agent review → send.

### PASS Criteria (All Must Be True)

| # | Criterion | Target | How to Verify |
|---|-----------|--------|---------------|
| 3.1 | Ticket ingested within 30 seconds of creation | ≤30s | Create test ticket; verify appearance in queue |
| 3.2 | Draft response generated within 60 seconds | ≤60s | Timestamp ticket creation vs. draft available |
| 3.3 | Draft addresses the customer's specific question (not generic) | ≥85% relevance | Human review of 20 drafts for specificity |
| 3.4 | Draft tone matches brand guidelines (professional, empathetic) | ≥90% compliance | Human review against brand rubric |
| 3.5 | Agent can edit/reject/approve draft in UI | 100% of drafts | Verify UI controls functional |
| 3.6 | Approved draft sent to customer within 5 minutes of agent approval | ≤5min | Timestamp approval vs. customer receipt |
| 3.7 | Rejected draft logged with reason | 100% of rejections | Query `draft_rejection_log` table |
| 3.8 | Escalation to human triggered for sensitive/complex issues | 100% of flagged issues | Test with "legal", "refund", "complaint" keywords |

### FAIL Criteria (Any One = Immediate Escalation)

| # | Failure Mode | Remediation Path |
|---|-------------|------------------|
| 3.F1 | Draft not generated within 5 minutes | Escalate to AI service team; notify agent to draft manually |
| 3.F2 | Draft contains incorrect information (wrong policy, outdated pricing) | Do not send; flag for review; update knowledge base |
| 3.F3 | Draft sent without agent approval (auto-send bug) | Disable auto-send immediately; review all sent drafts |
| 3.F4 | Sensitive issue (legal/refund/complaint) not escalated | Escalate to senior agent; review flagging logic |
| 3.F5 | Customer data exposed in draft to wrong recipient | Revoke draft; notify security; review access controls |
| 3.F6 | Draft generation fails silently (no error shown to agent) | Alert engineering; add visible error state in UI |

### Test Data Requirements

| Item | Specification | Source |
|------|--------------|--------|
| Sample tickets (20) | Common issues: billing, technical, feature request, complaint | Client support history or synthetic |
| Sensitive issue tickets | Legal threat, refund demand, data deletion request | Synthetic generation |
| Edge case tickets | Non-English, extremely long, attached images, spam | Synthetic generation |
| Brand guideline rubric | Documented tone, formatting, signature rules | Client brand guide |

### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Ticket in non-English language | Attempt translation; if unsupported, escalate to bilingual agent |
| Extremely long ticket (>5000 words) | Summarize; generate draft based on summary; note truncation |
| Ticket with attached image (screenshot) | OCR image; include findings in draft; if unclear, ask for text description |
| Duplicate ticket from same customer | Reference original ticket; do not treat as new issue |
| Customer requests "speak to human" | Bypass draft; immediately escalate to human agent |
| Ticket contains PII in public channel | Mask PII in draft; alert agent to sensitivity |

---

## Service 4: Document Classification

### Overview
Upload → OCR → categorize → tag → store → search.

### PASS Criteria (All Must Be True)

| # | Criterion | Target | How to Verify |
|---|-----------|--------|---------------|
| 4.1 | File uploaded successfully (≤100MB, supported format) | 100% of valid uploads | Upload test files; verify storage |
| 4.2 | OCR completes within 2 minutes for ≤10 pages | ≤2min | Timestamp upload vs. OCR completion |
| 4.3 | Document category assigned with ≥90% confidence | ≥90% | Compare to human categorization of 50 documents |
| 4.4 | Tags applied match document content (≥85% accuracy) | ≥85% | Manual review of 50 tagged documents |
| 4.5 | Document stored with correct metadata (date, source, size) | 100% of documents | Query storage API for metadata |
| 4.6 | Document retrievable via search within 30 seconds of upload | ≤30s | Search by title, content, tag; verify result |
| 4.7 | Document accessible only to authorized users | 0 unauthorized accesses | Attempt access with wrong user credentials |
| 4.8 | Processing failure triggers alert and retry | 100% of failures | Trigger OCR failure; verify alert |

### FAIL Criteria (Any One = Immediate Escalation)

| # | Failure Mode | Remediation Path |
|---|-------------|------------------|
| 4.F1 | Upload fails for valid file (size, format within limits) | Check storage quota; review upload handler logs |
| 4.F2 | OCR returns empty/garbled text (image-only, low quality) | Flag for manual review; do not store as searchable |
| 4.F3 | Document misclassified (e.g., contract tagged as invoice) | Review categorization model; retrain if pattern emerges |
| 4.F4 | Document accessible to unauthorized user | Revoke access immediately; audit logs; review permissions |
| 4.F5 | Search returns stale/missing results | Reindex documents; check search engine health |
| 4.F6 | Storage quota exceeded | Alert admin; halt new uploads until resolved |

### Test Data Requirements

| Item | Specification | Source |
|------|--------------|--------|
| Sample documents (50) | Mix of contracts, invoices, reports, emails, images | Client documents or synthetic |
| Image-only documents | Scanned pages, screenshots, photos | Synthetic generation |
| Multi-page documents | 2-50 pages, various formats | Synthetic generation |
| Documents with tables/charts | PDFs with structured data | Synthetic generation |
| Unsupported formats | .exe, .zip, .mp4 | Synthetic generation |

### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Image-only document (no text layer) | Attempt OCR; if confidence <70%, store but flag as non-searchable |
| Handwritten document | Attempt OCR; if confidence <60%, flag for manual transcription |
| Document in non-Latin script | Attempt OCR with appropriate language model; if unsupported, flag |
| Corrupted file upload | Reject with error message; do not attempt processing |
| Duplicate document upload | Detect hash match; offer "already exists" message; do not reprocess |
| Document with sensitive content (legal/HR) | Apply highest access restrictions; alert uploader |
| Upload interrupted (network failure) | Resume or retry; do not create partial file |

---

## Service 5: Scheduled Report Generator

### Overview
Schedule → query → format → email → archive.

### PASS Criteria (All Must Be True)

| # | Criterion | Target | How to Verify |
|---|-----------|--------|---------------|
| 5.1 | Schedule triggered at configured time (±1 minute) | ±1min | Verify cron execution logs |
| 5.2 | Data query completes successfully within 5 minutes | ≤5min | Monitor query execution time |
| 5.3 | Report data matches source database (100% accuracy) | 100% | Compare report figures to direct DB query |
| 5.4 | Report formatted correctly (headers, totals, charts) | 100% of reports | Visual inspection of 10 reports |
| 5.5 | Email delivered to recipient list within 10 minutes of trigger | ≤10min | Check email delivery logs |
| 5.6 | Email contains correct attachment (PDF/CSV) | 100% of emails | Verify attachment name and size |
| 5.7 | Report archived with correct metadata | 100% of reports | Query archive storage for report record |
| 5.8 | Failure alert sent if any step fails | 100% of failures | Trigger failure; verify alert |

### FAIL Criteria (Any One = Immediate Escalation)

| # | Failure Mode | Remediation Path |
|---|-------------|------------------|
| 5.F1 | Schedule missed (cron not running, time zone error) | Restart scheduler; review cron configuration |
| 5.F2 | Query timeout (>10 minutes) | Optimize query or increase timeout; alert DBA |
| 5.F3 | Report data incorrect (discrepancy with source) | Halt distribution; investigate query logic |
| 5.F4 | Email not delivered (bounce, spam filter, wrong address) | Check bounce logs; verify recipient list; retry |
| 5.F5 | Report sent to wrong recipients | Revoke access; audit distribution list; review permissions |
| 5.F6 | Archive fails (storage full, permission denied) | Free storage or fix permissions; retry archive |

### Test Data Requirements

| Item | Specification | Source |
|------|--------------|--------|
| Sample schedules | Daily, weekly, monthly triggers | Configure in test environment |
| Sample queries | Simple and complex SQL queries | Client report requirements |
| Expected report outputs | Manually verified correct data | Human QA |
| Recipient lists | Valid and invalid email addresses | Synthetic generation |
| Large datasets | Reports with >10,000 rows | Generate synthetic data |

### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Schedule falls on holiday/weekend | Execute as scheduled; do not skip unless explicitly configured |
| No data returned by query | Send "no data" notification; do not send empty report |
| Query returns partial data | Flag as warning; send report with disclaimer |
| Email bounces for one recipient | Log bounce; continue to other recipients; notify admin |
| Report file too large for email (>25MB) | Compress or split; provide download link |
| Recipient list empty | Skip send; log warning; do not error |
| Report generation overlaps with next scheduled run | Queue or skip overlapping run; alert admin |

---

## Service 6: Client Onboarding

### Overview
Signup → PIN setup → welcome chat → tasks → audit log.

### PASS Criteria (All Must Be True)

| # | Criterion | Target | How to Verify |
|---|-----------|--------|---------------|
| 6.1 | Signup form accepts valid input and creates account | 100% of valid signups | Submit test signup; verify account creation |
| 6.2 | PIN setup completed within 2 minutes of signup | ≤2min | Timestamp signup vs. PIN confirmation |
| 6.3 | Welcome chat initiated within 30 seconds of PIN confirmation | ≤30s | Verify chat message timestamp |
| 6.4 | Welcome chat provides correct onboarding steps (≥90% accuracy) | ≥90% | Human review of 20 welcome chats |
| 6.5 | Task list generated with correct default tasks | 100% of onboardings | Verify task list matches client type |
| 6.6 | Audit log records every onboarding step | 100% of steps | Query `onboarding_audit_log` table |
| 6.7 | Client can access dashboard within 5 minutes of signup | ≤5min | Login with new credentials; verify access |
| 6.8 | Error at any step triggers rollback and alert | 100% of failures | Trigger failure at each step; verify behavior |

### FAIL Criteria (Any One = Immediate Escalation)

| # | Failure Mode | Remediation Path |
|---|-------------|------------------|
| 6.F1 | Signup fails (validation error, database timeout) | Retry with exponential backoff; alert engineering |
| 6.F2 | PIN not delivered (SMS/email failure) | Verify delivery channel; allow PIN resend |
| 6.F3 | PIN verification fails 3 times | Lock account; require manual unlock by admin |
| 6.F4 | Welcome chat not sent | Trigger manually; investigate chat service |
| 6.F5 | Task list missing critical items | Review template; add missing tasks manually |
| 6.F6 | Audit log incomplete (missing steps) | Investigate logging pipeline; do not consider onboarding complete |

### Test Data Requirements

| Item | Specification | Source |
|------|--------------|--------|
| Valid signup profiles | Mix of client types, industries, sizes | Synthetic generation |
| Invalid signup attempts | Duplicate email, weak password, missing fields | Synthetic generation |
| PIN delivery channels | SMS and email | Test with real phone/email |
| Edge case profiles | International phone numbers, non-ASCII names | Synthetic generation |

### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Duplicate email signup | Reject with "account exists" message; offer password reset |
| International phone number | Accept with country code validation; attempt SMS delivery |
| PIN delivery fails (SMS blocked, email bounced) | Offer alternative channel; allow PIN resend |
| PIN expired (not used within 10 minutes) | Invalidate old PIN; allow resend |
| Client abandons onboarding mid-flow | Save progress; allow resume within 24 hours |
| Client requests human assistance during onboarding | Escalate to support; preserve chat context |
| Non-ASCII characters in name | Accept and store correctly; verify display in UI |
| Accessibility: screen reader user | All steps navigable via keyboard/screen reader |

---

## Cross-Service Standards

### Performance
- All services must respond to user actions within 5 seconds under normal load.
- All background processes must complete within documented SLAs.

### Security
- No service may log sensitive data (passwords, PINs, full credit card numbers).
- All API endpoints must require authentication.
- All data transfers must use TLS 1.2 or higher.

### Reliability
- All services must have documented retry logic (3 attempts, exponential backoff).
- All services must have a runbook for each FAIL criterion.
- All services must have a 99.5% uptime target (21.6 hours downtime/month max).

### Observability
- All services must emit structured logs.
- All services must have a health check endpoint.
- All services must have alert rules for each FAIL criterion.

---

## Deployment Sign-Off

Before any SAOS service is deployed to production, the following must be true:

- [ ] All PASS criteria for the service have been demonstrated with test data.
- [ ] All FAIL criteria have been tested (where safe to do so) and remediation paths verified.
- [ ] Edge cases have been documented and handled.
- [ ] A runbook exists for each FAIL criterion.
- [ ] Monitoring and alerting are configured.
- [ ] A rollback plan is documented and tested.
- [ ] The client has reviewed and accepted these standards.

**Deploying Engineer:** _________________________ **Date:** ___________

**QA Reviewer:** _________________________ **Date:** ___________

**Client Acceptance:** _________________________ **Date:** ___________

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-06 | VALI ✅ | Initial release — PASS/FAIL acceptance standards for all 6 SAOS services |

---

*This document is the definition of done for every SAOS deployment. Treat it as a contract.*
