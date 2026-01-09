
"""
Utility for normalizing data across the application.
Centralizes the logic for mapping inconsistent insurer names (and potentially others) to canonical values.
"""

# Mapa maestro de normalización para Aseguradoras / Entidades Financieras
NORMALIZATION_MAP = {
    # BBVA
    "BBVA": "BBVA",
    # BCP / Credito
    "CREDITO": "BCP",
    "BCP": "BCP",
    # Interbank
    "INTERBANK": "INTERBANK",
    "INTERNACIONAL": "INTERBANK", # Banco Internacional del Peru
    # Cesce
    "CESCE": "CESCE",
    # Mapfre
    "MAPFRE": "MAPFRE",
    # Secrex
    "SECREX": "SECREX",
    # La Positiva
    "POSITIVA": "LA POSITIVA",
    # Rimac
    "RIMAC": "RIMAC",
    # Insur
    "INSUR": "INSUR",
    # Crecer
    "CRECER": "CRECER",
    # Avla
    "AVLA": "AVLA",
    # Mundial
    "MUNDIAL": "MUNDIAL",
    # Liberty
    "LIBERTY": "LIBERTY",
    # Citibank
    "CITI": "CITIBANK",
    # Chubb
    "CHUBB": "CHUBB",
    # Cardif
    "CARDIF": "CARDIF",
    # Financiera OH
    "OH": "FINANCIERA OH",
    # Financiera Confianza
    "CONFIANZA": "FINANCIERA CONFIANZA",
    # GNB
    "GNB": "BANCO GNB",
    # Pichincha
    "PICHINCHA": "BANCO PICHINCHA",
    # BanBif
    "BANBIF": "BANBIF",
    "BIF": "BANBIF",
    # Scotiabank
    "SCOTIABANK": "SCOTIABANK",
    "SCOTIA": "SCOTIABANK"
}

def normalize_insurer_name(name: str) -> str:
    """
    Normalizes a financial entity/insurer name using the central map.
    Returns the original name if no match is found, but cleaned up.
    """
    if not name:
        return ""
    
    # Basic cleanup
    upper_name = name.upper().strip()
    
    # 1. Direct key match check (optimization)
    # Check if any key from the map is contained in the name
    # Priority: longer keys first to avoid partial matches being wrong? 
    # Actually, the map keys are short distinct tokens.
    
    canonical_name = upper_name # Default to original upper
    
    found = False
    for key, canonical in NORMALIZATION_MAP.items():
        if key in upper_name:
            canonical_name = canonical
            found = True
            break # Stop at first match. Order of map matters only if keys overlap (e.g. "CREDITO" vs "BANCO DE CREDITO")
            
    return canonical_name
