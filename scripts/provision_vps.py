#!/usr/bin/env python3
"""
SAOS VPS Provisioning Script
Creates and configures Vultr VPS instances for SAOS client deployments.

Usage:
    python3 provision_vps.py --client-id 123 --tier business --email "client@example.com"
    
Environment:
    VULTR_API_KEY     - Vultr API key (required)
    TAILSCALE_AUTH_KEY - Tailscale auth key (required for client join)
    
Tiers:
    business    - 4 vCPU, 16GB RAM, Ubuntu 22.04 ($96/mo)
    enterprise  - 4 vCPU, 16GB RAM + dedicated support ($96/mo + support)
"""

import os
import sys
import json
import time
import base64
import argparse
import requests
from datetime import datetime

# ─── Configuration ──────────────────────────────────────────────────────────

VULTR_API_BASE = "https://api.vultr.com/v2"

# Ubuntu 22.04 LTS (verified working from Percy deployment)
UBUNTU_22_04_OS_ID = 1743

# Region codes
REGIONS = {
    "chicago": "ord",
    "dallas": "dfw",
    "new_jersey": "ewr",
    "los_angeles": "lax",
    "miami": "mia",
    "seattle": "sea",
    "silicon_valley": "sjc",
    "atlanta": "atl",
    "london": "lhr",
    "amsterdam": "ams",
    "frankfurt": "fra",
    "singapore": "sgp",
    "sydney": "syd",
    "tokyo": "nrt",
    "seoul": "icn",
    "toronto": "yto",
    "paris": "cdg",
    "stockholm": "sto",
    "mexico_city": "mex",
    "sao_paulo": "sao",
    "melbourne": "mel",
    "madrid": "mad",
    "warsaw": "waw",
    "mumbai": "bom",
    "delhi": "del",
    "bangalore": "blr",
    "osaka": "itm",
    "johannesburg": "jnb",
}

# Tier → Vultr plan mapping
# vhp-4c-16gb = High Performance, 4 vCPU, 16GB RAM ($96/mo)
TIER_PLANS = {
    "business": {
        "plan": "vhp-4c-16gb",
        "region": "ord",  # Chicago (closest to Little Rock)
        "os_id": UBUNTU_22_04_OS_ID,
        "description": "Business Fleet - 4 vCPU, 16GB RAM"
    },
    "enterprise": {
        "plan": "vhp-4c-16gb",
        "region": "ord",
        "os_id": UBUNTU_22_04_OS_ID,
        "description": "Enterprise Fleet - 4 vCPU, 16GB RAM + Dedicated Support"
    },
    # Test tier for development (cheapest)
    "test": {
        "plan": "vc2-1c-1gb",
        "region": "ord",
        "os_id": UBUNTU_22_04_OS_ID,
        "description": "Test - 1 vCPU, 1GB RAM (development only)"
    }
}

# ─── Cloud-init Templates ─────────────────────────────────────────────────────

def generate_cloud_init(client_id: str, tier: str, agent_name: str, tailscale_auth_key: str) -> str:
    """Generate cloud-init config for SAOS client VPS."""
    
    # Base packages and setup
    cloud_init = f"""#cloud-config
package_update: true
package_upgrade: true

packages:
  - curl
  - wget
  - git
  - htop
  - tmux
  - ufw
  - fail2ban
  - nginx
  - docker.io
  - docker-compose
  - python3
  - python3-pip
  - python3-venv
  - jq

# Create systack user
users:
  - name: systack
    groups: [docker, sudo]
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh_authorized_keys: []

# Install Tailscale
runcmd:
  - echo "=== SAOS Provisioning Started ===" > /var/log/saos-provision.log
  - date >> /var/log/saos-provision.log
  
  # Install Tailscale
  - curl -fsSL https://tailscale.com/install.sh | sh
  - tailscale up --authkey {tailscale_auth_key} --hostname saos-{client_id} --advertise-tags tag:saos-client >> /var/log/saos-provision.log 2>&1
  
  # Install Ollama
  - curl -fsSL https://ollama.com/install.sh | sh
  - systemctl enable ollama
  
  # Pull default model (tier-appropriate)
  - su - systack -c "ollama pull qwen2.5:7b" >> /var/log/saos-provision.log 2>&1
  
  # Install OpenClaw
  - mkdir -p /opt/openclaw
  - cd /opt/openclaw
  - curl -fsSL https://get.openclaw.ai | bash >> /var/log/saos-provision.log 2>&1 || echo "OpenClaw install failed - manual required" >> /var/log/saos-provision.log
  
  # Configure firewall
  - ufw allow 22/tcp
  - ufw allow 80/tcp
  - ufw allow 443/tcp
  - ufw allow 5678/tcp
  - ufw allow 11434/tcp
  - ufw allow 18789/tcp
  - ufw --force enable
  
  # Configure fail2ban
  - systemctl enable fail2ban
  - systemctl start fail2ban
  
  # Signal completion via webhook (if provisioning API is reachable)
  - |
    TAILSCALE_IP=$(tailscale ip -4 2>/dev/null || echo "unknown")
    curl -X POST "https://n8n.systack.net/webhook/saas-vps-ready" \\
      -H "Content-Type: application/json" \\
      -d '{{"client_id":"{client_id}","vps_ip":"'$(curl -s ifconfig.me)'","tailscale_ip":"'"$TAILSCALE_IP"'","status":"ready","timestamp":"'$(date -Iseconds)'"}}' \\
      || echo "Webhook callback failed" >> /var/log/saos-provision.log
  
  - echo "=== SAOS Provisioning Complete ===" >> /var/log/saos-provision.log
  - date >> /var/log/saos-provision.log

# Write status file for health checks
write_files:
  - path: /etc/saos-provision-status.json
    content: |
      {{
        "client_id": "{client_id}",
        "tier": "{tier}",
        "agent_name": "{agent_name}",
        "provisioned_at": "$(date -Iseconds)",
        "status": "in_progress"
      }}
    owner: root:root
    permissions: '0644'
"""
    return cloud_init


