
import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"

def main():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        
        print("--- PM2 STATUS ---")
        _, out, _ = ssh.exec_command("pm2 list")
        print(out.read().decode())
        
        print("\n--- FRONTEND LOGS (ID 1) ---")
        _, out, _ = ssh.exec_command("pm2 logs 1 --lines 30 --nostream")
        print(out.read().decode())
        
        print("\n--- BACKEND LOGS (ID 2) ---")
        _, out, _ = ssh.exec_command("pm2 logs 2 --lines 20 --nostream")
        print(out.read().decode())

        print("\n--- LISTENING PORTS ---")
        _, out, _ = ssh.exec_command("netstat -tulpn | grep LISTEN")
        print(out.read().decode())

        ssh.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
