# Systack Business Infrastructure Pack

*⚠️ DISCLAIMER: These documents are starting-point templates for business infrastructure. They are NOT legal advice and have NOT been reviewed by a licensed attorney. Consult with qualified legal counsel before using these documents with actual clients.*

---

## Document 1: Master Service Agreement (MSA)

**[REVIEW BY LICENSED ATTORNEY REQUIRED]**

---

### MASTER SERVICE AGREEMENT

**Effective Date:** [DATE]

**Between:**
- **Systack Technologies LLC** ("Provider")
- **Client:** [CLIENT NAME] ("Client")

### 1. SERVICES
Provider will deliver AI operations automation services (the "Services") as described in the applicable Order Form and Service Description. Services may include: invoice processing automation, lead qualification, customer support drafting, document classification, scheduled reporting, and related technical support.

### 2. TERM AND TERMINATION
- **Initial Term:** 12 months from the Service Start Date.
- **Renewal:** Automatically renews for successive 12-month periods unless either party provides written notice of non-renewal at least 30 days prior to expiration.
- **Termination for Convenience:** Either party may terminate with 30 days written notice.
- **Termination for Cause:** Either party may terminate immediately upon material breach if uncured within 15 days of written notice.

### 3. FEES AND PAYMENT
- **Monthly Fee:** As specified in the Order Form.
- **Payment Terms:** Net 15 days from invoice date.
- **Late Fees:** 1.5% per month (18% annual) on overdue balances.
- **Price Changes:** Provider may increase fees by up to 5% annually with 60 days notice.

### 4. DATA AND INTELLECTUAL PROPERTY
- **Client Data:** Client retains all rights to data uploaded to the Services. Provider may use Client Data solely to provide and improve the Services.
- **Provider IP:** Provider retains all rights to the SAOS platform, software, documentation, and methodologies.
- **Data Export:** Upon termination, Provider will provide Client Data in standard format (JSON, CSV) within 30 days.

### 5. CONFIDENTIALITY
Each party agrees to protect the other's Confidential Information using the same degree of care it uses for its own confidential information, but in no event less than reasonable care. Confidential Information includes business plans, technical specifications, pricing, and customer lists.

### 6. LIMITATION OF LIABILITY
- **Cap:** Provider's total liability shall not exceed the total fees paid by Client in the 3 months preceding the claim.
- **Exclusion of Consequential Damages:** Neither party shall be liable for indirect, incidental, special, consequential, or punitive damages.
- **Exceptions:** The foregoing limitations do not apply to: (a) breaches of confidentiality, (b) IP infringement, (c) gross negligence or willful misconduct.

### 7. WARRANTY DISCLAIMERS
THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. PROVIDER DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.

### 8. GOVERNING LAW AND DISPUTE RESOLUTION
- **Governing Law:** This Agreement shall be governed by the laws of the State of Texas, without regard to conflict of law principles.
- **Dispute Resolution:** Any dispute shall first be addressed through good-faith negotiation, then non-binding mediation, and finally binding arbitration in Austin, Texas.

### 9. GENERAL
- **Entire Agreement:** This Agreement constitutes the entire agreement between the parties.
- **Amendment:** No amendment unless in writing signed by both parties.
- **Assignment:** Neither party may assign without prior written consent.
- **Notices:** All notices to be in writing to the addresses specified in the Order Form.

---

## Document 2: Automation Service Agreement (ASA)

**[REVIEW BY LICENSED ATTORNEY REQUIRED]**

---

### AUTOMATION SERVICE AGREEMENT

**Schedule to Master Service Agreement**

### 1. SCOPE OF AUTOMATION SERVICES
Provider will configure and maintain automated workflows using AI models running on Client's designated infrastructure. Services include:

1. **Invoice Processing Pipeline:** Automated extraction, classification, and database storage of vendor invoices.
2. **Lead Qualification Bot:** Automated scoring and routing of inbound leads.
3. **Support Drafting Assistant:** AI-generated draft responses to customer inquiries.
4. **Document Classification:** Automated categorization and tagging of uploaded documents.
5. **Scheduled Report Generator:** Automated creation and delivery of periodic reports.