# ─── VPS Provisioning Class ───────────────────────────────────────────────────

class VultrProvisioner:
    """Handles Vultr VPS creation and management."""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("VULTR_API_KEY")
        if not self.api_key:
            raise ValueError("VULTR_API_KEY required. Set env var or pass --api-key.")
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def _api(self, method: str, endpoint: str, **kwargs) -> dict:
        """Make Vultr API call."""
        url = f"{VULTR_API_BASE}{endpoint}"
        response = requests.request(method, url, headers=self.headers, timeout=60, **kwargs)
        
        if response.status_code >= 400:
            print(f"API Error: {response.status_code} - {response.text[:500]}")
            response.raise_for_status()
        
        return response.json() if response.text else {}
    
    def list_instances(self) -> list:
        """List all instances."""
        result = self._api("GET", "/instances")
        return result.get("instances", [])
    
    def get_instance(self, instance_id: str) -> dict:
        """Get instance details."""
        return self._api("GET", f"/instances/{instance_id}")
    
    def create_instance(self, client_id: str, tier: str, agent_name: str, 
                       tailscale_auth_key: str, region: str = None) -> dict:
        """Create a new Vultr instance for SAOS client."""
        
        config = TIER_PLANS.get(tier, TIER_PLANS["business"])
        
        # Generate cloud-init user data
        user_data = generate_cloud_init(client_id, tier, agent_name, tailscale_auth_key)
        user_data_b64 = base64.b64encode(user_data.encode()).decode()
        
        payload = {
            "region": region or config["region"],
            "plan": config["plan"],
            "os_id": config["os_id"],
            "label": f"saos-{client_id}",
            "hostname": f"saos-{client_id}",
            "user_data": user_data_b64,
            "enable_ipv6": False,
            "backups": "enabled",
            "ddos_protection": False,
            "activation_email": True
        }
        
        print(f"Creating VPS for client {client_id}...")
        print(f"  Tier: {tier} ({config['description']})")
        print(f"  Region: {payload['region']}")
        print(f"  Plan: {payload['plan']}")
        print(f"  Label: {payload['label']}")
        
        result = self._api("POST", "/instances", json=payload)
        return result.get("instance", result)
    
    def wait_for_instance(self, instance_id: str, timeout: int = 600) -> dict:
        """Poll until instance is active."""
        print(f"Waiting for instance {instance_id} to become active...")
        start = time.time()
        
        while time.time() - start < timeout:
            instance = self.get_instance(instance_id)
            status = instance.get("status", "unknown")
            
            print(f"  Status: {status} ({int(time.time() - start)}s)")
            
            if status == "active":
                print(f"✅ Instance is active!")
                print(f"   IP: {instance.get('main_ip', 'N/A')}")
                print(f"   Gateway: {instance.get('gateway_v4', 'N/A')}")
                return instance
            
            if status in ["error", "destroyed"]:
                raise RuntimeError(f"Instance entered failed state: {status}")
            
            time.sleep(15)
        
        raise TimeoutError(f"Instance {instance_id} did not become active within {timeout}s")
    
    def destroy_instance(self, instance_id: str) -> bool:
        """Destroy an instance."""
        try:
            self._api("DELETE", f"/instances/{instance_id}")
            print(f"✅ Instance {instance_id} destroyed")
            return True
        except Exception as e:
            print(f"❌ Failed to destroy instance: {e}")
            return False
    
    def list_regions(self) -> list:
        """List available regions."""
        result = self._api("GET", "/regions")
        return result.get("regions", [])
    
    def list_plans(self) -> list:
        """List available plans."""
        result = self._api("GET", "/plans")
        return result.get("plans", [])


