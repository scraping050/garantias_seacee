
import requests
import json
import sys

BASE_URL = "http://localhost:8000/api"

def check_endpoint(url, name):
    print(f"--- Checking {name} ---")
    try:
        response = requests.get(url)
        if response.status_code != 200:
            print(f"FAILED: Status {response.status_code}")
            return
        
        data = response.json()
        
        insurers = []
        if "aseguradoras" in data:
            insurers = data["aseguradoras"]
        elif "data" in data and isinstance(data["data"], list) and "name" in data["data"][0]:
            # For ranking endpoints
            insurers = [d["name"] for d in data["data"]]
        
        print(f"Found {len(insurers)} items.")
        
        # Check for duplicates or non-normalized values
        bcp_variants = [i for i in insurers if "CREDITO" in i.upper() or "BCP" in i.upper()]
        print(f"BCP/Credito variants found: {bcp_variants}")
        
        if len(bcp_variants) > 0 and len(set(bcp_variants)) == 1 and "BCP" in bcp_variants:
             print("SUCCESS: BCP normalized correctly.")
        elif len(bcp_variants) == 0:
             print("WARNING: No BCP found (might be no data, or correct if no data).")
        else:
             print("FAILURE: Multiple variants found or not normalized to BCP!")

    except Exception as e:
        print(f"Error: {e}")

# 1. Check Search Filters (Busqueda, Reportes, Gestion Manual)
check_endpoint(f"{BASE_URL}/licitaciones/filters/all", "Licitaciones Filter Options")

# 2. Check Dashboard Filters
check_endpoint(f"{BASE_URL}/dashboard/filter-options", "Dashboard Filter Options")

# 3. Check Dashboard Ranking
check_endpoint(f"{BASE_URL}/dashboard/financial-entities-ranking?year=2024", "Dashboard Ranking")
check_endpoint(f"{BASE_URL}/dashboard/financial-entities-ranking?year=2025", "Dashboard Ranking 2025")
