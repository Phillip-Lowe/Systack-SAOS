-- Seed data for agent descriptions and capabilities
-- Run after migration_v2.1.sql

-- Insert/update agent state records with descriptions
INSERT INTO agent_state (agent_name, role, description, role_description, status, capabilities, avatar_emoji, tier_access) VALUES
    ('SOL', 'System Operations Liaison', 'Fleet coordinator and strategic planner', 'Your main point of contact. Coordinates the entire agent fleet, monitors systems, and handles strategic requests. Think of SOL as your AI operations manager.', 'IDLE', '["system-optimization", "strategic-planning", "fleet-coordination", "automation-design"]', '🛰️', 'all'),
    ('CODY', 'Code Agent', 'Code writer and deployer', 'Writes, reviews, and deploys code. Handles website changes, API integrations, and technical implementations. When you need something built or fixed, CODY handles it.', 'IDLE', '["code-generation", "deployment", "technical-reviews", "bug-fixes"]', '💻', 'all'),
    ('ASSEMBLY', 'Integration Builder', 'Tool connector and workflow builder', 'Connects your tools together. Sets up workflows between Stripe, Slack, email, databases, and any other services you use. The glue between your apps.', 'IDLE', '["workflow-automation", "integration-setup", "api-connections", "data-pipelines"]', '🛠️', 'all'),
    ('VALI', 'Validation Agent', 'Quality checker and tester', 'Checks work for errors before it goes live. Reviews code, tests automations, verifies data integrity. Quality control for everything the fleet produces.', 'IDLE', '["code-review", "testing", "validation", "quality-assurance"]', '✅', 'all'),
    ('PESSI', 'Pessimist / Risk Agent', 'Risk identifier and edge case finder', 'Looks for what could go wrong. Identifies edge cases, security risks, and failure modes. Every team needs someone who asks "what if this breaks?"', 'IDLE', '["risk-analysis", "edge-case-detection", "security-review", "failure-mode-analysis"]', '⚠️', 'all'),
    ('ORACLE', 'Research Agent', 'Researcher and strategic analyst', 'Dives deep into research, analysis, and strategic evaluation. Evaluates new technologies, competitive landscapes, and long-term feasibility. Your research department.', 'IDLE', '["market-research", "technology-evaluation", "strategic-analysis", "competitive-intelligence"]', '🔮', 'all'),
    ('ATLAS', 'Deployment Agent', 'Infrastructure and DevOps manager', 'Manages infrastructure and deployments. Sets up servers, configures Tailscale, and handles the DevOps side of your fleet. Keeps systems running.', 'IDLE', '["infrastructure", "deployment", "devops", "server-management"]', '🗺️', 'all'),
    ('CHATTY', 'Communication Agent', 'Messaging and content creator', 'Handles messaging, customer outreach, and content creation. Drafts emails, manages social posts, and coordinates external communications.', 'IDLE', '["content-creation", "email-drafting", "social-media", "customer-communications"]', '💬', 'all'),
    ('GENI', 'Creative Agent', 'Creative asset generator', 'Generates images, videos, and creative assets. Produces marketing visuals, social content, and multimedia for your business. Your creative department.', 'IDLE', '["image-generation", "video-generation", "creative-design", "brand-assets"]', '🎨', 'all'),
    ('JURIS', 'Legal & Compliance Agent', 'Compliance and legal reviewer', 'Reviews deployments for compliance, audits configurations, and ensures your automations meet legal and regulatory requirements. Your legal guardrail.', 'IDLE', '["compliance-review", "legal-audit", "policy-check", "deployment-review"]', '⚖️', 'all')
ON CONFLICT (agent_name) DO UPDATE SET
    role = EXCLUDED.role,
    role_description = EXCLUDED.role_description,
    capabilities = EXCLUDED.capabilities,
    avatar_emoji = EXCLUDED.avatar_emoji,
    tier_access = EXCLUDED.tier_access;

-- Verify
SELECT agent_name, role, avatar_emoji, status, role_description FROM agent_state ORDER BY agent_name;
