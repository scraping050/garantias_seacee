import sys
import os
import shutil
import logging
import re
import argparse
import zipfile
import gzip
import requests
from typing import List, Dict, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

# --- SILENCIADOR NUCLEAR (WDM) ---
os.environ['WDM_LOG'] = '0'

# --- SELENIUM ---
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager

# --- 1. CONFIGURACIÓN ---
URL_BASE_DESCARGAS = "https://contratacionesabiertas.oece.gob.pe/descargas?page=1&paginateBy=100&source=seace_v3&year="

HEADERS_HUMANOS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
}

script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)
db_folder_path = os.path.join(parent_dir, "1_database")
os.makedirs(db_folder_path, exist_ok=True)

# --- LOGGING ---
logging.basicConfig(
    level=logging.INFO, 
    format="%(asctime)s [%(levelname)s] %(message)s", 
    handlers=[logging.StreamHandler(sys.stderr)]
)
logging.getLogger("urllib3").setLevel(logging.WARNING)
logging.getLogger("selenium").setLevel(logging.WARNING)

if sys.platform.startswith("win"):
    try: sys.stdout.reconfigure(encoding="utf-8")
    except: pass

# --- 2. DRIVER FACTORY ---
def iniciar_driver() -> Optional[webdriver.Chrome]:
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--log-level=3")
    
    prefs = {
        "profile.managed_default_content_settings.images": 2, 
        "profile.default_content_setting_values.notifications": 2,
        "profile.managed_default_content_settings.stylesheets": 2,
    }
    opts.add_experimental_option("prefs", prefs)
    
    try:
        s = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=s, options=opts)
        return driver
    except Exception as e:
        logging.critical(f"🔥 Error fatal iniciando Chrome: {e}")
        return None

# --- 3. SCRAPING ---
def encontrar_links_de_descarga(anios: List[int]) -> List[Dict[str, str]]:
    lista_final = []
    
    driver = iniciar_driver()
    if not driver: return []
    
    try:
        patron_url = re.compile(r"/(json|sha)/(\d{4})/(\d{2})")

        for anio_buscado in anios:
            url_pagina = f"{URL_BASE_DESCARGAS}{anio_buscado}"
            logging.info(f"🔍 Auditando: {url_pagina}")
            
            try:
                driver.get(url_pagina)
                try:
                    WebDriverWait(driver, 15).until(
                        EC.presence_of_element_located((By.XPATH, "//a[contains(@href, 'api/v1/file')]"))
                    )
                except TimeoutException:
                    logging.warning(f"⚠️ Sin datos para el año {anio_buscado}.")
                    continue

                elementos = driver.find_elements(By.TAG_NAME, "a")
                links_encontrados = {} 

                for elem in elementos:
                    try:
                        url = elem.get_attribute("href")
                        if not url: continue
                        
                        match = patron_url.search(url)
                        if match:
                            tipo, anio_det, mes_det = match.groups()
                            if anio_det != str(anio_buscado): continue
                            
                            if mes_det not in links_encontrados: links_encontrados[mes_det] = {}
                            if tipo == "json": links_encontrados[mes_det]["json_url"] = url
                            elif tipo == "sha": links_encontrados[mes_det]["sha_url"] = url
                    except Exception: 
                        continue 

                for mes, urls in links_encontrados.items():
                    if "json_url" in urls:
                        lista_final.append({
                            "nombre_base": f"{anio_buscado}-{mes}_seace_v3",
                            "json_url": urls["json_url"],
                            "sha_url": urls.get("sha_url", "")
                        })

            except Exception as e:
                logging.error(f"❌ Error procesando año {anio_buscado}: {e}")

    finally:
        if driver: driver.quit()
        
    return lista_final

