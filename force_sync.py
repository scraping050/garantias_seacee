
import paramiko
import time

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"
PROJECT_ROOT = "/home/mcqs-jcq/htdocs/mcqs-jcq.com"

def run(cmd, ssh):
    print(f"EXEC: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    if out: print(f"OUT: {out}")
    if err: print(f"ERR: {err}")
    return out

def main():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        
        # 1. Check current status
        run(f"cd {PROJECT_ROOT} && git status", ssh)
        
        # 2. Force fetch and reset
        run(f"cd {PROJECT_ROOT} && git fetch --all", ssh)
        run(f"cd {PROJECT_ROOT} && git reset --hard origin/main", ssh)
        
        # 3. Verify file content
        print("--- VERIFYING FILE ---")
        run(f"cd {PROJECT_ROOT} && grep 'brands =' app/routers/licitaciones_raw.py", ssh)
        
        # 4. Restart Backend
        print("--- RESTARTING BACKEND ---")
        run("pm2 restart 2", ssh)
        time.sleep(2)
        
        # 5. Check API again
        print("--- CHECKING API AFTER RESTART ---")
        run("curl -s http://localhost:8000/api/licitaciones/filters/all | head -c 200", ssh)
        
        ssh.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
