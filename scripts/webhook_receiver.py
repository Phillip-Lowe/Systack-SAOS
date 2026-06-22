#!/usr/bin/env python3
"""
Webhook Receiver — Receives POST from n8n and queues tasks directly
"""

import json
import psycopg2
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver

DB_CONFIG = {'host': 'localhost', 'database': 'systack_memory', 'user': 'systack'}
PORT = 9877

class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args): pass
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
    
    def do_POST(self):
        if self.path != '/queue':
            self.send_error(404); return
        try:
            body = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0))).decode())
            conn = psycopg2.connect(**DB_CONFIG)
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO task_queue (task_type, payload_json, priority, status, max_retries) VALUES ('DEPLOY', %s::jsonb, 9, 'PENDING', 3) RETURNING id",
                (json.dumps(body),)
            )
            result = cur.fetchone()
            conn.commit(); cur.close(); conn.close()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'task_id': result[0]}).encode())
            print(f"[Webhook] Task {result[0]} queued for {body.get('client_id')}")
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
            print(f"[Webhook] Error: {e}")

socketserver.TCPServer.allow_reuse_address = True
server = HTTPServer(('0.0.0.0', PORT), Handler)
print(f"[Webhook Receiver] http://0.0.0.0:{PORT}/queue")
server.serve_forever()