# --- 4. WORKER DE DESCARGA (BLINDADO + SHA) ---
def tarea_descarga(archivo_info: Dict[str, str]) -> Dict[str, str]:
    nombre_json = f"{archivo_info['nombre_base']}.json"
    ruta_json_final = os.path.join(db_folder_path, nombre_json)
    ruta_temp = os.path.join(db_folder_path, f"temp_{nombre_json}")
    
    res = {"nombre": archivo_info["nombre_base"], "estado": "UNKNOWN", "mensaje": ""}
    
    # 1. Idempotencia JSON
    json_ok = os.path.exists(ruta_json_final) and os.path.getsize(ruta_json_final) > 0
    if json_ok:
        res["estado"] = "OMITIDO"
        res["mensaje"] = "Ya existe"
    
    # Si no existe, lo descargamos
    if not json_ok:
        try:
            logging.info(f"⬇️ Descargando JSON: {nombre_json}...")
            
            with requests.get(archivo_info["json_url"], headers=HEADERS_HUMANOS, stream=True, timeout=600) as r:
                r.raise_for_status()
                with open(ruta_temp, "wb") as f:
                    for chunk in r.iter_content(chunk_size=1024*1024):
                        f.write(chunk)
            
            es_zip = zipfile.is_zipfile(ruta_temp)
            es_gzip = False
            with open(ruta_temp, 'rb') as f_check:
                es_gzip = f_check.read(2) == b'\x1f\x8b'

            if es_zip:
                with zipfile.ZipFile(ruta_temp) as z:
                    interno = next((n for n in z.namelist() if n.endswith(".json")), None)
                    if interno:
                        with z.open(interno) as zf, open(ruta_json_final, "wb") as fout:
                            shutil.copyfileobj(zf, fout)
                    else:
                        raise Exception("ZIP sin JSON")
            elif es_gzip:
                try:
                    with gzip.open(ruta_temp, 'rb') as f_in, open(ruta_json_final, 'wb') as f_out:
                        shutil.copyfileobj(f_in, f_out)
                except Exception as e:
                    raise Exception(f"Error GZIP: {e}")
            else:
                 shutil.move(ruta_temp, ruta_json_final)
                 
            res["estado"] = "DESCARGADO"
            
        except Exception as e:
            res["estado"] = "FALLO"
            res["mensaje"] = str(e)
            logging.error(f"Error en {nombre_json}: {e}")
            # Si falla el JSON, nos vamos, no tiene sentido bajar el SHA
            if os.path.exists(ruta_temp): 
                try: os.remove(ruta_temp)
                except: pass
            return res

    # ---------------------------------------------------------
    # 4. DESCARGA DEL SHA (NUEVO: INTEGRIDAD COMPLETA)
    # ---------------------------------------------------------
    sha_url = archivo_info.get("sha_url")
    if sha_url:
        nombre_sha = f"{archivo_info['nombre_base']}.sha"
        ruta_sha = os.path.join(db_folder_path, nombre_sha)
        
        # Solo bajamos el SHA si no existe o si acabamos de bajar un JSON nuevo
        if not os.path.exists(ruta_sha) or res["estado"] == "DESCARGADO":
            try:
                # Es un archivo pequeño, no necesitamos stream
                r_sha = requests.get(sha_url, headers=HEADERS_HUMANOS, timeout=30)
                if r_sha.status_code == 200:
                    with open(ruta_sha, "w", encoding="utf-8") as f_sha:
                        f_sha.write(r_sha.text.strip())
                    # Solo logueamos si fue una descarga activa
                    if res["estado"] == "DESCARGADO":
                        logging.info(f"   ↳ SHA descargado: {nombre_sha}")
            except Exception as e:
                # El fallo del SHA no debe marcar el proceso principal como error
                logging.warning(f"⚠️ Alerta menor: No se pudo bajar SHA para {nombre_json}: {e}")

    # Limpieza final del temporal por si acaso
    if os.path.exists(ruta_temp): 
        try: os.remove(ruta_temp)
        except: pass
                
    return res

# --- 5. MAIN ---
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--years", nargs="+", type=int, default=[2024, 2025])
    parser.add_argument("--workers", type=int, default=3)
    args = parser.parse_args()
    
    logging.info(f"🚀 DESCARGADOR V3.4 (Integrity Edition + SHA)")
    
    todos = encontrar_links_de_descarga(args.years)
    logging.info(f"📋 Archivos totales a gestionar: {len(todos)}")
    
    with ThreadPoolExecutor(max_workers=args.workers) as exe:
        futures = {exe.submit(tarea_descarga, item): item for item in todos}
        
        for f in as_completed(futures):
            item = futures[f]
            try:
                r = f.result()
                estado = r['estado']
                if estado == "DESCARGADO":
                    print(f"✅ {r['nombre']}")
                elif estado == "FALLO":
                    print(f"❌ {r['nombre']}: {r['mensaje']}")
                else:
                    print(f"⏭️ {r['nombre']} (Omitido)")
            except Exception as e:
                print(f"☠️ Error hilo {item['nombre_base']}: {e}")

if __name__ == "__main__":
    main()