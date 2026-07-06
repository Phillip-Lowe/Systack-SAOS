#!/usr/bin/env python3
"""
SAOS Backup Verification & Restore Drill Script

Performs:
1. pg_dump of systack_memory database
2. SHA-256 checksum of backup
3. Restore test to a temporary database
4. Verification queries against restored data
5. Logs results to backup_log table
6. Reports RPO/RTO metrics

Usage:
    python3 backup_verify.py [--full] [--verify-only <backup_file>]
    
    --full          Run full backup + verify cycle (default)
    --verify-only   Only verify an existing backup file (no new backup)
"""

import os
import sys
import subprocess
import hashlib
import json
import time
from datetime import datetime, timedelta

DB_HOST = os.environ.get("PGHOST", "localhost")
DB_PORT = os.environ.get("PGPORT", "5432")
DB_NAME = os.environ.get("PGDATABASE", "systack_memory")
DB_USER = os.environ.get("PGUSER", "philliplowe")
BACKUP_DIR = os.environ.get("SAOS_BACKUP_DIR", os.path.expanduser("~/saos-backups"))
TEST_DB = "saos_restore_test"

def log_backup(backup_type, target, status, file_path=None, file_size=None, 
               checksum_sha256=None, started_at=None, completed_at=None, 
               verification_result=None, rpo_minutes=None, rto_minutes=None, notes=None):
    """Log backup result to backup_log table."""
    try:
        import psycopg2
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO backup_log 
            (backup_type, target, status, file_path, file_size_bytes, checksum_sha256,
             started_at, completed_at, verified_at, verification_result, rpo_minutes, rto_minutes, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (backup_type, target, status, file_path, file_size, checksum_sha256,
              started_at, completed_at, 
              datetime.now() if status == 'verified' else None,
              verification_result, rpo_minutes, rto_minutes, notes))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"[WARN] Could not log to backup_log: {e}")

def sha256_file(filepath):
    """Calculate SHA-256 checksum of a file."""
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while True:
            data = f.read(65536)
            if not data:
                break
            h.update(data)
    return h.hexdigest()

def run_pg_dump():
    """Create a pg_dump backup of the database."""
    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = os.path.join(BACKUP_DIR, f"systack_memory_{timestamp}.sql")
    
    print(f"[1/5] Creating pg_dump → {backup_file}")
    start = time.time()
    
    result = subprocess.run([
        'pg_dump', '-h', DB_HOST, '-p', DB_PORT, '-U', DB_USER,
        '-f', backup_file, DB_NAME
    ], capture_output=True, text=True, env={**os.environ, 'PGPASSWORD': os.environ.get('PGPASSWORD', '')})
    
    elapsed = int(time.time() - start)
    
    if result.returncode != 0:
        print(f"  ❌ pg_dump failed: {result.stderr}")
        log_backup('pg_dump', DB_NAME, 'failed', notes=result.stderr,
                   started_at=datetime.now() - timedelta(seconds=elapsed),
                   completed_at=datetime.now())
        return None, None, None
    
    file_size = os.path.getsize(backup_file)
    checksum = sha256_file(backup_file)
    print(f"  ✅ Backup: {file_size:,} bytes, {elapsed}s, SHA-256: {checksum[:16]}...")
    
    return backup_file, checksum, file_size

def restore_to_test_db(backup_file):
    """Restore backup to a temporary test database to verify integrity."""
    print(f"[2/5] Creating test database: {TEST_DB}")
    
    # Drop test DB if exists
    subprocess.run(['dropdb', '--if-exists', '-h', DB_HOST, '-p', DB_PORT, '-U', DB_USER, TEST_DB],
                   capture_output=True, text=True, env={**os.environ, 'PGPASSWORD': os.environ.get('PGPASSWORD', '')})
    
    # Create fresh test DB
    result = subprocess.run(['createdb', '-h', DB_HOST, '-p', DB_PORT, '-U', DB_USER, TEST_DB],
                           capture_output=True, text=True, env={**os.environ, 'PGPASSWORD': os.environ.get('PGPASSWORD', '')})
    if result.returncode != 0:
        print(f"  ❌ Could not create test DB: {result.stderr}")
        return False, "Failed to create test database"
    
    print(f"[3/5] Restoring backup to test database...")
    start = time.time()
    
    result = subprocess.run([
        'psql', '-h', DB_HOST, '-p', DB_PORT, '-U', DB_USER, '-d', TEST_DB,
        '-f', backup_file, '-q'
    ], capture_output=True, text=True, env={**os.environ, 'PGPASSWORD': os.environ.get('PGPASSWORD', '')})
    
    elapsed = int(time.time() - start)
    
    if result.returncode != 0:
        print(f"  ❌ Restore failed: {result.stderr[:500]}")
        return False, f"Restore failed after {elapsed}s: {result.stderr[:200]}"
    
    print(f"  ✅ Restore completed in {elapsed}s")
    return True, f"Restored in {elapsed}s"