# ─── Main CLI ────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="SAOS VPS Provisioning")
    parser.add_argument("--client-id", required=True, help="SAOS client ID")
    parser.add_argument("--tier", default="business", choices=["business", "enterprise", "test"],
                       help="SAOS tier")
    parser.add_argument("--agent-name", default="saos-agent", help="Agent name for the client")
    parser.add_argument("--email", required=True, help="Client email")
    parser.add_argument("--region", help="Override region (default: ord)")
    parser.add_argument("--api-key", help="Vultr API key (or set VULTR_API_KEY env)")
    parser.add_argument("--tailscale-key", help="Tailscale auth key (or set TAILSCALE_AUTH_KEY env)")
    parser.add_argument("--wait", action="store_true", default=True, help="Wait for instance to be active")
    parser.add_argument("--test-mode", action="store_true", help="Test mode - don't actually create")
    parser.add_argument("--destroy", help="Destroy instance by ID")
    parser.add_argument("--list", action="store_true", help="List all SAOS instances")
    
    args = parser.parse_args()
    
    # Initialize provisioner
    provisioner = VultrProvisioner(api_key=args.api_key)
    
    # List mode
    if args.list:
        instances = provisioner.list_instances()
        saos_instances = [i for i in instances if i.get("label", "").startswith("saos-")]
        print(f"\nSAOS Instances ({len(saos_instances)} total):\n")
        for inst in saos_instances:
            print(f"  {inst['label']} ({inst['id']})")
            print(f"    Status: {inst['status']}")
            print(f"    IP: {inst.get('main_ip', 'N/A')}")
            print(f"    Region: {inst['region']}")
            print(f"    Plan: {inst['plan']}")
            print(f"    Created: {inst['date_created']}")
            print()
        return
    
    # Destroy mode
    if args.destroy:
        provisioner.destroy_instance(args.destroy)
        return
    
    # Get Tailscale auth key
    tailscale_key = args.tailscale_key or os.environ.get("TAILSCALE_AUTH_KEY")
    if not tailscale_key:
        print("⚠️  Warning: No Tailscale auth key provided. Client will need manual Tailscale setup.")
        tailscale_key = "PLACEHOLDER"
    
    # Test mode
    if args.test_mode:
        print("🧪 TEST MODE - Simulating provisioning...")
        print(f"  Client ID: {args.client_id}")
        print(f"  Tier: {args.tier}")
        print(f"  Agent Name: {args.agent_name}")
        print(f"  Region: {args.region or TIER_PLANS[args.tier]['region']}")
        print(f"  Plan: {TIER_PLANS[args.tier]['plan']}")
        
        # Show cloud-init
        cloud_init = generate_cloud_init(args.client_id, args.tier, args.agent_name, tailscale_key)
        print(f"\n📄 Cloud-init (first 1000 chars):")
        print(cloud_init[:1000])
        print("...\n")
        
        print("✅ Test complete - no instance created")
        return
    
    # Create instance
    try:
        instance = provisioner.create_instance(
            client_id=args.client_id,
            tier=args.tier,
            agent_name=args.agent_name,
            tailscale_auth_key=tailscale_key,
            region=args.region
        )
        
        print(f"\n✅ Instance created: {instance['id']}")
        print(f"   Status: {instance['status']}")
        print(f"   Date: {instance['date_created']}")
        
        # Wait for active
        if args.wait:
            instance = provisioner.wait_for_instance(instance["id"])
            
            # Output deployment info
            deployment_info = {
                "client_id": args.client_id,
                "tier": args.tier,
                "agent_name": args.agent_name,
                "email": args.email,
                "vps_id": instance["id"],
                "vps_ip": instance.get("main_ip", "pending"),
                "vps_gateway": instance.get("gateway_v4", ""),
                "region": instance["region"],
                "plan": instance["plan"],
                "status": instance["status"],
                "created_at": instance["date_created"],
                "tailscale_hostname": f"saos-{args.client_id}",
                "n8n_url": f"http://{instance.get('main_ip', 'PENDING')}:5678",
                "provisioned_at": datetime.utcnow().isoformat()
            }
            
            print(f"\n📋 Deployment Info:")
            print(json.dumps(deployment_info, indent=2))
            
            # Save to file
            output_file = f"/tmp/saos-deployment-{args.client_id}.json"
            with open(output_file, "w") as f:
                json.dump(deployment_info, f, indent=2)
            print(f"\n💾 Saved to: {output_file}")
    
    except requests.exceptions.HTTPError as e:
        print(f"\n❌ API Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
