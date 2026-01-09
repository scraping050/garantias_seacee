"""
ETL de Consorcios usando OpenAI GPT-4 Vision
Extrae miembros de consorcios desde PDFs usando la API de OpenAI
"""
import mysql.connector
import requests
import os
import sys
import json
import time
import base64
from dotenv import load_dotenv
from requests.packages.urllib3.exceptions import InsecureRequestWarning
from openai import OpenAI

# --- CONFIGURACIÓN ---
if sys.platform.startswith('win'):
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)
load_dotenv(os.path.join(parent_dir, ".env"))

# Carpetas
CARPETA_EVIDENCIA = os.path.join(parent_dir, "evidencia_consorcios")
if not os.path.exists(CARPETA_EVIDENCIA): os.makedirs(CARPETA_EVIDENCIA)

# DB y API
DB_CONFIG = {
    'host': os.getenv("DB_HOST"), 'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASS"), 'database': os.getenv("DB_NAME"), 'charset': 'utf8mb4'
}

# OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("❌ Error Fatal: Configura OPENAI_API_KEY en tu .env")
    sys.exit()

client = OpenAI(api_key=OPENAI_API_KEY)

# URLs SEACE
URL_METADATA = "https://prod4.seace.gob.pe:9000/api/bus/contrato/idContrato/{}"
URL_DESCARGA = "https://prod4.seace.gob.pe:9000/api/con/documentos/descargar/{}"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

def obtener_pendientes():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        sql = """
            SELECT a.id_contrato, a.ganador_nombre 
            FROM Licitaciones_Adjudicaciones a
            LEFT JOIN Detalle_Consorcios d ON a.id_contrato = d.id_contrato
            WHERE a.ganador_nombre LIKE '%CONSORCIO%' 
              AND d.id_contrato IS NULL
              AND a.id_contrato IS NOT NULL AND a.id_contrato != ''
            LIMIT 50
        """
        cursor.execute(sql)
        data = cursor.fetchall()
        conn.close()
        return data
    except Exception as e:
        print(f"Error DB: {e}")
        return []

def guardar_en_bd(id_contrato, miembros):
    if not miembros: return
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        sql = """
            INSERT INTO Detalle_Consorcios (id_contrato, ruc_miembro, nombre_miembro, porcentaje_participacion)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE fecha_registro=NOW()
        """
        datos = []
        for m in miembros:
            ruc = m.get('ruc', 'S/N')
            if ruc: ruc = str(ruc).replace("RUC", "").replace(":", "").strip()[:20]
            
            nombre = str(m.get('nombre', 'DESCONOCIDO')).upper().strip()[:500]
            part = m.get('participacion', 0.0)
            if part == "NO_ESPECIFICADO" or part is None: part = 0.0
            
            datos.append((id_contrato, ruc, nombre, part))
            
        cursor.executemany(sql, datos)
        conn.commit()
        print(f"   💾 ¡ÉXITO! Guardadas {len(datos)} empresas.")
        conn.close()
    except Exception as e:
        print(f"   ❌ Error SQL: {e}")

def descargar_pdf(id_contrato):
    try:
        # 1. Metadata
        r = requests.get(URL_METADATA.format(id_contrato), headers=HEADERS, verify=False, timeout=10)
        if r.status_code != 200: return None
        data = r.json()
        
        # 2. Buscar ID del PDF
        id_doc = None
        if data.get("idDocumentoConsorcio"): 
            id_doc = data.get("idDocumentoConsorcio")
        elif data.get("idDocumento2") and "CONTRATO" in str(data.get("archivoAdjunto2", "")).upper():
            id_doc = data.get("idDocumento2")
        elif data.get("idDocumento"): 
            id_doc = data.get("idDocumento")
            
        if not id_doc: return None

        nombre_archivo = f"{id_contrato}_consorcio.pdf"
        ruta_final = os.path.join(CARPETA_EVIDENCIA, nombre_archivo)
        
        # 3. Descargar
        with requests.get(URL_DESCARGA.format(id_doc), headers=HEADERS, stream=True, verify=False, timeout=60) as r_down:
            if r_down.status_code == 200:
                with open(ruta_final, 'wb') as f:
                    for chunk in r_down.iter_content(chunk_size=8192):
                        f.write(chunk)
                return ruta_final
        return None
    except: 
        return None

