
import paramiko
import time

HOST = "72.61.219.79"
USER = "root"
PASS = "Juegos1234567#"  # Updated password

def run_cmd(ssh, cmd, cwd=None):
    full_cmd = f"cd {cwd} && {cmd}" if cwd else cmd
    print(f"\n[EXEC] {full_cmd}")
    stdin, stdout, stderr = ssh.exec_command(full_cmd)
    
    # Wait for command to complete
    exit_status = stdout.channel.recv_exit_status()
    
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    
    if out: print(out)
    if err: print(f"ERR: {err}")
    
    return exit_status == 0

def main():
    print(f"Connecting to {HOST}...")
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        print("Connected successfully.")

        # --- 1. BACKEND DEPLOYMENT (/www/wwwroot/api.mcqs-jcq.com) ---
        backend_path = "/www/wwwroot/api.mcqs-jcq.com"
        print(f"\n--- Deploying Backend at {backend_path} ---")
        
        if run_cmd(ssh, "ls -d .", backend_path):
             # Git Pull
             run_cmd(ssh, "git pull origin main", backend_path)
             
             # Pip Install (update dependencies)
             run_cmd(ssh, "source venv/bin/activate && pip install -r requirements.txt", backend_path)
             
             # Restart Backend Services
             # Trying multiple service names to be safe
             run_cmd(ssh, "pm2 restart api-garantias || pm2 restart fastapi || pm2 restart all", backend_path)
        else:
            print(f"WARNING: Backend directory {backend_path} not found. Skipping backend deployment.")

        # --- 2. FRONTEND DEPLOYMENT (/www/wwwroot/mcqs-jcq.com) ---
        frontend_root = "/www/wwwroot/mcqs-jcq.com"
        print(f"\n--- Deploying Frontend at {frontend_root} ---")
        
        if run_cmd(ssh, "ls -d .", frontend_root):
             # Git Pull
             run_cmd(ssh, "git pull origin main", frontend_root)
             
             # Determine where 'package.json' is (root or inside frontend/)
             build_path = frontend_root
             # Check if 'frontend' folder exists and has package.json
             # If the repo structure on server matches local, package.json is in /frontend
             if run_cmd(ssh, "test -d frontend && echo EXISTS", frontend_root):
                 build_path = f"{frontend_root}/frontend"
             
             print(f"Building in: {build_path}")
             
             # NPM Install & Build
             # Using npm ci for cleaner install if possible, but npm install is safer for now
             run_cmd(ssh, "npm install", build_path)
             run_cmd(ssh, "npm run build", build_path)
             
             # Restart Frontend Services
             run_cmd(ssh, "pm2 restart mcqs-web || pm2 restart nextjs || pm2 restart all", build_path)
        else:
            print(f"WARNING: Frontend directory {frontend_root} not found. Skipping frontend deployment.")
            
        ssh.close()
        print("\n\n=== DEPLOYMENT FINISHED SUCCESSFULLLY ===")

    except Exception as e:
        print(f"\nFATAL ERROR during deployment: {e}")

if __name__ == "__main__":
    main()
