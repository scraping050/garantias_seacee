
import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"
DIR = "/home/mcqs-jcq/htdocs/mcqs-jcq.com/frontend"

def run_cmd(ssh, cmd):
    print(f"\n[EXEC] {cmd}")
    full_cmd = f"cd {DIR} && {cmd}"
    stdin, stdout, stderr = ssh.exec_command(full_cmd)
    
    # Stream output closely
    while True:
        line = stdout.readline()
        if not line: break
        print(line.strip())
        
    err = stderr.read().decode()
    if err:
        print(f"STDERR: {err}")

def main():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        
        print(f"Cleaning and Rebuilding in {DIR}...")
        
        # 1. Clean
        run_cmd(ssh, "rm -rf .next")
        
        # 2. Build (with verbose output to catch TypeScript errors)
        # Note: 'npm run build' typically outputs to stdout, but errors to stderr.
        print("Running npm run build...")
        run_cmd(ssh, "npm run build")
        
        # 3. Restart
        # check if build created the manifest
        stdin, stdout, stderr = ssh.exec_command(f"test -f {DIR}/.next/prerender-manifest.json && echo YES")
        if stdout.read().decode().strip() == "YES":
            print("Build Successful! Restarting PM2...")
            run_cmd(ssh, "pm2 restart 1")
            run_cmd(ssh, "pm2 save")
        else:
             print("BUILD FAILED: .next/prerender-manifest.json missing.")
        
        ssh.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
