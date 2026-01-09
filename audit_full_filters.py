
import requests
import json
import sys

BASE_URL = "http://localhost:8000/api"

def audit_filters():
    print("=== AUDITING ALL SEARCH FILTERS ===")
    
    url = f"{BASE_URL}/licitaciones/filters/all"
    try:
        response = requests.get(url)
        if response.status_code != 200:
            print(f"FAILED: Status {response.status_code}")
            return
            
        data = response.json()
        
        # 1. Years Audit
        print("\n--- Years (Anios) ---")
        anios = data.get("anios", [])
        print(f"Found: {anios}")
        if 2026 not in anios:
            print("❌ WARNING: 2026 is MISSING!")
        else:
            print("✅ 2026 is present.")
            
        if 2025 not in anios:
            print("❌ WARNING: 2025 is MISSING!")
        else:
            print("✅ 2025 is present.")

        # 2. Insurers Audit (Re-confirm)
        print("\n--- Insurers (Aseguradoras) ---")
        asegs = data.get("aseguradoras", [])
        print(f"Count: {len(asegs)}")
        if "BCP" in asegs and "CREDITO" not in asegs:
             print("✅ Normalization appears active (BCP present, CREDITO absent)")
        else:
             print(f"⚠️  Normalization check: BCP={ 'BCP' in asegs}, CREDITO={'CREDITO' in asegs}")

        # 3. Departamentos
        print("\n--- Departments ---")
        depts = data.get("departamentos", [])
        print(f"Count: {len(depts)}")
        print(f"Sample: {depts[:5]}")
        if len(depts) == 0:
            print("❌ WARNING: No departments found!")

        # 4. Categorias
        print("\n--- Categories ---")
        cats = data.get("categorias", [])
        print(f"Found: {cats}")

        # 5. Entidades (Comprador)
        print("\n--- Entities (Comprador) ---")
        ents = data.get("entidades", [])
        print(f"Count: {len(ents)}")
        print(f"Sample: {ents[:5]}")

        # 6. Tipos de Garantia
        print("\n--- Warranty Types ---")
        types = data.get("tipos_garantia", [])
        print(f"Found: {types}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    audit_filters()
