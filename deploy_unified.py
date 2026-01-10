
import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

HOST = "72.61.219.79"
USER = "root"
PASS = "Juegos1234567#"

def run_cmd(ssh, cmd, cwd=None, description=""):
    full_cmd = f"cd {cwd} && {cmd}" if cwd else cmd
    print(f"\n[EXEC] {description} ({full_cmd})")
    stdin, stdout, stderr = ssh.exec_command(full_cmd)
    
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    
    if out: print(f"OUT: {out}")
    if err: print(f"ERR: {err}")
    
    if exit_status != 0:
        print(f"[FAIL] Command failed with status {exit_status}")
        return False
    return True

def main():
    print("=== STARTING UNIFIED DEPLOYMENT TO 72.61.219.79 ===")
    
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        print("Connecting...")
        ssh.connect(HOST, username=USER, password=PASS)
        print("[OK] Connected to VPS.")

        # Unified Project Root
        project_root = "/home/mcqs-jcq-front/htdocs/mcqs-jcq.cloud"
        
        print(f"\n--- DEPLOYING TO: {project_root} ---")
        
        
        # 1. GIT UPDATE (Updates both Backend and Frontend)
        print("\n[GIT] Updating repository...")
        
        # Fix for "dubious ownership"
        run_cmd(ssh, f"git config --global --add safe.directory {project_root}", project_root, "Adding git safe directory exception")
        
        # Handle conflict: ecosystem.config.js
        run_cmd(ssh, "mv ecosystem.config.js ecosystem.config.js.bak", project_root, "Backing up conflicting ecosystem.config.js")
        
        run_cmd(ssh, "git stash", project_root, "Stashing changes")
        if run_cmd(ssh, "git pull origin main", project_root, "Pulling changes"):
            print("[OK] Git pull successful")
            
            # 2. BACKEND SETUP
            print("\n[BACKEND] Updating Dependencies & Services...")
            run_cmd(ssh, "source venv/bin/activate && pip install -r requirements.txt", project_root, "Installing pip requirements")
            
            # Restart Backend PM2 (Using ecosystem if available, or name)
            # Check for ecosystem
            stdin, stdout, stderr = ssh.exec_command(f"ls {project_root}/backend_ecosystem.config.js")
            if stdout.channel.recv_exit_status() == 0:
                 run_cmd(ssh, "pm2 restart backend_ecosystem.config.js", project_root, "Restarting backend via ecosystem")
            else:
                 # Fallback
                 run_cmd(ssh, "pm2 restart api-garantias || pm2 restart fastapi", project_root, "Restarting backend service")

            # 3. FRONTEND SETUP
            print("\n[FRONTEND] Building & Restarting...")
            frontend_dir = f"{project_root}/frontend"
            
            # Check if frontend dir exists
            stdin, stdout, stderr = ssh.exec_command(f"ls -d {frontend_dir}")
            if stdout.channel.recv_exit_status() == 0:
                print(f"[INFO] Frontend directory confirmed: {frontend_dir}")
                run_cmd(ssh, "npm install", frontend_dir, "Installing npm dependencies")
                run_cmd(ssh, "npm run build", frontend_dir, "Building Next.js app")
                
                # Restart Frontend PM2
                run_cmd(ssh, "pm2 restart mcqs-web || pm2 restart nextjs || pm2 restart all", frontend_dir, "Restarting frontend services")
            else:
                print("[FAIL] Frontend directory not found inside project root")
                
        else:
            print("[FAIL] Git pull failed")

        ssh.close()
        print("\n=== DEPLOYMENT COMPLETED ===")

    except Exception as e:
        print(f"\n[FATAL] Error: {e}")

if __name__ == "__main__":
    main()
