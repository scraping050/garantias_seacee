"""
Verificar las categorías en la base de datos
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
print("CATEGORÍAS EN LA BASE DE DATOS")
print("=" * 80)
print()

result = conn.execute(text("""
    SELECT DISTINCT categoria, COUNT(*) as total 
    FROM Licitaciones_Cabecera 
    WHERE categoria IS NOT NULL 
    GROUP BY categoria 
    ORDER BY total DESC
"""))

categorias = result.fetchall()

for cat, total in categorias:
    print(f"{cat:30} -> {total:,} registros")

print()
print("=" * 80)
print("PROBLEMA IDENTIFICADO:")
print("=" * 80)
print()
print("Las categorías están guardadas en INGLÉS en la base de datos:")
print("  - 'goods' (debería ser 'BIENES')")
print("  - 'works' (debería ser 'OBRAS')")
print("  - 'services' (debería ser 'SERVICIOS')")
print("  - 'consultingServices' (debería ser 'CONSULTORIA')")
print()
print("SOLUCIÓN:")
print("Necesitamos traducir las categorías en el backend o frontend")
print("=" * 80)

conn.close()
