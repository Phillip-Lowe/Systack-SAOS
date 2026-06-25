-- Update existing task_queue entries with human-readable descriptions
-- Run this after migration_v2.1.sql

UPDATE task_queue SET 
    display_name = CASE task_type
        WHEN 'client_request' THEN 'Client Request'
        WHEN 'provision_vps' THEN 'Provision VPS'
        WHEN 'configure_tailscale' THEN 'Configure Tailscale'
        WHEN 'deploy_n8n' THEN 'Deploy n8n'
        WHEN 'setup_slack' THEN 'Setup Slack'
        WHEN 'email_campaign' THEN 'Email Campaign'
        WHEN 'invoice_process' THEN 'Invoice Processing'
        WHEN 'lead_qualify' THEN 'Lead Qualification'
        WHEN 'content_create' THEN 'Content Creation'
        WHEN 'data_sync' THEN 'Data Sync'
        WHEN 'report_generate' THEN 'Report Generation'
        WHEN 'document_classify' THEN 'Document Classification'
        ELSE INITCAP(REPLACE(task_type, '_', ' '))
    END,
    description = CASE task_type
        WHEN 'client_request' THEN COALESCE(
            (SELECT payload_json->>'request' FROM task_queue t2 WHERE t2.id = task_queue.id),
            'Client-initiated request via chat'
        )
        WHEN 'provision_vps' THEN 'Setting up cloud VPS for SAOS deployment'
        WHEN 'configure_tailscale' THEN 'Configuring encrypted mesh network access'
        WHEN 'deploy_n8n' THEN 'Deploying automation workflow engine'
        WHEN 'setup_slack' THEN 'Configuring team Slack workspace'
        WHEN 'email_campaign' THEN 'Running automated email campaign sequence'
        WHEN 'invoice_process' THEN 'Extracting and processing invoice data'
        WHEN 'lead_qualify' THEN 'Scoring and routing incoming leads'
        WHEN 'content_create' THEN 'Generating marketing content and assets'
        WHEN 'data_sync' THEN 'Synchronizing data between systems'
        WHEN 'report_generate' THEN 'Generating periodic business reports'
        WHEN 'document_classify' THEN 'Classifying and sorting incoming documents'
        ELSE 'Automated task: ' || INITCAP(REPLACE(task_type, '_', ' '))
    END
WHERE display_name IS NULL OR display_name = task_type;

-- Verify
SELECT task_type, display_name, description FROM task_queue LIMIT 5;