def analizar_con_openai(ruta_pdf):
    """
    Analiza el PDF usando OpenAI GPT-4 Vision
    Nota: OpenAI tiene límite de 20MB por archivo
    """
    try:
        # Verificar tamaño
        peso_mb = os.path.getsize(ruta_pdf) / (1024 * 1024)
        if peso_mb > 20:
            print(f"   ⚠️ PDF muy grande ({peso_mb:.2f} MB). OpenAI límite: 20MB. Saltando...")
            return None
        
        print(f"   🤖 Analizando PDF con OpenAI GPT-4 Vision ({peso_mb:.2f} MB)...")
        
        # Leer PDF como base64
        with open(ruta_pdf, "rb") as f:
            pdf_base64 = base64.b64encode(f.read()).decode('utf-8')
        
        # Llamar a OpenAI
        response = client.chat.completions.create(
            model="gpt-4-vision-preview",  # Modelo con capacidad de leer PDFs/imágenes
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """Eres un experto digitador de contratos públicos.

TAREA: Extrae SOLO los miembros del CONSORCIO (empresas privadas que forman el consorcio).

NO incluyas:
- La entidad pública contratante
- Testigos
- Funcionarios

FORMATO DE SALIDA (JSON estricto):
[
    {"ruc": "20123456789", "nombre": "EMPRESA ABC SAC", "participacion": 60.0},
    {"ruc": "20987654321", "nombre": "EMPRESA XYZ SAC", "participacion": 40.0}
]

REGLAS:
- RUC: Solo números de 11 dígitos. Si no hay, usa null
- Nombre: Razón social completa en mayúsculas
- Participación: Número decimal (porcentaje). Si no se especifica, usa 0.0
- Si no encuentras consorcios, retorna: []"""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:application/pdf;base64,{pdf_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000,
            temperature=0.1
        )
        
        # Procesar respuesta
        texto = response.choices[0].message.content
        texto = texto.replace("```json", "").replace("```", "").strip()
        
        return json.loads(texto)
        
    except Exception as e:
        print(f"   ⚠️ Error OpenAI: {e}")
        return None

def main():
    print("🚀 ETL CONSORCIOS CON OPENAI GPT-4 VISION")
    print(f"   API Key configurada: {OPENAI_API_KEY[:20]}...")
    
    ciclo = 1
    total_procesados = 0
    total_exitosos = 0
    
    while ciclo <= 10:  # Límite de seguridad
        print(f"\n🔄 CICLO #{ciclo}")
        
        pendientes = obtener_pendientes()
        
        if not pendientes:
            print("\n🏁 ¡COMPLETADO! No quedan contratos pendientes.")
            break
            
        print(f"🎯 Procesando lote de {len(pendientes)} contratos...")
        
        for id_contrato, nombre_ganador in pendientes:
            print(f"\n🔍 Contrato: {id_contrato} ({nombre_ganador[:60]}...)")
            
            ruta_pdf = None
            try:
                # 1. Descargar PDF
                ruta_pdf = descargar_pdf(id_contrato)
                if not ruta_pdf:
                    print("   ⏩ Sin PDF disponible")
                    # Insertar registro vacío para no reprocesar
                    guardar_en_bd(id_contrato, [])
                    continue
                
                # 2. Analizar con OpenAI
                datos = analizar_con_openai(ruta_pdf)
                
                if datos and len(datos) > 0:
                    guardar_en_bd(id_contrato, datos)
                    total_exitosos += 1
                else:
                    print("   ⚠️ Sin datos extraídos")
                    guardar_en_bd(id_contrato, [])  # Marcar como procesado

                total_procesados += 1

            except Exception as e:
                print(f"   ☠️ Error: {e}")
                guardar_en_bd(id_contrato, [])  # Marcar como procesado para no repetir

            finally:
                # Limpiar PDF
                if ruta_pdf and os.path.exists(ruta_pdf):
                    try:
                        time.sleep(0.5)
                        os.remove(ruta_pdf)
                        print("   🗑️ PDF eliminado")
                    except: pass
            
            # Pausa para no saturar API
            time.sleep(2)
        
        print(f"\n✅ CICLO #{ciclo} COMPLETADO")
        print(f"   Total procesados: {total_procesados}")
        print(f"   Exitosos con datos: {total_exitosos}")
        time.sleep(3)
        ciclo += 1
    
    print(f"\n🎉 PROCESO FINALIZADO")
    print(f"   Total contratos procesados: {total_procesados}")
    print(f"   Consorcios con datos extraídos: {total_exitosos}")

if __name__ == "__main__":
    main()
