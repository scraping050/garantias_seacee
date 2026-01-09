from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

# Construct database URL directly to avoid app imports
# Assuming standard local config or try to read .env
try:
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        # Fallback to the one seen in other files or common default
        DATABASE_URL = "mysql+pymysql://root:123456789@localhost/garantias_seace"

    engine = create_engine(DATABASE_URL)

    with engine.connect() as connection:
        result = connection.execute(text("SELECT departamento, COUNT(*) as count FROM Licitaciones_Cabecera WHERE departamento IS NOT NULL AND departamento != '' GROUP BY departamento ORDER BY count DESC"))
        
        rows = result.fetchall()
        print(f"Total Unique Departments Found: {len(rows)}")
        print("-" * 30)
        for row in rows:
            print(f"{row[0]}: {row[1]}")
        print("-" * 30)

except Exception as e:
    print(f"Error: {e}")
