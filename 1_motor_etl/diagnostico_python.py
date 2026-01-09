import sys
import subprocess
import os

print("=" * 70)
print("🔍 DIAGNÓSTICO DE ENTORNOS PYTHON")
print("=" * 70)

# 1. Python actual (el que ejecuta este script)
print(f"\n1️⃣ Python ACTUAL (ejecutando este script):")
print(f"   Ejecutable: {sys.executable}")
print(f"   Versión: {sys.version}")
print(f"   Prefijo: {sys.prefix}")

# 2. Verificar si estamos en venv
en_venv = hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix)
print(f"   En virtualenv: {'✅ SÍ' if en_venv else '❌ NO'}")

# 3. Verificar módulos instalados
print(f"\n2️⃣ Módulos instalados en este Python:")
try:
    import mysql.connector
    print(f"   ✅ mysql-connector-python: {mysql.connector.__version__}")
except ImportError:
    print(f"   ❌ mysql-connector-python: NO INSTALADO")

try:
    import ijson
    print(f"   ✅ ijson: instalado")
except ImportError:
    print(f"   ❌ ijson: NO INSTALADO")

try:
    from dotenv import load_dotenv
    print(f"   ✅ python-dotenv: instalado")
except ImportError:
    print(f"   ❌ python-dotenv: NO INSTALADO")

# 4. Simular lo que hace main_auto.py
print(f"\n3️⃣ Python que usaría main_auto.py (subprocess):")
resultado = subprocess.run(
    [sys.executable, "-c", "import sys; print(sys.executable)"],
    capture_output=True,
    text=True
)
print(f"   {resultado.stdout.strip()}")

# 5. Verificar módulos en el Python del subprocess
print(f"\n4️⃣ Módulos en el Python del subprocess:")
resultado = subprocess.run(
    [sys.executable, "-c", "import mysql.connector; print('mysql-connector:', mysql.connector.__version__)"],
    capture_output=True,
    text=True
)
if resultado.returncode == 0:
    print(f"   ✅ {resultado.stdout.strip()}")
else:
    print(f"   ❌ Error: {resultado.stderr.strip()}")

# 6. Variables de entorno
print(f"\n5️⃣ Variables de entorno relevantes:")
print(f"   VIRTUAL_ENV: {os.getenv('VIRTUAL_ENV', 'No definida')}")
print(f"   PATH (primeras 3 rutas):")
for i, path in enumerate(os.getenv('PATH', '').split(os.pathsep)[:3]):
    print(f"      {i+1}. {path}")

print("\n" + "=" * 70)
print("✅ DIAGNÓSTICO COMPLETADO")
print("=" * 70)
