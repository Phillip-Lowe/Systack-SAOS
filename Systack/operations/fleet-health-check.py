#!/usr/bin/env python3
"""
SAOS Fleet Health Monitor — checks all services and reports status.
Can be run as a cron job or on-demand.
"""

import requests
import json
import os
from datetime import datetime

SERVICES = [
    {"name": "Customer Portal", "url": "http://localhost:8768/api/portal/health", "critical": True},
    {"name": "Command Center", "url": "http://localhost:8770/api/health", "critical": True},
    {"name": "Portal (Cloudflare)", "url": "https://portal.systack.net/api/portal/health", "critical": True},
    {"name": "Command (Cloudflare)", "url": "https://command.systack.net/api/health", "critical": True},
    {"name": "Invoice Dashboard", "url": "http://localhost:8766/api/summary", "critical": False},
    {"name": "Webhook Bridge", "url": "http://localhost:8767/api/health", "critical": False},
    {"name": "Booking Dashboard", "url": "http://localhost:8772/api/health", "critical": False},
    {"name": "n8n", "url": "http://localhost:5678/healthz", "critical": True},
    {"name": "Ollama", "url": "http://localhost:11434/api/tags", "critical": False},
]

def check_services():
    results = []
    all_healthy = True
    
    for svc in SERVICES:
        try:
            r = requests.get(svc["url"], timeout=5)
            healthy = r.status_code == 200
            results.append({
                "name": svc["name"],
                "status": "healthy" if healthy else f"unhealthy ({r.status_code})",
                "critical": svc["critical"],
                "response_time_ms": round(r.elapsed.total_seconds() * 1000),
            })
            if not healthy and svc["critical"]:
                all_healthy = False
        except requests.exceptions.ConnectionError:
            results.append({
                "name": svc["name"],
                "status": "offline (connection refused)",
                "critical": svc["critical"],
                "response_time_ms": None,
            })
            if svc["critical"]:
                all_healthy = False
        except Exception as e:
            results.append({
                "name": svc["name"],
                "status": f"error ({str(e)[:50]})",
                "critical": svc["critical"],
                "response_time_ms": None,
            })
            if svc["critical"]:
                all_healthy = False
    
    return all_healthy, results

def print_report(all_healthy, results):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S CDT")
    print(f"\n{'='*60}")
    print(f"SAOS Fleet Health Report — {timestamp}")
    print(f"{'='*60}\n")
    
    healthy_count = sum(1 for r in results if r["status"] == "healthy")
    total = len(results)
    
    for r in results:
        icon = "✅" if r["status"] == "healthy" else "❌"
        critical_tag = " [CRITICAL]" if r["critical"] else ""
        rt = f" ({r['response_time_ms']}ms)" if r["response_time_ms"] else ""
        print(f"  {icon} {r['name']:<20} {r['status']}{rt}{critical_tag}")
    
    print(f"\n  Summary: {healthy_count}/{total} healthy")
    
    if all_healthy:
        print("  Overall: ✅ ALL SYSTEMS NOMINAL")
    else:
        print("  Overall: ⚠️  CRITICAL SERVICES DOWN")
    
    print(f"\n{'='*60}\n")
    
    return {
        "timestamp": timestamp,
        "all_healthy": all_healthy,
        "healthy_count": healthy_count,
        "total": total,
        "services": results,
    }

if __name__ == "__main__":
    all_healthy, results = check_services()
    report = print_report(all_healthy, results)
    
    # Exit code for cron monitoring
    exit(0 if all_healthy else 1)