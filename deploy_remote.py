
import paramiko
import time
import sys

# Configuration
HOST = "72.61.219.79"
USER = "root"
PASS = "Juegos1234567#"
PROJECT_PATHS = [
    "/home/mcqs-jcq/htdocs/mcqs-jcq.com",
    "/www/wwwroot/mcqs-jcq.com",
    "/home/mcqs-jcq/public_html"
]

def run_command(ssh, command, description):
    print(f"\n--- {description} ---")
    print(f"Exec: {command}")
    stdin, stdout, stderr = ssh.exec_command(command)
    
    # Stream output
    exit_status = stdout.channel.recv_exit_status()
    
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    
    if out: print(f"[OUT]\n{out}")
    if err: print(f"[ERR]\n{err}")
    
    return exit_status == 0

def main():
    print(f"Connecting to {HOST}...")
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        print("Connected successfully.")
        
        # 1. Find Project Directory
        project_dir = None
        for path in PROJECT_PATHS:
            stdin, stdout, stderr = ssh.exec_command(f"test -d {path} && echo EXISTS")
            if stdout.read().decode().strip() == "EXISTS":
                project_dir = path
                break
        
        if not project_dir:
            print("ERROR: Could not find project directory in standard paths.")
            ssh.close()
            return

        print(f"Found project at: {project_dir}")

        # 2. Update Code
        cmds = [
            (f"cd {project_dir} && git pull origin main", "Pulling latest changes from Git"),
            (f"cd {project_dir} && source venv/bin/activate && pip install -r requirements.txt", "Updating Backend Dependencies"),
            # Try restarting standard services. We don't fail if one doesn't exist, just try them.
            (f"pm2 restart api-garantias || pm2 restart fastapi", "Restarting Backend Service (PM2)"),
            (f"cd {project_dir}/frontend && npm install", "Installing Frontend Dependencies"),
            (f"cd {project_dir}/frontend && npm run build", "Building Frontend"),
            (f"pm2 restart mcqs-web || pm2 restart nextjs || pm2 restart all", "Restarting Frontend Service (PM2)")
        ]

        for cmd, desc in cmds:
            run_command(ssh, cmd, desc)

        print("\nDeployment Sequence Completed.")
        ssh.close()

    except Exception as e:
        print(f"FATAL ERROR: {e}")

if __name__ == "__main__":
    main()
