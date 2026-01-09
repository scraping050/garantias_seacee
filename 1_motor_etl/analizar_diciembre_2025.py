import ijson
import os
from collections import Counter
from datetime import datetime

archivo_json = r"c:\laragon\www\BRAYAN\proyecto_garantias\1_database\2025\2025-12_seace_v3.json"

print("=" * 80)
print("📊 ANÁLISIS DETALLADO: 2025-12_seace_v3.json")
print("=" * 80)

# Info del archivo
tamano_bytes = os.path.getsize(archivo_json)
tamano_mb = tamano_bytes / (1024 * 1024)
print(f"\n📂 Información del Archivo:")
print(f"   • Tamaño: {tamano_mb:.2f} MB ({tamano_bytes:,} bytes)")
print(f"   • Ubicación: {archivo_json}")

# Contadores
total_registros = 0
licitaciones_publicas = 0
tipos_procedimiento = Counter()
estados = Counter()
categorias = Counter()
departamentos = Counter()
montos = []
fechas = []

print(f"\n🔄 Procesando archivo (esto puede tomar un momento)...")

try:
    with open(archivo_json, 'rb') as f:
        # Intentar estructura con 'records'
        try:
            parser = ijson.items(f, 'records.item', use_float=True)
            primer = next(parser, None)
            if primer is None:
                # Intentar sin 'records'
                f.seek(0)
                from itertools import chain
                parser = ijson.items(f, 'item', use_float=True)
            else:
                from itertools import chain
                parser = chain([primer], parser)
        except:
            f.seek(0)
            parser = ijson.items(f, 'item', use_float=True)
        
        for record in parser:
            if not record:
                continue
            
            total_registros += 1
            
            # Extraer datos
            compiled = record.get('compiledRelease', {})
            tender = compiled.get('tender', {})
            
            # Tipo de procedimiento
            tipo_proc = tender.get('procurementMethodDetails', 'DESCONOCIDO')
            tipos_procedimiento[tipo_proc] += 1
            
            # Solo analizar licitaciones públicas
            if tipo_proc == 'Licitación Pública':
                licitaciones_publicas += 1
                
                # Estado
                estado = tender.get('status', 'DESCONOCIDO')
                estados[estado] += 1
                
                # Categoría
                categoria = tender.get('mainProcurementCategory', 'OTROS')
                categorias[categoria] += 1
                
                # Monto
                monto = tender.get('value', {}).get('amount', 0)
                if monto > 0:
                    montos.append(monto)
                
                # Fecha
                fecha = compiled.get('date', '')
                if fecha:
                    try:
                        fecha_clean = fecha[:10]
                        fechas.append(fecha_clean)
                    except:
                        pass
                
                # Departamento
                buyer = compiled.get('buyer', {})
                parties = compiled.get('parties', [])
                for p in parties:
                    if p.get('id') == buyer.get('id'):
                        dept = p.get('address', {}).get('department', 'DESCONOCIDO')
                        if dept:
                            departamentos[dept] += 1
                        break
            
            # Progress cada 1000 registros
            if total_registros % 1000 == 0:
                print(f"   Procesados: {total_registros:,} registros...", end='\r')
        
        print(f"   Procesados: {total_registros:,} registros... ✅")

except Exception as e:
    print(f"\n❌ Error al procesar archivo: {e}")
    exit(1)

# ============================================================
# RESULTADOS
# ============================================================

print("\n" + "=" * 80)
print("📈 RESULTADOS DEL ANÁLISIS")
print("=" * 80)

print(f"\n1️⃣ RESUMEN GENERAL:")
print(f"   • Total de registros en archivo: {total_registros:,}")
print(f"   • Licitaciones Públicas: {licitaciones_publicas:,}")
print(f"   • Otros tipos de procesos: {total_registros - licitaciones_publicas:,}")

if total_registros > 0:
    porcentaje = (licitaciones_publicas / total_registros) * 100
    print(f"   • % Licitaciones Públicas: {porcentaje:.1f}%")

print(f"\n2️⃣ TIPOS DE PROCEDIMIENTO (Top 10):")
for tipo, cantidad in tipos_procedimiento.most_common(10):
    print(f"   • {tipo}: {cantidad:,}")

if licitaciones_publicas > 0:
    print(f"\n3️⃣ CATEGORÍAS (Solo Licitaciones Públicas):")
    for cat, cantidad in categorias.most_common():
        print(f"   • {cat}: {cantidad:,}")
    
    print(f"\n4️⃣ ESTADOS (Solo Licitaciones Públicas):")
    for est, cantidad in estados.most_common():
        print(f"   • {est}: {cantidad:,}")
    
    print(f"\n5️⃣ TOP 10 DEPARTAMENTOS (Solo Licitaciones Públicas):")
    for dept, cantidad in departamentos.most_common(10):
        print(f"   • {dept}: {cantidad:,}")
    
    if montos:
        print(f"\n6️⃣ MONTOS ESTIMADOS:")
        print(f"   • Total acumulado: S/ {sum(montos):,.2f}")
        print(f"   • Promedio: S/ {sum(montos)/len(montos):,.2f}")
        print(f"   • Mínimo: S/ {min(montos):,.2f}")
        print(f"   • Máximo: S/ {max(montos):,.2f}")
    
    if fechas:
        print(f"\n7️⃣ RANGO DE FECHAS:")
        print(f"   • Fecha más antigua: {min(fechas)}")
        print(f"   • Fecha más reciente: {max(fechas)}")
        print(f"   • Total de registros con fecha: {len(fechas):,}")

print("\n" + "=" * 80)
print("✅ ANÁLISIS COMPLETADO")
print("=" * 80)