### 2. DATA PROCESSING
- **Data Minimization:** Provider will process only the data necessary for the specified automation.
- **Purpose Limitation:** Client Data will be used solely for the Services, not for training external AI models.
- **Data Retention:** Client Data retained for the duration of the Agreement plus 30 days, then securely deleted unless otherwise agreed.

### 3. AI MODEL USAGE
- **Local Processing:** All AI processing occurs on Client's designated VPS. No data sent to third-party AI services (OpenAI, Anthropic, etc.) without explicit written consent.
- **Model Selection:** Provider will use open-source models (e.g., Qwen, Llama) running locally via Ollama.
- **Accuracy:** Provider does not guarantee 100% accuracy of AI-generated outputs. Client acknowledges that AI outputs require human review and approval before action.

### 4. SERVICE LEVEL COMMITMENTS
- **Uptime:** 99.5% monthly uptime excluding scheduled maintenance.
- **Response Time:** Critical issues responded to within 4 business hours.
- **Scheduled Maintenance:** Provider will provide 48 hours notice for planned downtime.

### 5. DATA OWNERSHIP AND PORTABILITY
- **Client Ownership:** Client retains all rights to data processed through the Services.
- **Portability:** Upon request, Client Data will be provided in machine-readable format (JSON, CSV, SQLite).
- **No Lock-In:** Provider will not use proprietary formats that prevent migration.

### 6. ACCEPTABLE USE
Client agrees not to use the Services for:
- Processing data in violation of applicable laws (HIPAA, GDPR, etc. without proper agreements).
- Generating content that is unlawful, harmful, threatening, abusive, or discriminatory.
- Attempting to reverse-engineer or extract the underlying AI models.
- Exceeding reasonable usage limits as specified in the Order Form.

---

## Document 3: AI Usage Policy

**[REVIEW BY LICENSED ATTORNEY REQUIRED]**

---

### SYSTACK AI USAGE POLICY

*For Clients and End Users of SAOS*

### 1. WHAT AI MODELS WE USE
SAOS uses open-source AI models running locally on your designated infrastructure. Currently deployed models include:
- **Qwen 3.5 (9B)** — General automation tasks, text processing, classification.
- **Kimi K2.6** — Advanced reasoning, complex document analysis.
- **DeepSeek V4 Pro** — Architecture design, system planning.

We do NOT use closed-source models (GPT-4, Claude, Gemini) for processing your data unless explicitly requested and agreed in writing.

### 2. HOW YOUR DATA IS PROCESSED
- **Local-First:** All data processing occurs on your own VPS. No data leaves your infrastructure.
- **No Training:** Your data is never used to train or improve external AI models.
- **Temporary Processing:** AI models process data in memory only. No persistent storage of processed data beyond the outputs you explicitly save.
- **Encrypted Transit:** All data transmission between services uses TLS encryption.

### 3. WHAT AI CAN AND CANNOT DO
**AI CAN:**
- Extract text from PDFs and images.
- Classify documents by type and content.
- Draft responses to customer inquiries.
- Score leads based on predefined criteria.
- Generate reports from structured data.

**AI CANNOT:**
- Guarantee 100% accuracy. Human review is required.
- Access data outside the specified scope.
- Make legally binding decisions.
- Process protected health information (PHI) without HIPAA compliance measures.
- Access your bank accounts, payment systems, or financial transaction platforms.

### 4. HUMAN REVIEW REQUIREMENTS
- **Invoice Processing:** Extracted totals should be verified against original PDFs before payment.
- **Support Drafts:** AI-generated responses must be reviewed and approved before sending to customers.
- **Lead Scoring:** Automated scores are starting points, not final decisions.
- **Document Classification:** High-confidence classifications (>90%) may proceed; lower confidence requires review.

