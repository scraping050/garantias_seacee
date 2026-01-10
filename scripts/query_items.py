
import mysql.connector
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "")
DB_NAME = os.getenv("DB_NAME", "garantias_seace")

def query_items():
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME
        )
        cursor = conn.cursor(dictionary=True)

        print("--- Columns in Licitaciones_Adjudicaciones ---")
        cursor.execute("SHOW COLUMNS FROM Licitaciones_Adjudicaciones")
        columns = [col['Field'] for col in cursor.fetchall()]
        print(columns)

        # Frontend uses 'estado_item'. Let's check for it.
        target_col = 'estado_item'
        
        # Check if column exists
        if target_col in columns:
            print(f"\n--- Distinct values in '{target_col}' ---")
            cursor.execute(f"SELECT DISTINCT {target_col} FROM Licitaciones_Adjudicaciones WHERE {target_col} IS NOT NULL AND {target_col} != ''")
            rows = cursor.fetchall()
            if not rows:
                print("(No data found)")
            for row in rows:
                print(f"- {row[target_col]}")
        else:
            print(f"\nCol '{target_col}' not found. Searching for alternatives...")
            candidates = [c for c in columns if 'estado' in c.lower()]
            if candidates:
                print(f"Candidates: {candidates}")
                # Query the first candidate
                cand = candidates[0]
                print(f"checking {cand}...")
                cursor.execute(f"SELECT DISTINCT {cand} FROM Licitaciones_Adjudicaciones LIMIT 10")
                rows = cursor.fetchall()
                for row in rows:
                    print(f"- {row[cand]}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    query_items()
