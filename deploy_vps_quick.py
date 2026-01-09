import paramiko
import sys

# Credenciales
HOST = "72.61.219.79"
USER = "root"
PASS = "Juegos1234567#"
PROJECT_ROOT = "/home/mcqs-jcq/htdocs/mcqs-jcq.com"
USER_OWNER = "mcqs-jcq"

def run_cmd(ssh, cmd, title=None):
    if title: print(f"\n🚀 {title}...")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    while True:
        line = stdout.readline()
        if not line: break
        print(f"   | {line.strip()}")
    # Check for errors
    err = stderr.read().decode().strip()
    if err:
        # Ignorar warnings de npm
        if "npm WARN" not in err and "notice" not in err:
            print(f"⚠️ STDERR: {err}")

def main():
    print("🌍 INICIANDO DESPLIEGUE RÁPIDO A VPS...")
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        print(f"🔌 Conectando a {HOST}...")
        ssh.connect(HOST, username=USER, password=PASS)

        # 0. GIT SAFE DIRECTORY
        # Fix for 'dubious ownership' error
        run_cmd(ssh, f"git config --global --add safe.directory {PROJECT_ROOT}", "Configurando Git Safe Directory")
        
        # 1. GIT SYNC
        run_cmd(ssh, f"cd {PROJECT_ROOT} && git fetch origin main && git reset --hard origin/main", "Sincronizando Código (Git)")

        # 2. FRONTEND BUILD (Solo frontend porque cambiamos keywords y layout)
        # Usamos legacy-peer-deps
        run_cmd(ssh, f"cd {PROJECT_ROOT}/frontend && npm install --legacy-peer-deps && npm run build", "Reconstruyendo Frontend")

        # 3. PERMISOS
        run_cmd(ssh, f"chown -R {USER_OWNER}:{USER_OWNER} {PROJECT_ROOT}", "Corrigiendo Permisos")

        # 4. RESTART FRONTEND
        run_cmd(ssh, "pm2 restart frontend-next", "Reiniciando Frontend")

        print("\n✨ DESPLIEGUE FINALIZADO ✨")
        ssh.close()
    except Exception as e:
        print(f"\n☠️ ERROR: {e}")

if __name__ == "__main__":
    main()
