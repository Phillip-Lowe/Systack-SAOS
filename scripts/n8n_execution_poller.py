#!/usr/bin/env python3
"""
N8n Execution Poller — Polls n8n execution history for new onboarding configs
and queues them as DEPLOY tasks.
"""

import requests
import psycopg2
import time
import json

API_KEY = open('/Users/philliplowe/.openclaw/workspaces/sol/.n8n_api_key').read().strip()
DB_CONFIG = {'host': 'localhost', 'database': 'systack_memory', 'user': 'systack'}
CHECK_INTERVAL = 10  # seconds

def get_recent_executions(workflow_id):
    headers = {'X-N8N-API-KEY': API_KEY}
    resp = requests.get(
        'https://n8n.systack.net/api/v1/executions',
        headers=headers,
        params={'workflowId': workflow_id, 'limit': '10', 'status': 'success'}
    )
    return resp.json().get('data', [])

def get_execution_data(exec_id):
    headers = {'X-N8N-API-KEY': API_KEY}
    resp = requests.get(
        f'https://n8n.systack.net/api/v1/executions/{exec_id}',
        headers=headers,
        params={'includeData': 'true'}
    )
    return resp.json()

def extract_config(execution):
    try:
        run_data = execution.get('data', {}).get('resultData', {}).get('runData', {})
        for node_name, node_data in run_data.items():
            if node_name == 'Process Config':
                for run in node_data:
                    if 'data' in run and run['data']:
                        main_data = run['data'].get('main', [[]])[0]
                        if main_data:
                            json_data = main_data[0].get('json', {})
                            return json_data.get('payload')
    except:
        pass
    return None

def queue_task(config):
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO task_queue (task_type, payload_json, priority, status, max_retries) VALUES ('DEPLOY', %s::jsonb, 9, 'PENDING', 3) RETURNING id",
        (json.dumps(config),)
    )
    task_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return task_id

def main():
    print("[Execution Poller] Starting...")
    seen_executions = set()
    
    # Find the Configure Fleet workflow
    headers = {'X-N8N-API-KEY': API_KEY}
    resp = requests.get('https://n8n.systack.net/api/v1/workflows', headers=headers, params={'limit': '50'})
    workflow_id = None
    for wf in resp.json().get('data', []):
        if 'Configure Fleet' in wf.get('name', ''):
            workflow_id = wf['id']
            print(f"[Execution Poller] Monitoring workflow: {workflow_id}")
            break
    
    if not workflow_id:
        print("[Execution Poller] Workflow not found!")
        return
    
    while True:
        try:
            executions = get_recent_executions(workflow_id)
            for exec in executions:
                exec_id = exec['id']
                if exec_id not in seen_executions:
                    seen_executions.add(exec_id)
                    
                    # Get full execution data
                    full_exec = get_execution_data(exec_id)
                    config = extract_config(full_exec)
                    
                    if config:
                        task_id = queue_task(config)
                        print(f"[Execution Poller] Queued task {task_id} for {config.get('client_id')}")
        except Exception as e:
            print(f"[Execution Poller] Error: {e}")
        
        time.sleep(CHECK_INTERVAL)

if __name__ == '__main__':
    main()