### 5. DATA RETENTION FOR AI PROCESSING
- **Input Data:** Retained for 30 days to allow for error investigation, then deleted.
- **Output Data:** Retained according to your data retention policy as specified in the MSA.
- **Audit Logs:** Retained for 12 months for compliance and troubleshooting.

### 6. CLIENT OPT-OUT RIGHTS
Client may opt out of AI processing for specific data types or workflows by providing 30 days written notice. Provider will configure manual workflows as an alternative where feasible.

---

## Document 4: Privacy Policy

**[REVIEW BY LICENSED ATTORNEY REQUIRED]**

---

### SYSTACK PRIVACY POLICY

*Last Updated: [DATE]*

### 1. INFORMATION WE COLLECT
We collect information you provide directly to us:
- **Account Information:** Name, email, business name, billing address.
- **Service Data:** Documents, invoices, customer communications processed through SAOS.
- **Usage Data:** System logs, feature usage, error reports.
- **Technical Data:** IP address, browser type, device information.

### 2. HOW WE USE YOUR INFORMATION
- **Provide Services:** To operate, maintain, and improve SAOS.
- **Communication:** To send service updates, security alerts, and billing information.
- **Support:** To respond to your requests and troubleshoot issues.
- **Analytics:** To understand usage patterns and improve our services.
- **Legal Compliance:** To comply with applicable laws and regulations.

### 3. HOW WE SHARE YOUR INFORMATION
We do NOT sell your personal information. We may share information:
- **With Your Consent:** When you explicitly authorize sharing.
- **Service Providers:** With VPS providers (Vultr) and infrastructure partners under confidentiality agreements.
- **Legal Requirements:** When required by law, subpoena, or court order.
- **Business Transfers:** In connection with a merger, acquisition, or sale of assets.

### 4. DATA RETENTION
- **Account Data:** Retained for the duration of your account plus 12 months.
- **Service Data:** Retained according to your data retention settings, default 12 months.
- **Logs:** Retained for 12 months for security and troubleshooting.
- **Backups:** Retained for 30 days in encrypted form.

### 5. YOUR RIGHTS
Depending on your jurisdiction, you may have the right to:
- **Access:** Request a copy of your personal information.
- **Correction:** Request correction of inaccurate information.
- **Deletion:** Request deletion of your personal information.
- **Portability:** Request your data in a portable format.
- **Opt-Out:** Opt out of certain data uses.
- **Non-Discrimination:** We will not discriminate against you for exercising your rights.

### 6. SECURITY MEASURES
We implement industry-standard security measures:
- TLS encryption for data in transit.
- Access controls and authentication.
- Regular security audits and penetration testing.
- Incident response procedures.

### 7. INTERNATIONAL DATA TRANSFERS
Your data is stored in the United States. If you are located outside the US, your data will be transferred to and processed in the US.

### 8. CHILDREN'S PRIVACY
SAOS is not intended for children under 16. We do not knowingly collect information from children.

### 9. CHANGES TO THIS POLICY
We may update this policy periodically. Changes will be posted with a revised effective date. Material changes will be notified via email.

### 10. CONTACT US
For privacy questions or requests:
- **Email:** privacy@systack.net
- **Address:** Systack Technologies LLC, [ADDRESS], Austin, TX [ZIP]

---

## Document 5: Data Processing Addendum (DPA)

**[REVIEW BY LICENSED ATTORNEY REQUIRED]**

---

### DATA PROCESSING ADDENDUM

**Schedule to Master Service Agreement**

### 1. DATA PROCESSING SCOPE
Provider will process Client Personal Data solely to provide the Services as specified in the MSA and applicable Order Forms. Processing activities include: collection, storage, organization, structuring, adaptation, alteration, retrieval, consultation, use, disclosure, and erasure.

### 2. DATA SUBJECT RIGHTS
Provider will assist Client in responding to data subject requests including:
- Access requests
- Correction requests
- Deletion requests ("right to be forgotten")
- Portability requests
- Restriction of processing requests
- Objection requests

