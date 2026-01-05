
import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"

def main():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        
        print("--- /home ---")
        _, out, _ = ssh.exec_command("ls -F /home")
        print(out.read().decode())
        
        print("--- /www/wwwroot/mcqs-jcq-front ---")
        _, out, _ = ssh.exec_command("ls -F /www/wwwroot/mcqs-jcq-front")
        print(out.read().decode())

        # Check for any other folders in wwwroot
        print("--- /www/wwwroot ---")
        _, out, _ = ssh.exec_command("ls -F /www/wwwroot")
        print(out.read().decode())
        
        ssh.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
