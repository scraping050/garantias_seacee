
import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"

DIRS = [
    "/home/mcqs-jcq-back",
    "/home/mcqs-jcq-front",
    "/home/mcqs-jcq"
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
            # Check for public_html or www
            _, out, _ = ssh.exec_command(f"ls -F {d}/public_html 2>/dev/null")
            res = out.read().decode()
            if res:
                print(f"  [public_html content]:\n{res}")
            
        ssh.close()
    except Exception as e:
        print(e)

if __name__ == "__main__":
    main()