Provider will notify Client within 24 hours of receiving any data subject request directly.

### 3. SECURITY MEASURES
Provider implements the following technical and organizational measures:
- **Encryption:** AES-256 at rest, TLS 1.3 in transit.
- **Access Control:** Role-based access control (RBAC) with least privilege.
- **Audit Logging:** All access to Client Data logged with timestamp, user, and action.
- **Network Security:** VPN-only access (Tailscale), no public database ports.
- **Backups:** Encrypted backups with 30-day retention.
- **Employee Training:** Annual security awareness training for all personnel.

### 4. SUB-PROCESSORS
Provider does NOT use sub-processors for AI processing. All AI models run locally on Client's infrastructure. Provider's only sub-processors are:
- **Vultr** — VPS hosting infrastructure.
- **Stripe** — Payment processing (if applicable).

Provider will notify Client of any changes to sub-processors with 30 days notice.

### 5. DATA BREACH NOTIFICATION
Provider will notify Client within 72 hours of discovering any actual or suspected data breach affecting Client Personal Data. Notification will include:
- Nature of the breach
- Categories and approximate number of affected data subjects
- Likely consequences
- Measures taken or proposed to mitigate

### 6. DATA RETURN AND DELETION
Upon termination of the MSA:
- **Data Return:** Provider will return all Client Personal Data in JSON/CSV format within 30 days.
- **Data Deletion:** Provider will securely delete all Client Personal Data within 60 days of termination, except where retention is required by law.
- **Certificate:** Provider will provide a certificate of destruction upon request.

### 7. AUDIT RIGHTS
Client may request an audit of Provider's data processing activities once per year. Provider will cooperate and provide access to relevant documentation.

---

## Document 6: Client Onboarding Agreement

**[REVIEW BY LICENSED ATTORNEY REQUIRED]**

---

### CLIENT ONBOARDING AGREEMENT

**Simple One-Page Agreement**

---

**Client:** [CLIENT NAME]

**Business:** [BUSINESS NAME]

**Email:** [EMAIL]

**Selected Tier:** ☐ Business ($299/mo) ☐ Enterprise ($799/mo) ☐ Private ($799/mo)

**Selected Services:**
- ☐ Invoice Processing Pipeline
- ☐ Lead Qualification Bot
- ☐ Customer Support Drafting
- ☐ Document Classification
- ☐ Scheduled Report Generator
- ☐ Custom: [SPECIFY]

**Monthly Fee:** $___________

**Start Date:** ___________

**Billing Cycle:** Monthly, due on the 1st of each month.

---

### 30-DAY SATISFACTION GUARANTEE
If you are not satisfied with SAOS within the first 30 days, you may cancel for a full refund of your first month's fee. No questions asked. Refund processed within 5 business days.

### WHAT'S INCLUDED
- VPS provisioning and setup
- SAOS installation and configuration
- Initial training session (1 hour)
- Email and chat support
- Monthly usage reports

### WHAT'S NOT INCLUDED
- VPS hosting fees (billed separately by Vultr, ~$40-80/mo)
- Domain registration or email hosting
- Third-party software subscriptions (e.g., QuickBooks, Stripe)
- Custom development beyond the selected services

### CANCELLATION TERMS
You may cancel anytime with 30 days written notice. Your data will be exported in standard format within 30 days of cancellation.

---

**Client Signature:** _________________________ **Date:** _________

**Systack Representative:** _________________________ **Date:** _________

---

## Document Checklist

Before using any of these documents with actual clients:

- [ ] Reviewed by licensed attorney in your jurisdiction
- [ ] Customized for your specific business structure
- [ ] Updated with correct business name and address
- [ ] Compliant with applicable laws (GDPR, CCPA, HIPAA as relevant)
- [ ] Client has reviewed and agreed to all terms
- [ ] Signed copies retained by both parties
- [ ] Digital signatures comply with ESIGN/UETA requirements

---

*This pack was generated by JURIS ⚖️ for Systack internal use. Last updated: 2026-07-06.*
