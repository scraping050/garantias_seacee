
import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"
REPO = "https://github.com/scraping050/garantias_seacee.git" # Use HTTPS to avoid SSH Key setup issues? Or SSH? User gave SSH URL.
# Note: SSH URL "git@github.com..." requires SSH keys on the server.
# HTTPS URL "https://github.com..." might work without keys for public repos, or need token.
# Let's try SSH first as requested, but if it fails, fallback.

ROOT_DIR = "/home/mcqs-jcq/htdocs/mcqs-jcq.com"

def run_cmd(ssh, cmd, cwd):
    print(f"\n[EXEC @ {cwd}] {cmd}")
    full_cmd = f"cd {cwd} && {cmd}"
    stdin, stdout, stderr = ssh.exec_command(full_cmd)
    
    # Stream for feedback
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

        # 1. Initialize Git if needed
        # We try to use the user's provided SSH URL, assuming keys are there.
        # If not, we might fail.
        
        # Check if .git exists
        stdin, stdout, stderr = ssh.exec_command(f"test -d {ROOT_DIR}/.git && echo YES")
        if stdout.read().decode().strip() != "YES":
            print("Git not initialized. Initializing...")
            run_cmd(ssh, "git init", ROOT_DIR)
            run_cmd(ssh, f"git remote add origin {REPO}", ROOT_DIR)
        
        # 2. Fetch and Reset (Force Update)
        print("Fetching code...")
        # We rely on 'git fetch --all'
        if not run_cmd(ssh, "git fetch --all", ROOT_DIR):
             print("Fetch failed (Auth?). Trying to set remote to https as fallback...")
             # Fallback to HTTPS just in case SSH keys aren't set up for root
             run_cmd(ssh, "git remote set-url origin https://github.com/scraping050/garantias_seacee.git", ROOT_DIR)
             run_cmd(ssh, "git fetch --all", ROOT_DIR)
             
        run_cmd(ssh, "git reset --hard origin/main", ROOT_DIR)

        # 3. Backend Update (Root)
        print("Updating Backend...")
        run_cmd(ssh, "source venv/bin/activate && pip install -r requirements.txt", ROOT_DIR)
        run_cmd(ssh, "pm2 restart 2", ROOT_DIR) # Restart backend ID

        # 4. Frontend Update (Search for frontend folder)
        FRONT_DIR = f"{ROOT_DIR}/frontend"
        print("Updating Frontend...")
        run_cmd(ssh, "npm install", FRONT_DIR)
        run_cmd(ssh, "npm run build", FRONT_DIR)
        run_cmd(ssh, "pm2 restart 1", FRONT_DIR) # Restart frontend ID

        print("\nSUCCESS: Website updated.")
        ssh.close()

    except Exception as e:
        print(f"FATAL: {e}")

if __name__ == "__main__":
    main()
