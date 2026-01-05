
import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"

def main():
    print(f"Connecting to {HOST}...")
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        print("Connected.")
        
        # Check standard roots
        print("\n--- Listing /www/wwwroot ---")
        _, out, _ = ssh.exec_command("ls -la /www/wwwroot")
        print(out.read().decode())
        
        print("\n--- Listing /home ---")
        _, out, _ = ssh.exec_command("ls -la /home")
        print(out.read().decode())
        
        print("\n--- Listing /root ---")
        _, out, _ = ssh.exec_command("ls -la /root")
        print(out.read().decode())
        
        ssh.close()
    except Exception as e:
        print(e)
if __name__ == "__main__":
    main()
