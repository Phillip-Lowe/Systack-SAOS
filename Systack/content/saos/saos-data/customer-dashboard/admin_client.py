#!/usr/bin/env python3
"""
SAOS Client Admin Utility
Generate temporary PINs for new clients, reset PINs, and manage onboarding.

Usage:
    python3 admin_client.py --create-temp-pin 1
    python3 admin_client.py --list-clients
    python3 admin_client.py --client-status 1
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import os
import random
import string
import argparse
from datetime import datetime, timedelta

DB_HOST = os.environ.get("PGHOST", "localhost")
DB_PORT = int(os.environ.get("PGPORT", "5432"))
DB_NAME = os.environ.get("PGDATABASE", "systack_memory")
DB_USER = os.environ.get("PGUSER", "philliplowe")

def get_db():
    return psycopg2.connect(
        host=DB_HOST, port=DB_PORT, dbname=DB_NAME,
        user=DB_USER
    )

def generate_pin(length=6):
    return ''.join(random.choices(string.digits, k=length))

def create_temp_pin(client_id, expiry_hours=24):
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        # Check client exists
        cur.execute("SELECT * FROM saos_clients WHERE id = %s", (client_id,))
        client = cur.fetchone()
        if not client:
            print(f"❌ Client {client_id} not found")
            return
        
        # Generate temp PIN
        temp_pin = generate_pin(6)
        expires = datetime.now() + timedelta(hours=expiry_hours)
        
        cur.execute("""
            UPDATE saos_clients 
            SET temp_pin = %s, temp_pin_expires_at = %s, onboarding_status = 'pending'
            WHERE id = %s
            RETURNING id, customer_name, customer_email
        """, (temp_pin, expires, client_id))
        updated = cur.fetchone()
        conn.commit()
        
        print(f"✅ Temporary PIN created for {updated['customer_name']} (ID: {updated['id']})")
        print(f"   Email: {updated['customer_email']}")
        print(f"   Temporary PIN: {temp_pin}")
        print(f"   Expires: {expires.strftime('%Y-%m-%d %H:%M')}")
        print(f"")
        print(f"   Send this to your client:")
        print(f"   ┌─────────────────────────────────────────────────┐")
        print(f"   │ Welcome to SAOS!                                │")
        print(f"   │                                                 │")
        print(f"   │ Client ID: {client_id:<40}│")
        print(f"   │ Temporary PIN: {temp_pin:<34}│")
        print(f"   │                                                 │")
        print(f"   │ Visit: https://your-tailscale-url/dashboard/    │")
        print(f"   │ Click 'First time? Set up your PIN'             │")
        print(f"   │ Expires in {expiry_hours} hours                         │")
        print(f"   └─────────────────────────────────────────────────┘")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error: {e}")
    finally:
        cur.close()
        conn.close()

def list_clients():
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute("""
            SELECT id, customer_name, customer_email, tier, onboarding_status,
                   auth_pin IS NOT NULL as has_pin,
                   temp_pin IS NOT NULL as has_temp,
                   last_login_at, login_count
            FROM saos_clients
            ORDER BY id
        """)
        clients = cur.fetchall()
        
        print(f"{'ID':<4} {'Name':<20} {'Tier':<15} {'Status':<12} {'PIN':<6} {'Temp':<6} {'Logins':<8} {'Last Login'}")
        print("-" * 95)
        for c in clients:
            last = c['last_login_at'].strftime('%Y-%m-%d %H:%M') if c['last_login_at'] else 'Never'
            print(f"{c['id']:<4} {c['customer_name']:<20} {c['tier']:<15} {c['onboarding_status']:<12} {'✅' if c['has_pin'] else '❌':<6} {'✅' if c['has_temp'] else '❌':<6} {c['login_count'] or 0:<8} {last}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        cur.close()
        conn.close()

def client_status(client_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute("""
            SELECT id, customer_name, customer_email, tier, onboarding_status,
                   auth_pin IS NOT NULL as has_pin, temp_pin,
                   temp_pin_expires_at, last_login_at, login_count
            FROM saos_clients WHERE id = %s
        """, (client_id,))
        client = cur.fetchone()
        if not client:
            print(f"❌ Client {client_id} not found")
            return
        
        print(f"Client: {client['customer_name']} (ID: {client['id']})")
        print(f"Email: {client['customer_email']}")
        print(f"Tier: {client['tier']}")
        print(f"Onboarding: {client['onboarding_status']}")
        print(f"Has PIN: {'✅ Yes' if client['has_pin'] else '❌ No'}")
        print(f"Temp PIN: {client['temp_pin'] or 'None'}")
        if client['temp_pin_expires_at']:
            print(f"Temp Expires: {client['temp_pin_expires_at']}")
        print(f"Logins: {client['login_count'] or 0}")
        if client['last_login_at']:
            print(f"Last Login: {client['last_login_at']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='SAOS Client Admin')
    parser.add_argument('--create-temp-pin', type=int, metavar='ID', help='Create temp PIN for client')
    parser.add_argument('--list-clients', action='store_true', help='List all clients')
    parser.add_argument('--client-status', type=int, metavar='ID', help='Show client status')
    parser.add_argument('--expiry', type=int, default=24, help='Temp PIN expiry in hours (default: 24)')
    args = parser.parse_args()
    
    if args.create_temp_pin:
        create_temp_pin(args.create_temp_pin, args.expiry)
    elif args.list_clients:
        list_clients()
    elif args.client_status:
        client_status(args.client_status)
    else:
        parser.print_help()
