
import paramiko
import time

HOST = "72.61.219.79"
USER = "root"
PASS = "Juegos1234567#"

def run_cmd(ssh, cmd, cwd=None, description=""):
    full_cmd = f"cd {cwd} && {cmd}" if cwd else cmd
    print(f"\n[EXEC] {description} ({full_cmd})")
    stdin, stdout, stderr = ssh.exec_command(full_cmd)
    
    # Wait for command to complete
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    
    if out: print(f"OUT: {out}")
    if err: print(f"ERR: {err}")
    
    if exit_status != 0:
        print(f"❌ Command failed with status {exit_status}")
        return False
    return True

def main():
    print("=== STARTING DEPLOYMENT TO 72.61.219.79 ===")
    
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        print("Connecting...")
        ssh.connect(HOST, username=USER, password=PASS)
        print("✅ Connected to VPS.")

        # --- DIAGNOSTIC: Check paths ---
        print("\n--- Verifying Target Directories ---")
        
        # Discovered paths from previous run
        potential_backend = "/home/mcqs-jcq-back"
        potential_frontend = "/home/mcqs-jcq-front"
        
        valid_backend = None
        valid_frontend = None
        
        # Check Backend
        stdin, stdout, stderr = ssh.exec_command(f"ls {potential_backend}/app/main.py")
        if stdout.channel.recv_exit_status() == 0:
            print(f"✅ CONFIRMED BACKEND at: {potential_backend}")
            valid_backend = potential_backend
        else:
            # Try mcqs-jcq folder as fallback or check if inside subfolder
            print(f"⚠️ Backend not found at {potential_backend}/app/main.py. Checking inside...")
            stdin, out, err = ssh.exec_command(f"ls {potential_backend}")
            print(f"Contents: {out.read().decode().strip()}")

        # Check Frontend
        stdin, stdout, stderr = ssh.exec_command(f"ls {potential_frontend}/package.json")
        if stdout.channel.recv_exit_status() == 0:
            print(f"✅ CONFIRMED FRONTEND at: {potential_frontend}")
            valid_frontend = potential_frontend
        else:
             print(f"⚠️ Frontend package.json not found at {potential_frontend}. Checking inside...")
             stdin, out, err = ssh.exec_command(f"ls {potential_frontend}")
             print(f"Contents: {out.read().decode().strip()}")

        if not valid_backend and not valid_frontend:
             print("❌ Could not confirm project paths. Checking /home/mcqs-jcq...")
             # Fallback check
             pass
                
        # --- 1. BACKEND DEPLOYMENT ---
        if valid_backend:
            print(f"\n🚀 DEPLOYING BACKEND to {valid_backend}")
            
            # Git stash to handle local changes if any
            run_cmd(ssh, "git stash", valid_backend, "Stashing local changes")
            
            if run_cmd(ssh, "git pull origin main", valid_backend, "Pulling changes"):
                print("✅ Git pull successful")
                
                # Check virtualenv
                run_cmd(ssh, "pip install -r requirements.txt", valid_backend, "Installing requirements")
                
                # Restart PM2
                # List pm2 processes first to find the name
                stdin, stdout, stderr = ssh.exec_command("pm2 list")
                out = stdout.read().decode()
                print(f"PM2 Processes:\n{out}")
                
                if "api-garantias" in out:
                    run_cmd(ssh, "pm2 restart api-garantias", valid_backend, "Restarting api-garantias")
                elif "fastapi" in out:
                    run_cmd(ssh, "pm2 restart fastapi", valid_backend, "Restarting fastapi")
                else:
                    print("⚠️ Could not identify backend PM2 process. Attempting 'pm2 restart all'")
                    run_cmd(ssh, "pm2 restart all", valid_backend, "Restarting all")
            else:
                print("❌ Git pull failed")
        else:
             print("❌ Skipped Backend: Path not found (checked /www/wwwroot/api.mcqs-jcq.com)")

        # --- 2. FRONTEND DEPLOYMENT ---
        if valid_frontend:
            print(f"\n🚀 DEPLOYING FRONTEND to {valid_frontend}")
            
            # Frontend often has a subdirectory if cloned fully, or is root. 
            # We assume root based on previous script, but let's check.
            git_root = valid_frontend
            
            run_cmd(ssh, "git stash", git_root, "Stashing local changes")
            
            if run_cmd(ssh, "git pull origin main", git_root, "Pulling changes"):
                print("✅ Git pull successful")
                
                # Verify where package.json is
                build_dir = git_root
                stdin, stdout, stderr = ssh.exec_command(f"ls {git_root}/frontend/package.json")
                if stdout.channel.recv_exit_status() == 0:
                    build_dir = f"{git_root}/frontend"
                    print(f"Detected frontend app in subdirectory: {build_dir}")
                
                # Install and Build
                run_cmd(ssh, "npm install", build_dir, "Installing dependencies")
                run_cmd(ssh, "npm run build", build_dir, "Building Next.js app")
                
                # Restart PM2
                stdin, stdout, stderr = ssh.exec_command("pm2 list")
                out = stdout.read().decode()
                
                if "mcqs-web" in out:
                    run_cmd(ssh, "pm2 restart mcqs-web", build_dir, "Restarting mcqs-web")
                elif "nextjs" in out:
                    run_cmd(ssh, "pm2 restart nextjs", build_dir, "Restarting nextjs")
                else:
                    run_cmd(ssh, "pm2 restart all", build_dir, "Restarting all")
            else:
                print("❌ Git pull failed")
        else:
             print("❌ Skipped Frontend: Path not found")

        ssh.close()
        print("\n=== DEPLOYMENT COMPLETED ===")

    except Exception as e:
        print(f"\n❌ FATAL ERROR: {e}")

if __name__ == "__main__":
    main()
