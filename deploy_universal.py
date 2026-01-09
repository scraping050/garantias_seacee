
import paramiko
import time

HOST = "72.61.219.79"
USER = "root"
PASS = "Juegos1234567#"

TARGET_ROOT = "/home/mcqs-jcq/htdocs/mcqs-jcq.com"
REPO_URL = "https://github.com/scraping050/garantias_seacee.git"

def run_cmd(ssh, cmd, cwd):
    print(f"\n[EXEC @ {cwd}] {cmd}")
    full_cmd = f"cd {cwd} && {cmd}"
    stdin, stdout, stderr = ssh.exec_command(full_cmd)
    
    # Wait for completion
    exit_status = stdout.channel.recv_exit_status()
    
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    
    # Sanitize for Windows Console printing
    def safe_print(text):
        try:
            print(text)
        except UnicodeEncodeError:
            print(text.encode('ascii', 'replace').decode('ascii'))
            
    if out: safe_print(out)
    if err: safe_print(f"ERR: {err}")
    return exit_status == 0

def check_dir(ssh, dirpath):
    stdin, stdout, stderr = ssh.exec_command(f"test -d {dirpath} && echo YES")
    return stdout.read().decode().strip() == "YES"

def ensure_git_repo(ssh, root):
    run_cmd(ssh, "git remote -v", root) # Debug remote
    
    if check_dir(ssh, f"{root}/.git"):
        print("Git repo exists. Fetching...")
        run_cmd(ssh, "git fetch origin", root)
    else:
        print("Initializing Git repo...")
        # Create dir if not exists (though it should)
        run_cmd(ssh, "git init", root)
        run_cmd(ssh, f"git remote add origin {REPO_URL}", root)
        run_cmd(ssh, "git fetch origin", root)

    # Force reset to match main
    print("Resetting to origin/main...")
    run_cmd(ssh, "git reset --hard origin/main", root)

def deploy(ssh, root):
    print(f"\n=== DEPLOYING TO {root} ===")
    
    # 1. Sync Code
    ensure_git_repo(ssh, root)

    # 2. Backend
    if run_cmd(ssh, "test -f requirements.txt", root):
        print("Updating Backend...")
        run_cmd(ssh, "pip install -r requirements.txt", root)
        # Restart Backend (assuming PM2 name, adjust if needed)
        run_cmd(ssh, "pm2 restart api-garantias || pm2 restart fastapi", root)

    # 3. Frontend
    frontend_path = f"{root}/frontend"
    if check_dir(ssh, frontend_path):
        print("Updating Frontend...")
        run_cmd(ssh, "npm install", frontend_path)
        run_cmd(ssh, "npm run build", frontend_path)
        # Restart Frontend
        run_cmd(ssh, "pm2 restart mcqs-web || pm2 restart nextjs", frontend_path)

def main():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        print("Connected.")

        deploy(ssh, TARGET_ROOT)
        
        print("\n--- Final PM2 Status ---")
        run_cmd(ssh, "pm2 list", "/root")
        
        ssh.close()
        print("\nDeployment Complete.")

    except Exception as e:
        print(f"FATAL: {e}")

if __name__ == "__main__":
    main()
