import sys
import requests
import mysql.connector
from mysql.connector import Error
import os
import time
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
from requests.packages.urllib3.exceptions import InsecureRequestWarning

# --- CONFIGURACIÓN INICIAL ---
# Parche de codificación para Windows
if sys.platform.startswith('win'):
    try: 
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except: pass

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)
load_dotenv(os.path.join(parent_dir, ".env"))

# Carpetas
CARPETA_EVIDENCIA = os.path.join(parent_dir, "evidencia_consorcios")
if not os.path.exists(CARPETA_EVIDENCIA): os.makedirs(CARPETA_EVIDENCIA)

DB_CONFIG = {
    'host': os.getenv("DB_HOST"),
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASS"),
    'database': os.getenv("DB_NAME"),
    'charset': 'utf8mb4'
}

# URLs
URL_API_CONTRATO = "https://prod4.seace.gob.pe:9000/api/bus/contrato/idContrato/{}"
URL_DESCARGA_DOC = "https://prod4.seace.gob.pe:9000/api/con/documentos/descargar/{}"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://prod4.seace.gob.pe/"
}

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s', handlers=[logging.StreamHandler(sys.stdout)])

# --- GESTIÓN DE BASE DE DATOS ---
def obtener_conexion():
    try: return mysql.connector.connect(**DB_CONFIG)
    except Error as e: 
        logging.error(f"Error DB: {e}")
        return None

def obtener_pendientes():
    conn = obtener_conexion()
    if not conn: return []
    cursor = conn.cursor()
    # Buscamos registros que les falte el banco O que sean consorcios sin procesar
    # Nota: Asumimos que si entidad_financiera es NULL, no hemos pasado por aquí.
    sql = """
        SELECT id_adjudicacion, id_contrato, ganador_nombre 
        FROM Licitaciones_Adjudicaciones 
        WHERE (id_contrato IS NOT NULL AND id_contrato != '')
          AND (entidad_financiera IS NULL) 
        LIMIT 50 
    """
    cursor.execute(sql)
    pendientes = cursor.fetchall()
    conn.close()
    return pendientes

def guardar_garantias(resultados):
    if not resultados: return
    conn = obtener_conexion()
    if not conn: return
    cursor = conn.cursor()
    sql = "UPDATE Licitaciones_Adjudicaciones SET entidad_financiera = %s WHERE id_adjudicacion = %s"
    try:
        cursor.executemany(sql, resultados)
        conn.commit()
    except Error as e:
        logging.error(f"❌ Error guardando garantías: {e}")
    finally:
        cursor.close()
        conn.close()

def guardar_consorcio_db(id_contrato, miembros):
    conn = obtener_conexion()
    if not conn: return
    cursor = conn.cursor()
    sql = """
        INSERT INTO Detalle_Consorcios (id_contrato, ruc_miembro, nombre_miembro, porcentaje_participacion)
        VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE fecha_registro=NOW()
    """
    datos = []
    for m in miembros:
        ruc = str(m.get('nroDocumento') or m.get('ruc') or 'S/N')[:20]
        nombre = str(m.get('nombreRazonSocial') or m.get('nombre') or 'DESCONOCIDO')[:500]
        part = m.get('porcentajeParticipacion') or 0.0
        datos.append((id_contrato, ruc, nombre, part))
    
    try:
        if datos: cursor.executemany(sql, datos)
        conn.commit()
    except Error as e:
        logging.error(f"❌ Error guardando consorcio {id_contrato}: {e}")
    finally:
        cursor.close()
        conn.close()

