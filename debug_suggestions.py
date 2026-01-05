from app.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()
try:
    search_term = "MUNICIPALIDAD"
    pattern = f"%{search_term}%"
    print(f"Searching for pattern: {pattern}")
    
    sql = text("SELECT DISTINCT UPPER(TRIM(comprador)) FROM licitaciones_cabecera WHERE UPPER(comprador) LIKE :p LIMIT 5")
    result = db.execute(sql, {"p": pattern}).fetchall()
    print("Results:", result)
except Exception as e:
    print("Error:", e)
finally:
    db.close()
