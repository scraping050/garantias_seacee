"""
Script para normalizar las categorías en la base de datos
Convierte 'goods' -> 'BIENES', 'works' -> 'OBRAS', etc.
"""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if "mysql" in DATABASE_URL and "pymysql" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://")

engine = create_engine(DATABASE_URL)
conn = engine.connect()

print("=" * 80)
print("NORMALIZACIÓN DE CATEGORÍAS")
print("=" * 80)
print()

# Mapeo de traducción
TRADUCTOR = {
    'goods': 'BIENES',
    'works': 'OBRAS',
    'services': 'SERVICIOS',
    'consultingServices': 'CONSULTORIA'
}

print("ANTES de la normalización:")
result = conn.execute(text("""
    SELECT categoria, COUNT(*) as total 
    FROM Licitaciones_Cabecera 
    WHERE categoria IS NOT NULL 
    GROUP BY categoria 
    ORDER BY categoria
"""))
for cat, total in result:
    print(f"  {cat:30} -> {total:,} registros")
print()

# Actualizar cada categoría
total_actualizados = 0
for ingles, espanol in TRADUCTOR.items():
    result = conn.execute(
        text(f"UPDATE Licitaciones_Cabecera SET categoria = :espanol WHERE categoria = :ingles"),
        {"espanol": espanol, "ingles": ingles}
    )
    affected = result.rowcount
    if affected > 0:
        print(f"✅ Actualizado: '{ingles}' -> '{espanol}' ({affected:,} registros)")
        total_actualizados += affected

conn.commit()
print()
print(f"Total de registros actualizados: {total_actualizados:,}")
print()

print("DESPUÉS de la normalización:")
result = conn.execute(text("""
    SELECT categoria, COUNT(*) as total 
    FROM Licitaciones_Cabecera 
    WHERE categoria IS NOT NULL 
    GROUP BY categoria 
    ORDER BY categoria
"""))
for cat, total in result:
    print(f"  {cat:30} -> {total:,} registros")

print()
print("=" * 80)
print("✅ NORMALIZACIÓN COMPLETADA")
print("=" * 80)

conn.close()
