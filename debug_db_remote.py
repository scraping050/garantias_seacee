
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Force load env from .env file corresponding to remote production if possible, 
# but here I will hardcode the connection string because I don't have the remote .env handy in this context.
# Wait, I am running this ON THE AGENT locally? No, I should run this ON THE SERVER via existing scripts or simple paramiko logic?
# I have 'run_command' which runs locally on user machine. User machine is NOT the server.
# I need to use Paramiko to run a script ON THE SERVER.

# I will create a script that runs locally on the user machine but connects to the remote DB? 
# Usually I can't connect to remote DB directly (firewall).
# I must run the script ON the server.

# So:
# 1. Create check_data.py locally.
# 2. Upload it to server? I don't have upload_file tool.
# 3. I can write a python script that uses Paramiko to execute python code provided as string on the server.

import paramiko

HOST = "72.61.219.79"
USER = "root"
PASS = "Mcqs123456789#"

CHECK_SCRIPT = """
import sys
import os
sys.path.append('/home/mcqs-jcq/htdocs/mcqs-jcq.com')
from app.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

print('--- ANIOS ---')
try:
    res = db.execute(text("SELECT DISTINCT EXTRACT(YEAR FROM fecha_publicacion) FROM licitaciones_cabecera WHERE fecha_publicacion IS NOT NULL")).fetchall()
    print([r[0] for r in res])
except Exception as e:
    print(e)

print('--- TIPOS GARANTIA ---')
try:
    res = db.execute(text("SELECT DISTINCT tipo_garantia FROM licitaciones_adjudicaciones LIMIT 10")).fetchall()
    print([r[0] for r in res])
except Exception as e:
    print(e)
    
print('--- ENTIDADES (COMPRADOR) ---')
try:
    res = db.execute(text("SELECT DISTINCT comprador FROM licitaciones_cabecera LIMIT 10")).fetchall()
    print([r[0] for r in res])
except Exception as e:
    print(e)
"""

def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASS)
    
    # Write the script to a temp file on server
    stdin, stdout, stderr = client.exec_command("cat > /tmp/check_filters.py")
    stdin.write(CHECK_SCRIPT)
    stdin.channel.shutdown_write() # Send EOF
    
    # Run it
    stdin, stdout, stderr = client.exec_command("cd /home/mcqs-jcq/htdocs/mcqs-jcq.com && ./venv/bin/python /tmp/check_filters.py")
    print(stdout.read().decode())
    print("ERRORS:", stderr.read().decode())
    
    client.close()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Connection failed: {e}")
