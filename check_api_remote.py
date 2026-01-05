
import paramiko
import json

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"

def main():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        
        print("--- CURL BACKEND API ---")
        cmd = "curl -s http://localhost:8000/api/licitaciones/filters/all"
        stdin, stdout, stderr = ssh.exec_command(cmd)
        
        response_text = stdout.read().decode()
        try:
            data = json.loads(response_text)
            print("KEYS:", data.keys())
            print("ANIOS:", data.get("anios"))
            print("TIPO GARANTIA (First 5):", data.get("tipos_garantia")[:5] if data.get("tipos_garantia") else "None")
            print("ENTIDADES (First 5):", data.get("entidades")[:5] if data.get("entidades") else "None")
        except:
            print("RAW RESPONSE (Error parsing JSON):", response_text[:500])
        
        ssh.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