# --- WORKER PRINCIPAL ---
def procesar_contrato(item):
    id_adj, id_contrato, nombre_ganador = item
    url = URL_API_CONTRATO.format(id_contrato)
    
    res_banco = "NO_INFO"
    info_consorcio = "NO_CONSORCIO" # Estados: OK_API, PDF_DOWNLOADED, ERROR
    
    try:
        r = requests.get(url, headers=HEADERS, verify=False, timeout=15)
        
        if r.status_code == 200:
            data = r.json()
            
            # --- 1. EXTRACCIÓN DE GARANTÍAS (BANCOS) ---
            garantias = data.get('listaGarantiaContrato') or []
            emisores = set()
            for g in garantias:
                banco = g.get('entidadEmisora')
                if banco: 
                    banco_limpio = banco.strip().upper().replace("BANCO", "").strip()
                    emisores.add(banco_limpio)
            
            if emisores: res_banco = " | ".join(sorted(emisores))
            else: res_banco = "SIN_GARANTIA"

            # --- 2. EXTRACCIÓN DE CONSORCIOS (LÓGICA HÍBRIDA) ---
            # Solo si el nombre del ganador indica que es un consorcio
            if "CONSORCIO" in str(nombre_ganador).upper():
                contratista = data.get('contratista', {})
                miembros = []
                
                # A) INTENTO API
                if isinstance(contratista, dict):
                    miembros = contratista.get('listaMiembrosConsorcio') or contratista.get('listaConsorciados') or []
                
                if miembros:
                    guardar_consorcio_db(id_contrato, miembros)
                    info_consorcio = "OK_API"
                else:
                    # B) INTENTO PDF (PLAN B)
                    id_pdf = None
                    nombre_pdf = f"Consorcio_{id_contrato}.pdf"
                    
                    if data.get("idDocumentoConsorcio"):
                        id_pdf = data.get("idDocumentoConsorcio")
                    elif data.get("idDocumento2") and "CONTRATO" in str(data.get("archivoAdjunto2", "")).upper():
                        id_pdf = data.get("idDocumento2")
                    
                    if id_pdf:
                        # Descargar PDF
                        url_pdf = URL_DESCARGA_DOC.format(id_pdf)
                        ruta_pdf = os.path.join(CARPETA_EVIDENCIA, nombre_pdf)
                        try:
                            with requests.get(url_pdf, headers=HEADERS, stream=True, verify=False, timeout=30) as r_pdf:
                                if r_pdf.status_code == 200:
                                    with open(ruta_pdf, 'wb') as f:
                                        for chunk in r_pdf.iter_content(chunk_size=1024):
                                            f.write(chunk)
                                    info_consorcio = "PDF_DOWNLOADED"
                        except:
                            info_consorcio = "ERROR_PDF"
                    else:
                        info_consorcio = "PDF_NOT_FOUND"

        elif r.status_code == 404:
            res_banco = "CONTRATO_NO_ENCONTRADO_API"
        else:
            res_banco = f"ERROR_API_{r.status_code}"
            
    except Exception as e:
        res_banco = "ERROR_CONEXION"

    return (res_banco, id_adj, info_consorcio)

# --- MAIN ---
def main():
    logging.info("🕷️ SPIDER UNIFICADO V2.0 (Bancos + Consorcios)")
    
    # Crear columna en BD si no existe (Solo bancos, la tabla consorcios debe existir aparte)
    conn = obtener_conexion()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("ALTER TABLE Licitaciones_Adjudicaciones ADD COLUMN entidad_financiera VARCHAR(255)")
        except: pass
        conn.close()

    total_procesados = 0
    ciclos = 0
    
    while ciclos < 50: 
        pendientes = obtener_pendientes()
        if not pendientes:
            logging.info("🏁 No hay más pendientes.")
            break
            
        logging.info(f"⚡ Procesando lote de {len(pendientes)}...")
        
        datos_para_update_bancos = []
        
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = {executor.submit(procesar_contrato, item): item for item in pendientes}
            for future in as_completed(futures):
                res_banco, id_adj, estado_consorcio = future.result()
                
                # Preparamos update masivo de bancos
                datos_para_update_bancos.append((res_banco, id_adj))
                
                # Log rápido de qué pasó con el consorcio
                if estado_consorcio == "PDF_DOWNLOADED":
                    logging.info(f"   📂 PDF Descargado para adjudicación {id_adj}")
                
                total_procesados += 1

        # Guardamos bancos en lote
        guardar_garantias(datos_para_update_bancos)
        ciclos += 1
    
    logging.info(f"🏁 Finalizado. Total procesados: {total_procesados}")

if __name__ == "__main__":
    main()