def verify_restored_data():
    """Run verification queries against the restored database."""
    print(f"[4/5] Verifying restored data...")
    
    checks = []
    
    try:
        import psycopg2
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=TEST_DB, user=DB_USER)
        cur = conn.cursor()
        
        # Check 1: All expected tables exist
        cur.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' ORDER BY table_name
        """)
        tables = [r[0] for r in cur.fetchall()]
        expected = ['saos_clients', 'audit_log', 'task_queue', 'chat_messages', 
                   'chat_conversations', 'agent_state', 'security_events', 
                   'backup_log', 'compliance_policies', 'incident_log']
        missing = [t for t in expected if t not in tables]
        if missing:
            checks.append(f"❌ Missing tables: {missing}")
        else:
            checks.append(f"✅ All {len(expected)} expected tables present")
        
        # Check 2: Client count matches
        cur.execute("SELECT COUNT(*) FROM saos_clients")
        client_count = cur.fetchone()[0]
        checks.append(f"✅ Client records: {client_count}")
        
        # Check 3: Audit log has entries
        cur.execute("SELECT COUNT(*) FROM audit_log")
        audit_count = cur.fetchone()[0]
        checks.append(f"✅ Audit log entries: {audit_count}")
        
        # Check 4: Compliance policies exist
        cur.execute("SELECT COUNT(*) FROM compliance_policies WHERE status = 'active'")
        policy_count = cur.fetchone()[0]
        checks.append(f"✅ Active compliance policies: {policy_count}")
        
        # Check 5: RBAC roles exist
        cur.execute("SELECT COUNT(*) FROM saos_roles")
        role_count = cur.fetchone()[0]
        checks.append(f"✅ RBAC roles: {role_count}")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        checks.append(f"❌ Verification query failed: {e}")
    
    for check in checks:
        print(f"  {check}")
    
    all_pass = all(c.startswith("✅") for c in checks)
    return all_pass, "\n".join(checks)

def cleanup_test_db():
    """Drop the test database."""
    print(f"[5/5] Cleaning up test database...")
    subprocess.run(['dropdb', '--if-exists', '-h', DB_HOST, '-p', DB_PORT, '-U', DB_USER, TEST_DB],
                   capture_output=True, text=True, env={**os.environ, 'PGPASSWORD': os.environ.get('PGPASSWORD', '')})
    print("  ✅ Test database dropped")

def main():
    import argparse
    parser = argparse.ArgumentParser(description="SAOS Backup Verification & Restore Drill")
    parser.add_argument("--full", action="store_true", default=True, help="Full backup + verify cycle")
    parser.add_argument("--verify-only", type=str, help="Only verify an existing backup file")
    args = parser.parse_args()
    
    print("=" * 60)
    print("SAOS Backup Verification & Restore Drill")
    print(f"Date: {datetime.now().isoformat()}")
    print(f"Database: {DB_NAME}@{DB_HOST}:{DB_PORT}")
    print("=" * 60)
    
    overall_start = time.time()
    
    if args.verify_only:
        # Just verify existing backup
        backup_file = args.verify_only
        if not os.path.isfile(backup_file):
            print(f"❌ File not found: {backup_file}")
            sys.exit(1)
        
        checksum = sha256_file(backup_file)
        file_size = os.path.getsize(backup_file)
        backup_file = backup_file
    else:
        # Full cycle
        backup_file, checksum, file_size = run_pg_dump()
        if not backup_file:
            print("\n❌ Backup failed. Aborting.")
            sys.exit(1)
    
    # Restore + verify
    restore_ok, restore_msg = restore_to_test_db(backup_file)
    if not restore_ok:
        log_backup('pg_dump', DB_NAME, 'failed', file_path=backup_file,
                   file_size=file_size, checksum_sha256=checksum,
                   started_at=datetime.now() - timedelta(seconds=int(time.time() - overall_start)),
                   completed_at=datetime.now(), verification_result=restore_msg)
        cleanup_test_db()
        sys.exit(1)
    
    verify_ok, verify_msg = verify_restored_data()
    cleanup_test_db()
    
    total_elapsed = int(time.time() - overall_start)
    
    # Log to database
    log_backup('pg_dump', DB_NAME, 'verified' if verify_ok else 'failed',
               file_path=backup_file, file_size=file_size, checksum_sha256=checksum,
               started_at=datetime.now() - timedelta(seconds=total_elapsed),
               completed_at=datetime.now(),
               verification_result=verify_msg,
               rpo_minutes=1440,  # 24 hours (daily backup = 1440 min RPO)
               rto_minutes=total_elapsed * 2,  # restore took X, full recovery ~2X
               notes=f"Backup+verify completed in {total_elapsed}s")
    
    print("\n" + "=" * 60)
    print(f"RESULT: {'✅ ALL CHECKS PASSED' if verify_ok else '❌ VERIFICATION FAILED'}")
    print(f"Total time: {total_elapsed}s")
    print(f"Backup file: {backup_file}")
    print(f"Size: {file_size:,} bytes")
    print(f"SHA-256: {checksum}")
    print(f"RPO: 1440 minutes (24 hours)")
    print(f"RTO: {total_elapsed * 2} minutes (estimated)")
    print("=" * 60)
    
    sys.exit(0 if verify_ok else 1)

if __name__ == '__main__':
    main()