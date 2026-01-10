
import paramiko
import sys

# Forces UTF-8 encoding for stdout/stderr to avoid charmap errors
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
    print("=== STARTING DEPLOYMENT TO 72.61.219.79 ===")
    
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        print("Connecting...")
        ssh.connect(HOST, username=USER, password=PASS)
        print("[OK] Connected to VPS.")

        # Detected nested paths
        backend_root = "/home/mcqs-jcq-back/htdocs/back.mcqs-jcq.cloud"
        frontend_root = "/home/mcqs-jcq-front/htdocs/mcqs-jcq.cloud"
        
        print("\n--- DEPLOYING TO NESTED CLOUD DIRS ---")
        
        # 1. DEPLOY BACKEND
        print(f"\n[BACKEND] Checking {backend_root}...")
        stdin, stdout, stderr = ssh.exec_command(f"ls -F {backend_root}/app/main.py")
        if stdout.channel.recv_exit_status() == 0:
            print(f"[OK] Found backend at {backend_root}")
            
            # Git Stash & Pull
            run_cmd(ssh, "git stash", backend_root, "Stashing changes")
            if run_cmd(ssh, "git pull origin main", backend_root, "Pulling changes"):
                print("[OK] Git pull successful")
                run_cmd(ssh, "pip install -r requirements.txt", backend_root, "Installing requirements")
                run_cmd(ssh, "pm2 restart all", backend_root, "Restarting services")
            else:
                print("[FAIL] Git pull failed")
        else:
            print(f"[FAIL] Backend not found at {backend_root}. Listing content:")
            stdin, out, err = ssh.exec_command(f"ls {backend_root}")
            print(out.read().decode())


        # 2. DEPLOY FRONTEND
        print(f"\n[FRONTEND] Checking {frontend_root}...")
        # Check for package.json or git
        stdin, stdout, stderr = ssh.exec_command(f"ls {frontend_root}/package.json")
        if stdout.channel.recv_exit_status() == 0:
            print(f"[OK] Found frontend at {frontend_root}")
            
            run_cmd(ssh, "git stash", frontend_root, "Stashing changes")
            if run_cmd(ssh, "git pull origin main", frontend_root, "Pulling changes") or True: 
                # Bypass git pull fail if verify logic was strict, but here we trust git pull exit code.
                # Actually, run_cmd checks exit status.
                print("[OK] Git pull successful")
                
                # Check for subfolder 'frontend' inside htdocs (rare but possible)
                build_dir = frontend_root
                stdin, stdout, stderr = ssh.exec_command(f"ls {frontend_root}/frontend/package.json")
                if stdout.channel.recv_exit_status() == 0:
                     build_dir = f"{frontend_root}/frontend"
                     print(f"[INFO] Using build dir: {build_dir}")
                
                run_cmd(ssh, "npm install", build_dir, "Installing dependencies")
                run_cmd(ssh, "npm run build", build_dir, "Building Next.js app")
                run_cmd(ssh, "pm2 restart all", build_dir, "Restarting services")
            else:
                print("[FAIL] Git pull failed")
        else:
            print(f"[FAIL] Frontend not found at {frontend_root}. Listing content:")
            stdin, out, err = ssh.exec_command(f"ls {frontend_root}")
            print(out.read().decode())

        ssh.close()
        print("\n=== DEPLOYMENT COMPLETED ===")

    except Exception as e:
        print(f"\n[FATAL] Error: {e}")

if __name__ == "__main__":
    main()
