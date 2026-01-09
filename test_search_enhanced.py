"""
Script de prueba para verificar la búsqueda mejorada en el módulo BUSQUEDA
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/licitaciones"

# Casos de prueba
test_cases = [
    {
        "name": "Búsqueda por RUC",
        "search": "20131312955",
        "expected": "Debe encontrar licitaciones con ese RUC de ganador"
    },
    {
        "name": "Búsqueda por Banco",
        "search": "BCP",
        "expected": "Debe encontrar licitaciones con garantías del BCP"
    },
    {
        "name": "Búsqueda por Ubicación",
        "search": "LIMA",
        "expected": "Debe encontrar licitaciones en Lima"
    },
    {
        "name": "Búsqueda por Categoría",
        "search": "BIENES",
        "expected": "Debe encontrar licitaciones de categoría BIENES"
    },
    {
        "name": "Búsqueda por Estado",
        "search": "CONVOCADO",
        "expected": "Debe encontrar licitaciones en estado CONVOCADO"
    },
    {
        "name": "Búsqueda por Ganador",
        "search": "CONSORCIO",
        "expected": "Debe encontrar licitaciones ganadas por consorcios"
    },
    {
        "name": "Búsqueda por Tipo Garantía",
        "search": "FIEL",
        "expected": "Debe encontrar licitaciones con garantía de fiel cumplimiento"
    },
    {
        "name": "Búsqueda parcial",
        "search": "MUNIC",
        "expected": "Debe encontrar MUNICIPALIDAD y similares"
    },
    {
        "name": "Búsqueda por ID",
        "search": "AS-SM",
        "expected": "Debe encontrar licitaciones con ese patrón en ID"
    },
    {
        "name": "Búsqueda por Moneda",
        "search": "USD",
        "expected": "Debe encontrar licitaciones en dólares"
    }
]

print("=" * 80)
print("PRUEBAS DE BÚSQUEDA MEJORADA - MÓDULO BUSQUEDA")
print("=" * 80)
print()

for i, test in enumerate(test_cases, 1):
    print(f"{i}. {test['name']}")
    print(f"   Término: '{test['search']}'")
    print(f"   Esperado: {test['expected']}")
    
    try:
        response = requests.get(BASE_URL, params={"search": test['search'], "limit": 5})
        
        if response.status_code == 200:
            data = response.json()
            total = data.get('total', 0)
            items = data.get('items', [])
            
            print(f"   ✅ Resultados encontrados: {total}")
            
            if total > 0 and items:
                # Mostrar primer resultado como ejemplo
                first = items[0]
                print(f"   📄 Ejemplo: {first.get('nomenclatura', 'N/A')[:60]}...")
                print(f"      Comprador: {first.get('comprador', 'N/A')[:50]}...")
            else:
                print(f"   ⚠️  No se encontraron resultados")
        else:
            print(f"   ❌ Error HTTP {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()

print("=" * 80)
print("PRUEBAS COMPLETADAS")
print("=" * 80)
