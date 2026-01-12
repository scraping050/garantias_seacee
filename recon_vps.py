
import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Juegos1234567#"

def main():
    print(f"Connecting to {HOST}...")
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        print("Connected.")
        
        print("\n--- Listing /www/wwwroot ---")
        stdin, stdout, stderr = ssh.exec_command("ls -F /www/wwwroot")
        print(stdout.read().decode())
        
        print("\n--- Listing /home ---")
        stdin, stdout, stderr = ssh.exec_command("ls -F /home")
        print(stdout.read().decode())
        
        ssh.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
