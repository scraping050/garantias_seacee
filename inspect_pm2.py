
import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"

def main():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        
        print("--- PM2 Describe 1 (Frontend) ---")
        _, out, _ = ssh.exec_command("pm2 describe 1 | grep 'cwd'")
        print(out.read().decode())
        
        print("--- PM2 Describe 2 (Backend) ---")
        _, out, _ = ssh.exec_command("pm2 describe 2 | grep 'cwd'")
        print(out.read().decode())
        
        ssh.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
