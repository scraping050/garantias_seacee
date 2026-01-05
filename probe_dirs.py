
import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"

DIRS = [
    "/www/wwwroot/api.mcqs-jcq.com",
    "/www/wwwroot/mcqs-jcq.com",
    "/www/wwwroot/mcqs-jcq-front"
]

def main():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        
        for d in DIRS:
            print(f"\nScanning: {d}")
            _, out, _ = ssh.exec_command(f"ls -F {d}")
            print(out.read().decode())
            
        ssh.close()
    except Exception as e:
        print(e)

if __name__ == "__main__":
    main()
