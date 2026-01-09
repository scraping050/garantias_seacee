import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load env variables
load_dotenv()

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL not found in .env")
    sys.exit(1)

# Fix for pymysql if needed (usually handled by driver, but just in case)
if "mysql" in DATABASE_URL and "pymysql" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://")

engine = create_engine(DATABASE_URL)

nomenclaturas = [
    "LP-SM-9-2024-HRL-CS-1",
    "LP-SM-4-2024-ESSALUD/RAPI-1"
]

sql = text("""
    SELECT 
        c.nomenclatura, 
        c.fecha_publicacion,
        a.fecha_adjudicacion,
        a.monto_adjudicado,
        c.descripcion,
        c.id_convocatoria,
        a.ganador_nombre,
        a.ganador_ruc,
        a.entidad_financiera,
        a.tipo_garantia,
        a.estado_item,
        c.estado_proceso
    FROM Licitaciones_Cabecera c
    LEFT JOIN Licitaciones_Adjudicaciones a ON c.id_convocatoria = a.id_convocatoria
    WHERE c.nomenclatura IN :nomenclaturas
""")


try:
    with engine.connect() as conn:
        result = conn.execute(sql, {"nomenclaturas": nomenclaturas})
        rows = result.fetchall()
        
        print(f"Found {len(rows)} records:")
        print("-" * 50)
        for row in rows:
            print(f"Nomenclatura: {row.nomenclatura}")
            print(f"ID Convocatoria: {row.id_convocatoria}")
            print(f"Descripción: {row.descripcion}")
            print(f"Fecha Publicación: {row.fecha_publicacion}")
            print(f"Fecha Adjudicación: {row.fecha_adjudicacion}")
            print(f"Monto Adjudicado: {row.monto_adjudicado}")
            print(f"Ganador: {row.ganador_nombre}")
            print(f"RUC Ganador: {row.ganador_ruc}")
            print(f"Entidad Financiera: {row.entidad_financiera}")
            print(f"Tipo Garantía: {row.tipo_garantia}")
            print(f"Estado Item: {row.estado_item}")
            print(f"Estado Proceso: {row.estado_proceso}")
            print("-" * 50)

except Exception as e:
    print(f"Error querying database: {e}")
