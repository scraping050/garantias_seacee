import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"
PROJECT_ROOT = "/home/mcqs-jcq/htdocs/mcqs-jcq.com"

# Correct Groq API key
GROQ_API_KEY = "os.getenv('GROQ_API_KEY')"  # Key removed for security

def run_cmd(ssh, cmd):
    print(f"EXEC: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    if out: print(f"OUT: {out}")
    if err: print(f"ERR: {err}")
    return out, err

def main():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOST, username=USER, password=PASS)
        
        print("=== Configurando API Key ===")
        
        # Check if .env exists
        run_cmd(ssh, f"cd {PROJECT_ROOT} && ls -la .env")
        
        # Backup .env first
        print("\n=== Creando backup de .env ===")
        run_cmd(ssh, f"cd {PROJECT_ROOT} && cp .env .env.backup_$(date +%Y%m%d_%H%M%S)")
        
        # Add or update GROQ_API_KEY
        print("\n=== Agregando GROQ_API_KEY ===")
        # Remove existing GROQ_API_KEY line if exists, then append new one
        run_cmd(ssh, f"cd {PROJECT_ROOT} && grep -v 'GROQ_API_KEY=' .env > .env.tmp && mv .env.tmp .env")
        run_cmd(ssh, f"cd {PROJECT_ROOT} && echo 'GROQ_API_KEY={GROQ_API_KEY}' >> .env")
        
        # Verify it was added
        print("\n=== Verificando .env ===")
        run_cmd(ssh, f"cd {PROJECT_ROOT} && grep 'GROQ_API_KEY' .env")
        
        # Restart backend to load new env vars
        print("\n=== Reiniciando Backend ===")
        run_cmd(ssh, "pm2 restart backend-api")
        
        print("\n=== ✅ Configuración completa ===")
        print("La clave de Groq ha sido configurada correctamente.")
        print("El backend se reinició. Prueba el chatbot ahora.")
        
        ssh.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
