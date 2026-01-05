
import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"

def main():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        
        print("--- CHECKING FILE CONTENT ---")
        cmd = "grep 'brands =' /home/mcqs-jcq/htdocs/mcqs-jcq.com/app/routers/licitaciones_raw.py"
        stdin, stdout, stderr = ssh.exec_command(cmd)
        print("GREP OUTPUT:", stdout.read().decode())
        
        print("--- CHECKING FOR 'anios' KEY IN RETURN ---")
        cmd = "grep '\"anios\": anios' /home/mcqs-jcq/htdocs/mcqs-jcq.com/app/routers/licitaciones_raw.py"
        stdin, stdout, stderr = ssh.exec_command(cmd)
        print("GREP OUTPUT 2:", stdout.read().decode())
        
        ssh.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
