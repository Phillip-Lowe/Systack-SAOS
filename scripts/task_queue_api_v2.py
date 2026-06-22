#!/usr/bin/env python3
import json, psycopg2, psycopg2.extras
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver
import sys

DB_CONFIG = {'host': 'localhost', 'database': 'systack_memory', 'user': 'systack'}
PORT = 9876

class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args): 
        print(f"[API] {format % args}")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
    
    def do_POST(self):
        print(f"[API] POST to {self.path}", file=sys.stderr)
        if self.path != '/queue':
            self.send_error(404); return
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body_raw = self.rfile.read(content_length)
            print(f"[API] Body ({len(body_raw)} bytes): {body_raw}", file=sys.stderr)
            
            if not body_raw:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Empty body'}).encode())
                return
            
            body = json.loads(body_raw.decode())
            print(f"[API] Parsed: {json.dumps(body)[:200]}", file=sys.stderr)
            
            conn = psycopg2.connect(**DB_CONFIG)
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
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
            response = {'success': True, 'task_id': result['id']}
            self.wfile.write(json.dumps(response).encode())
            print(f"[API] Task {result['id']} queued", file=sys.stderr)
        except Exception as e:
            print(f"[API] ERROR: {e}", file=sys.stderr)
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

socketserver.TCPServer.allow_reuse_address = True
server = HTTPServer(('0.0.0.0', PORT), Handler)
print(f"[Task Queue API] http://0.0.0.0:{PORT}/queue", file=sys.stderr)
server.serve_forever()