#!/usr/bin/env python3
"""
Systack Command Center API
Green's internal master dashboard — monitors all deployments, clients, agents, VPS, services.

Usage:
    python3 api.py              # Start on port 8770
    python3 api.py --port 8770  # Explicit port
"""

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import argparse
import subprocess
import requests
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database config
DB_HOST = os.environ.get("PGHOST", "localhost")
DB_PORT = int(os.environ.get("PGPORT", "5432"))
DB_NAME = os.environ.get("PGDATABASE", "systack_memory")
DB_USER = os.environ.get("PGUSER", "philliplowe")

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_db():
    return psycopg2.connect(
        host=DB_HOST, port=DB_PORT, dbname=DB_NAME,
        user=DB_USER
    )

# ── STATIC FILES ──────────────────────────────────────
@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(BASE_DIR, filename)

# ── HEALTH ────────────────────────────────────────────
@app.route('/api/health')
def health():
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})

# ── FLEET STATUS (Overview) ──────────────────────────
@app.route('/api/fleet/status')
def fleet_status():
    """Master overview: clients, agents, revenue, alerts."""
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Client count
    cur.execute("SELECT COUNT(*) as n FROM saos_clients")
    clients_count = cur.fetchone()['n']
    
    # Active agents (heartbeat within last hour)
    cur.execute("""
        SELECT COUNT(*) as n FROM agent_state 
        WHERE last_heartbeat > NOW() - INTERVAL '1 hour'
    """)
    agents_running = cur.fetchone()['n']
    
    # Total agents
    cur.execute("SELECT COUNT(*) as n FROM agent_state")
    agents_total = cur.fetchone()['n']
    
    # Tasks status
    cur.execute("SELECT status, COUNT(*) as n FROM task_queue GROUP BY status")
    tasks = {r['status']: r['n'] for r in cur.fetchall()}
    
    # Recent deployments (clients)
    cur.execute("""
        SELECT id, customer_name, tier, vps_status, created_at 
        FROM saos_clients 
        ORDER BY created_at DESC 
        LIMIT 10
    """)
    deployments = [dict(r) for r in cur.fetchall()]
    
    # Unread messages
    cur.execute("SELECT COUNT(*) as n FROM message_bus WHERE status = 'UNREAD'")
    unread = cur.fetchone()['n']
    
    cur.close()
    conn.close()
    
    return jsonify({
        "clients_count": clients_count,
        "agents_running": agents_running,
        "agents_total": agents_total,
        "mrr": 0,  # TODO: connect Stripe
        "alerts_count": 0,  # TODO: alert engine
        "tasks": tasks,
        "recent_deployments": deployments,
        "unread_messages": unread,
        "services": [
            {"name": "SAOS Customer Portal", "port": 8768, "status": "healthy"},
            {"name": "Invoice Dashboard", "port": 8766, "status": "healthy"},
            {"name": "Customer Fleet Dashboard", "port": 8765, "status": "healthy"},
            {"name": "n8n Workflows", "port": 5678, "status": "healthy"},
            {"name": "PostgreSQL", "port": 5432, "status": "healthy"},
            {"name": "Tailscale", "port": "VPN", "status": "healthy"},
            {"name": "Booking API", "port": 8772, "status": "provisioning"},
            {"name": "Command Center", "port": 8770, "status": "healthy"},
        ],
        "timestamp": datetime.now().isoformat()
    })

# ── CLIENTS ────────────────────────────────────────────
@app.route('/api/fleet/clients')
def fleet_clients():
    """All SAOS clients with details."""
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT c.*, 
               (SELECT COUNT(*) FROM task_queue WHERE client_id = c.id) as task_count
        FROM saos_clients c
        ORDER BY c.created_at DESC
    """)
    clients = [dict(r) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify({"clients": clients, "count": len(clients)})

# ── AGENTS ─────────────────────────────────────────────
@app.route('/api/fleet/agents')
def fleet_agents():
    """All agents across fleet."""
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM agent_state ORDER BY agent_name")
    agents = [dict(r) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify({"agents": agents, "count": len(agents)})

# ── INFRASTRUCTURE ───────────────────────────────────
@app.route('/api/fleet/infrastructure')
def fleet_infrastructure():
    """VPS and service endpoint health."""
    # Static data for now — extend with live checks
    vps = [
        {
            "hostname": "systack-macbook",
            "ip": "100.x.x.x",
            "location": "Tailscale",
            "ram": "16GB",
            "disk": "500GB",
            "uptime": "30d+",
            "status": "healthy"
        },
        {
            "hostname": "percy-systack",
            "ip": "66.42.121.145",
            "location": "Vultr NJ",
            "ram": "4GB",
            "disk": "80GB",
            "uptime": "N/A",
            "status": "paused"
        },
    ]
    
    # Health check local services
    services = []
    for port, name in [
        (8765, "Customer Fleet Dashboard"),
        (8766, "Invoice Dashboard"),
        (8768, "SAOS Customer Portal"),
    ]:
        try:
            requests.get(f"http://localhost:{port}/api/health", timeout=2)
            services.append({"name": name, "port": port, "status": "healthy"})
        except:
            services.append({"name": name, "port": port, "status": "unreachable"})
    
    return jsonify({"vps": vps, "services": services})

# ── WORKFLOWS ──────────────────────────────────────────
@app.route('/api/fleet/workflows')
def fleet_workflows():
    """n8n workflow status."""
    try:
        # Try to fetch from n8n API
        res = requests.get("http://localhost:5678/api/v1/workflows", timeout=3)
        if res.status_code == 200:
            workflows = res.json().get('data', [])[:20]
            return jsonify({"workflows": workflows, "count": len(workflows)})
    except:
        pass
    
    return jsonify({"workflows": [], "count": 0, "note": "n8n API unavailable"})

# ── REVENUE ────────────────────────────────────────────
@app.route('/api/fleet/revenue')
def fleet_revenue():
    """Revenue summary."""
    return jsonify({
        "mrr": 0,
        "setup_fees": 0,
        "arr": 0,
        "outstanding": 0,
        "note": "Connect Stripe for live data"
    })

# ── ALERTS ─────────────────────────────────────────────
@app.route('/api/fleet/alerts')
def fleet_alerts():
    """Active alerts."""
    return jsonify({"alerts": [], "count": 0})

# ── MAIN ──────────────────────────────────────────────
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8770)
    args = parser.parse_args()
    
    print(f"🚀 Systack Command Center starting on port {args.port}")
    print(f"   Dashboard: http://localhost:{args.port}")
    print(f"   API:       http://localhost:{args.port}/api/fleet/status")
    print()
    
    app.run(host='0.0.0.0', port=args.port, debug=False)
