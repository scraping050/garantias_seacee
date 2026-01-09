import mysql.connector
import os
from dotenv import load_dotenv

# Cargar variables de entorno
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
    
    print("=" * 70)
    print("📅 ANÁLISIS DE LICITACIONES - DICIEMBRE 2025")
    print("=" * 70)
    
    # 1. Archivo procesado de diciembre 2025
    cursor.execute("""
        SELECT nombre_archivo, estado, fecha_fin, registros_procesados 
        FROM control_cargas 
        WHERE nombre_archivo LIKE '2025-12%'
    """)
    archivo = cursor.fetchone()
    
    if archivo:
        print(f"\n📂 Archivo procesado:")
        print(f"   • Nombre: {archivo[0]}")
        print(f"   • Estado: {archivo[1]}")
        print(f"   • Fecha procesamiento: {archivo[2]}")
        print(f"   • Registros encontrados en archivo: {archivo[3]:,}")
    
    # 2. Licitaciones en BD con fecha de diciembre 2025
    cursor.execute("""
        SELECT COUNT(*) 
        FROM Licitaciones_Cabecera 
        WHERE fecha_publicacion >= '2025-12-01' 
        AND fecha_publicacion < '2026-01-01'
    """)
    total_dic = cursor.fetchone()[0]
    
    print(f"\n✅ Licitaciones en base de datos (diciembre 2025): {total_dic:,}")
    
    # 3. Distribución por categoría en diciembre 2025
    print("\n📊 Distribución por Categoría (Diciembre 2025):")
    cursor.execute("""
        SELECT categoria, COUNT(*) as total 
        FROM Licitaciones_Cabecera 
        WHERE fecha_publicacion >= '2025-12-01' 
        AND fecha_publicacion < '2026-01-01'
        GROUP BY categoria 
        ORDER BY total DESC
    """)
    for cat, total in cursor.fetchall():
        print(f"   • {cat}: {total:,}")
    
    # 4. Distribución por estado en diciembre 2025
    print("\n🔖 Distribución por Estado (Diciembre 2025):")
    cursor.execute("""
        SELECT estado_proceso, COUNT(*) as total 
        FROM Licitaciones_Cabecera 
        WHERE fecha_publicacion >= '2025-12-01' 
        AND fecha_publicacion < '2026-01-01'
        GROUP BY estado_proceso 
        ORDER BY total DESC
        LIMIT 5
    """)
    for estado, total in cursor.fetchall():
        print(f"   • {estado}: {total:,}")
    
    # 5. Fechas exactas en diciembre 2025
    cursor.execute("""
        SELECT MIN(fecha_publicacion), MAX(fecha_publicacion) 
        FROM Licitaciones_Cabecera 
        WHERE fecha_publicacion >= '2025-12-01' 
        AND fecha_publicacion < '2026-01-01'
    """)
    fechas = cursor.fetchone()
    print(f"\n📅 Rango exacto: {fechas[0]} a {fechas[1]}")
    
    # 6. Top 5 departamentos con más licitaciones en diciembre
    print("\n🗺️ Top 5 Departamentos (Diciembre 2025):")
    cursor.execute("""
        SELECT departamento, COUNT(*) as total 
        FROM Licitaciones_Cabecera 
        WHERE fecha_publicacion >= '2025-12-01' 
        AND fecha_publicacion < '2026-01-01'
        AND departamento IS NOT NULL
        GROUP BY departamento 
        ORDER BY total DESC
        LIMIT 5
    """)
    for dept, total in cursor.fetchall():
        print(f"   • {dept}: {total:,}")
    
    # 7. Monto total estimado en diciembre 2025
    cursor.execute("""
        SELECT SUM(monto_estimado) 
        FROM Licitaciones_Cabecera 
        WHERE fecha_publicacion >= '2025-12-01' 
        AND fecha_publicacion < '2026-01-01'
    """)
    monto_total = cursor.fetchone()[0] or 0
    print(f"\n💰 Monto total estimado: S/ {monto_total:,.2f}")
    
    print("\n" + "=" * 70)
    print("✅ DATOS CARGADOS Y DISPONIBLES EN LA BASE DE DATOS")
    print("=" * 70)
    
    conn.close()
    
except Exception as e:
    print(f"\n❌ Error al conectar con la base de datos: {e}")
