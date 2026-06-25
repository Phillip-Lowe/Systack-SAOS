-- Migration: SAOS Dashboard v2.1 - Enhanced UX
-- Run this to add columns needed for better task and agent descriptions

-- Add human-readable description to task_queue (for display in dashboard)
ALTER TABLE task_queue ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE task_queue ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);

-- Add role description and agent metadata to agent_state
-- First check if agent_state exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'agent_state'
    ) THEN
        CREATE TABLE agent_state (
            id SERIAL PRIMARY KEY,
            agent_name VARCHAR(50) NOT NULL UNIQUE,
            role VARCHAR(255),
            role_description TEXT,
            status VARCHAR(50) DEFAULT 'idle',
            capabilities JSONB DEFAULT '[]',
            avatar_emoji VARCHAR(10) DEFAULT '🤖',
            tier_access VARCHAR(50) DEFAULT 'all',
            last_heartbeat TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ELSE
        -- Add columns if they don't exist
        ALTER TABLE agent_state ADD COLUMN IF NOT EXISTS role_description TEXT;
        ALTER TABLE agent_state ADD COLUMN IF NOT EXISTS capabilities JSONB DEFAULT '[]';
        ALTER TABLE agent_state ADD COLUMN IF NOT EXISTS avatar_emoji VARCHAR(10);
        ALTER TABLE agent_state ADD COLUMN IF NOT EXISTS tier_access VARCHAR(50) DEFAULT 'all';
    END IF;
END $$;

-- Add client onboarding fields to saos_clients
ALTER TABLE saos_clients ADD COLUMN IF NOT EXISTS onboarding_status VARCHAR(50) DEFAULT 'pending' CHECK (onboarding_status IN ('pending', 'pin_set', 'active', 'suspended'));
ALTER TABLE saos_clients ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP;
ALTER TABLE saos_clients ADD COLUMN IF NOT EXISTS temp_pin VARCHAR(10);  -- Temporary PIN sent to client
ALTER TABLE saos_clients ADD COLUMN IF NOT EXISTS temp_pin_expires_at TIMESTAMP;  -- When temp PIN expires
ALTER TABLE saos_clients ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;
ALTER TABLE saos_clients ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;

-- Create a table for client onboarding invitations
CREATE TABLE IF NOT EXISTS client_invitations (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES saos_clients(id) ON DELETE CASCADE,
    invite_code VARCHAR(64) NOT NULL UNIQUE,  -- Hash of the invite code
    email VARCHAR(255),
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_desc ON task_queue(description);
CREATE INDEX IF NOT EXISTS idx_invite_code ON client_invitations(invite_code) WHERE used_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_client_onboarding ON saos_clients(onboarding_status);

COMMENT ON COLUMN task_queue.description IS 'Human-readable description of what this task does (shown in dashboard)';
COMMENT ON COLUMN task_queue.display_name IS 'Short name/title for the task (shown in dashboard task list)';
COMMENT ON COLUMN agent_state.role_description IS 'What this agent does in plain English for clients';
COMMENT ON COLUMN agent_state.capabilities IS 'JSON array of capability strings this agent provides';
COMMENT ON COLUMN saos_clients.onboarding_status IS 'Client onboarding state: pending=needs setup, pin_set=PIN created, active=fully onboarded';
COMMENT ON COLUMN saos_clients.temp_pin IS 'Temporary PIN sent to client for first-time setup';
