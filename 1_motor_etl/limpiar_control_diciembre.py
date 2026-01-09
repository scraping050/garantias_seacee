import mysql.connector
import os
from dotenv import load_dotenv

# Cargar .env
load_dotenv(r'c:\laragon\www\BRAYAN\proyecto_garantias\.env')

try:
    # Conectar a MySQL
    conn = mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS'),
        database=os.getenv('DB_NAME')
    )
    
    cursor = conn.cursor()
    
    print("=" * 60)
    print("🔄 PREPARANDO REPROCESAMIENTO DE DICIEMBRE 2025")
    print("=" * 60)
    
    # 1. Ver estado actual
    cursor.execute("""
        SELECT COUNT(*) FROM Licitaciones_Cabecera 
        WHERE archivo_origen = '2025-12_seace_v3.json'
    """)
    antes = cursor.fetchone()[0]
    print(f"\n📊 Registros actuales en BD: {antes}")
    
    # 2. Eliminar de control_cargas
    cursor.execute("""
        DELETE FROM control_cargas 
        WHERE nombre_archivo = '2025-12_seace_v3.json'
    """)
    conn.commit()
    
    eliminados = cursor.rowcount
    print(f"✅ Registros eliminados de control_cargas: {eliminados}")
    
    # 3. Verificar eliminación
    cursor.execute("""
        SELECT COUNT(*) FROM control_cargas 
        WHERE nombre_archivo = '2025-12_seace_v3.json'
    """)
    verificacion = cursor.fetchone()[0]
    
    if verificacion == 0:
        print("✅ Control limpiado exitosamente")
        print("\n" + "=" * 60)
        print("🚀 LISTO PARA EJECUTAR CARGADOR")
        print("=" * 60)
        print("\nEl archivo 2025-12_seace_v3.json se reprocesará automáticamente")
        print("al ejecutar cargador.py")
    else:
        print("⚠️ Aún hay registros en control_cargas")
    
    conn.close()
    
except Exception as e:
    print(f"\n❌ Error: {e}")
