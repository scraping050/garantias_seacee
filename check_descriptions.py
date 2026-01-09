import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if "mysql" in DATABASE_URL and "pymysql" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://")

engine = create_engine(DATABASE_URL)

# Check for:
# 1. Descriptions ending in "..." (common truncation sign)
# 2. Descriptions that are very long (checking max length)
# 3. Descriptions that might be cut off (no period at end, though many aren't sentences)

sql = text("""
    SELECT 
        nomenclatura, 
        id_convocatoria,
        LENGTH(descripcion) as desc_len, 
        descripcion
    FROM Licitaciones_Cabecera
    WHERE 
        descripcion LIKE '%...' 
        OR descripcion LIKE '%..'
    ORDER BY nomenclatura
""")

try:
    with engine.connect() as conn:
        result = conn.execute(sql)
        rows = result.fetchall()
        
        print(f"REPORT: TRUNCATED DESCRIPTIONS FOUND")
        print(f"Total Records: {len(rows)}")
        print("=" * 60)
        
        if not rows:
            print("No truncated descriptions found.")
        
        for row in rows:
            print(f"ID: {row.id_convocatoria} | NOMENCLATURA: {row.nomenclatura}")
            print(f"DESC_END: ...{row.descripcion[-50:]}") # Show last 50 chars
            print("-" * 60)
            
except Exception as e:
    print(f"Error: {e}")
