
import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"

def run_cmd(ssh, cmd, cwd=None):
    full_cmd = f"cd {cwd} && {cmd}" if cwd else cmd
    print(f"\n[EXEC] {full_cmd}")
    stdin, stdout, stderr = ssh.exec_command(full_cmd)
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    if out: print(out)
    if err: print(f"ERR: {err}")
    return exit_status == 0

def main():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        print("Connected.")

        # --- 1. BACKEND DEPLOYMENT (/www/wwwroot/api.mcqs-jcq.com) ---
        backend_path = "/www/wwwroot/api.mcqs-jcq.com"
        print(f"\n--- Deploying Backend at {backend_path} ---")
        
        # Check if dir exists
        if run_cmd(ssh, "ls -d .", backend_path):
             # Git Pull
             run_cmd(ssh, "git pull origin main", backend_path)
             
             # Pip Install
             run_cmd(ssh, "source venv/bin/activate && pip install -r requirements.txt", backend_path)
             
             # Restart PM2 (Try generic name or specific)
             run_cmd(ssh, "pm2 restart api-garantias || pm2 restart fastapi || pm2 restart all", backend_path)
        else:
            print("Backend directory not found.")

        # --- 2. FRONTEND DEPLOYMENT (/www/wwwroot/mcqs-jcq.com) ---
        # Note: Sometimes frontend is just the 'frontend' folder, or root.
        # We assume the repo is cloned here.
        frontend_path = "/www/wwwroot/mcqs-jcq.com"
        print(f"\n--- Deploying Frontend at {frontend_path} ---")
        
        if run_cmd(ssh, "ls -d .", frontend_path):
             # Git Pull
             run_cmd(ssh, "git pull origin main", frontend_path)
             
             # Check if 'frontend' subdir exists, or if we are IN the frontend
             # Try to enter 'frontend' folder if it exists
             build_path = frontend_path
             if run_cmd(ssh, "test -d frontend", frontend_path):
                 build_path = f"{frontend_path}/frontend"
             
             print(f"Building in: {build_path}")
             
             # NPM Install & Build
             run_cmd(ssh, "npm install", build_path)
             run_cmd(ssh, "npm run build", build_path)
             
             # Restart PM2
             run_cmd(ssh, "pm2 restart mcqs-web || pm2 restart nextjs || pm2 restart all", build_path)
        else:
            print("Frontend directory not found.")
            
        ssh.close()
        print("\n\n=== DEPLOYMENT FINISHED ===")

    except Exception as e:
        print(f"FATAL: {e}")

if __name__ == "__main__":
    main()
