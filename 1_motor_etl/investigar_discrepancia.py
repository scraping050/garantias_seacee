import mysql.connector
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv(r'c:\laragon\www\BRAYAN\proyecto_garantias\.env')

try:
    conn = mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS'),
        database=os.getenv('DB_NAME')
    )
    
    cursor = conn.cursor()
    
    print("=" * 80)
    print("🔍 INVESTIGACIÓN: ¿Por qué 626 en JSON → 202 en BD?")
    print("=" * 80)
    
    # 1. Licitaciones del archivo diciembre 2025 en BD
    print(f"\n1️⃣ Registros en BD del archivo 2025-12_seace_v3.json:")
    cursor.execute("""
        SELECT COUNT(*) 
        FROM Licitaciones_Cabecera 
        WHERE archivo_origen = '2025-12_seace_v3.json'
    """)
    total_archivo = cursor.fetchone()[0]
    print(f"   Total en BD: {total_archivo:,}")
    
    # 2. IDs únicos vs totales
    cursor.execute("""
        SELECT 
            COUNT(*) as total,
            COUNT(DISTINCT id_convocatoria) as unicos
        FROM Licitaciones_Cabecera 
        WHERE archivo_origen = '2025-12_seace_v3.json'
    """)
    row = cursor.fetchone()
    print(f"   IDs únicos: {row[1]:,}")
    print(f"   Posibles duplicados: {row[0] - row[1]}")
    
    # 3. Licitaciones por fecha de diciembre (independiente del archivo)
    cursor.execute("""
        SELECT COUNT(*) 
        FROM Licitaciones_Cabecera 
        WHERE fecha_publicacion >= '2025-12-01' 
        AND fecha_publicacion < '2026-01-01'
    """)
    total_dic = cursor.fetchone()[0]
    print(f"\n2️⃣ Licitaciones con fecha de diciembre 2025: {total_dic:,}")
    
    # 4. Ver si hay registros sin fecha
    cursor.execute("""
        SELECT COUNT(*) 
        FROM Licitaciones_Cabecera 
        WHERE archivo_origen = '2025-12_seace_v3.json'
        AND fecha_publicacion IS NULL
    """)
    sin_fecha = cursor.fetchone()[0]
    print(f"\n3️⃣ Registros del archivo sin fecha: {sin_fecha}")
    
    # 5. Distribución de fechas del archivo
    print(f"\n4️⃣ Distribución de fechas en BD (archivo 2025-12):")
    cursor.execute("""
        SELECT 
            DATE_FORMAT(fecha_publicacion, '%Y-%m') as mes,
            COUNT(*) as total
        FROM Licitaciones_Cabecera 
        WHERE archivo_origen = '2025-12_seace_v3.json'
        AND fecha_publicacion IS NOT NULL
        GROUP BY DATE_FORMAT(fecha_publicacion, '%Y-%m')
        ORDER BY mes
    """)
    for mes, total in cursor.fetchall():
        print(f"   {mes}: {total:,}")
    
    # 6. Ver algunos IDs de ejemplo
    print(f"\n5️⃣ Primeros 5 IDs de convocatoria del archivo:")
    cursor.execute("""
        SELECT id_convocatoria, fecha_publicacion, estado_proceso
        FROM Licitaciones_Cabecera 
        WHERE archivo_origen = '2025-12_seace_v3.json'
        ORDER BY fecha_publicacion
        LIMIT 5
    """)
    for id_conv, fecha, estado in cursor.fetchall():
        print(f"   {id_conv} | {fecha} | {estado}")
    
    # 7. Registros que pudieron ser actualizaciones (ya existían)
    cursor.execute("""
        SELECT 
            COUNT(*) as total,
            MAX(last_update) as ultima_actualizacion
        FROM Licitaciones_Cabecera 
        WHERE archivo_origen = '2025-12_seace_v3.json'
    """)
    total, ultima_act = cursor.fetchone()
    print(f"\n6️⃣ Última actualización de estos registros: {ultima_act}")
    
    # 8. CLAVE: Ver en control_cargas
    cursor.execute("""
        SELECT nombre_archivo, estado, fecha_fin, registros_procesados
        FROM control_cargas
        WHERE nombre_archivo = '2025-12_seace_v3.json'
    """)
    control = cursor.fetchone()
    if control:
        print(f"\n7️⃣ Registro en control_cargas:")
        print(f"   Archivo: {control[0]}")
        print(f"   Estado: {control[1]}")
        print(f"   Fecha procesamiento: {control[2]}")
        print(f"   Registros procesados (según control): {control[3]:,}")
    
    print("\n" + "=" * 80)
    print("📊 RESUMEN DE LA DISCREPANCIA")
    print("=" * 80)
    print(f"\n• Licitaciones Públicas en JSON:     626")
    print(f"• Registros cargados en BD:          {total_archivo:,}")
    print(f"• Diferencia:                        {626 - total_archivo}")
    
    print("\n💡 Posibles causas de la diferencia:")
    print("   1. Validación de id_convocatoria vacío")
    print("   2. Registros duplicados (ON DUPLICATE KEY UPDATE)")
    print("   3. Fechas inválidas o fuera de rango")
    print("   4. Campos obligatorios faltantes")
    print("   5. Errores durante inserción (modo fila-por-fila)")
    
    print("\n" + "=" * 80)
    
    conn.close()
    
except Exception as e:
    print(f"\n❌ Error: {e}")
