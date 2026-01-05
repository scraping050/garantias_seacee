
import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"

TARGET_ROOTS = [
    "/home/mcqs-jcq-back/htdocs",
    "/home/mcqs-jcq-front/htdocs",
    "/home/mcqs-jcq/htdocs"
]

def run_cmd(ssh, cmd, cwd):
    print(f"\n[EXEC @ {cwd}] {cmd}")
    full_cmd = f"cd {cwd} && {cmd}"
    stdin, stdout, stderr = ssh.exec_command(full_cmd)
    
    # Wait for completion
    exit_status = stdout.channel.recv_exit_status()
    
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    
    if out: print(out)
    if err: print(f"ERR: {err}")
    return exit_status == 0

def check_file(ssh, filepath):
    stdin, stdout, stderr = ssh.exec_command(f"test -f {filepath} && echo YES")
    return stdout.read().decode().strip() == "YES"

def check_dir(ssh, dirpath):
    stdin, stdout, stderr = ssh.exec_command(f"test -d {dirpath} && echo YES")
    return stdout.read().decode().strip() == "YES"

def deploy(ssh, root):
    print(f"\n=== INSPECTING {root} ===")
    
    if not check_dir(ssh, root):
        print("Directory does not exist. Skipping.")
        return

    # 1. Update Code (if Git)
    if check_dir(ssh, f"{root}/.git"):
        print("Found Git repo. Pulling...")
        run_cmd(ssh, "git pull origin main", root)
    else:
        print("Not a git repo.")

    # 2. Check for Backend (Python)
    if check_file(ssh, f"{root}/requirements.txt"):
        print("Found requirements.txt. Updating Backend...")
        # Check venv
        if check_dir(ssh, f"{root}/venv"):
             run_cmd(ssh, "source venv/bin/activate && pip install -r requirements.txt", root)
        else:
             run_cmd(ssh, "pip install -r requirements.txt", root)
        
        # Restart Backend
        run_cmd(ssh, "pm2 restart api-garantias || pm2 restart fastapi || systemctl restart fastapi", root)

    # 3. Check for Frontend (Node/Next)
    # Could be in root or in /frontend subdir
    frontend_roots = [root]
    if check_dir(ssh, f"{root}/frontend"):
        frontend_roots.append(f"{root}/frontend")

    for fr in frontend_roots:
        if check_file(ssh, f"{fr}/package.json"):
            print(f"Found package.json in {fr}. Updating Frontend...")
            run_cmd(ssh, "npm install", fr)
            run_cmd(ssh, "npm run build", fr)
            # Restart Frontend
            run_cmd(ssh, "pm2 restart mcqs-web || pm2 restart nextjs || pm2 restart all", fr)

def main():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        print("Connected.")

        for root in TARGET_ROOTS:
            try:
                deploy(ssh, root)
            except Exception as e:
                print(f"Error deploying {root}: {e}")

        # Final cleanup/restart to be sure
        print("\n--- Final PM2 Reload ---")
        run_cmd(ssh, "pm2 reload all", "/root")
        
        ssh.close()
        print("\nDeployment Complete.")

    except Exception as e:
        print(f"FATAL: {e}")

if __name__ == "__main__":
    main()
