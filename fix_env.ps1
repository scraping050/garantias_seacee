Write-Host "============================" -ForegroundColor Cyan
Write-Host "REPARANDO ENTORNO PYTHON" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# 1. Detectar Python
$pyCmd = "python"
try {
    & $pyCmd --version | Out-Null
    Write-Host "Python detectado: $(& $pyCmd --version 2>&1)" -ForegroundColor Green
}
catch {
    try {
        $pyCmd = "py"
        & $pyCmd --version | Out-Null
        Write-Host "Python detectado (py launcher): $(& $pyCmd --version 2>&1)" -ForegroundColor Green
    }
    catch {
        Write-Host "ERROR: No se encontro Python instalado en el sistema." -ForegroundColor Red
        Write-Host "Por favor instala Python 3.10+ y agregalo al PATH." -ForegroundColor Yellow
        exit 1
    }
}

# 2. Eliminar venv corrupto
if (Test-Path "venv") {
    Write-Host "Eliminando entorno virtual corrupto (creado por otro usuario)..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "venv" -ErrorAction SilentlyContinue
}

# 3. Crear nuevo venv
Write-Host "Creando nuevo entorno virtual..." -ForegroundColor Yellow
& $pyCmd -m venv venv
if (-not (Test-Path "venv")) {
    Write-Host "ERROR: Fallo al crear venv." -ForegroundColor Red
    exit 1
}

# 4. Instalar dependencias
Write-Host "Instalando dependencias (esto puede tardar unos minutos)..." -ForegroundColor Yellow
# Usar el pip del nuevo venv
$pip = "venv\Scripts\pip.exe"
if (-not (Test-Path $pip)) {
    $pip = "venv\bin\pip" # Linux/Mac fallback just in case
}

& $pip install -r requirements.txt --upgrade

Write-Host ""
Write-Host "LISTO! Entorno reparado." -ForegroundColor Green
Write-Host "Ahora intenta ejecutar de nuevo: .\restart-services.ps1" -ForegroundColor Cyan
