from app.database import SessionLocal
from app.models.seace import LicitacionesCabecera
from sqlalchemy import func

db = SessionLocal()
try:
    results = db.query(
        LicitacionesCabecera.departamento, 
        func.count(LicitacionesCabecera.id_convocatoria)
    ).filter(
        LicitacionesCabecera.departamento.isnot(None),
        LicitacionesCabecera.departamento != ""
    ).group_by(
        LicitacionesCabecera.departamento
    ).order_by(
        func.count(LicitacionesCabecera.id_convocatoria).desc()
    ).all()

    print(f"Total Unique Departments Found: {len(results)}")
    print("-" * 30)
    for dept, count in results:
        print(f"{dept}: {count}")
    print("-" * 30)
finally:
    db.close()
