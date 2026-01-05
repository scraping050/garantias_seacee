
import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"

def main():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        
        print("--- BACKEND LOGS (Last 50 lines) ---")
        # We look for /filters/all access
        _, out, _ = ssh.exec_command("pm2 logs 2 --lines 50 --nostream")
        print(out.read().decode())
        
        ssh.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
