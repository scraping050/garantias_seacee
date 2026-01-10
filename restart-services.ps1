# Script para REINICIAR todos los servicios del proyecto
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "REINICIANDO SERVICIOS (MATAR Y REINICIAR)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Detener procesos existentes en puertos 8000 (Backend) y 3000 (Frontend)
Write-Host "[1/4] Deteniendo servicios anteriores..." -ForegroundColor Yellow

function Kill-Port ($port) {
    $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($processes) {
        foreach ($processId in $processes) {
            try {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host " -> Proceso en puerto $port (PID: $processId) detenido." -ForegroundColor Red
            }
            catch {
                Write-Host " -> No se pudo detener PID $processId en puerto $port." -ForegroundColor DarkGray
            }
        }
    }
    else {
        Write-Host " -> Puerto $port libre." -ForegroundColor Gray
    }
}

Kill-Port 8000
Kill-Port 3000

# Tambien matar nodos huerfanos si es necesario (Opcional, agresivo)
# Stop-Process -Name "node" -ErrorAction SilentlyContinue
# Stop-Process -Name "uvicorn" -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2
Write-Host ""

# 2. Verificar MySQL
Write-Host "[2/4] Verificando Base de Datos MySQL..." -ForegroundColor Yellow
try {
    $mysqlProcess = Get-Process mysqld -ErrorAction SilentlyContinue
    if ($mysqlProcess) {
        Write-Host "OK MySQL esta corriendo" -ForegroundColor Green
    }
    else {
        Write-Host "MySQL no esta corriendo. Intentando iniciar..." -ForegroundColor Yellow
        if (Test-Path "C:\laragon\laragon.exe") {
            Start-Process "C:\laragon\laragon.exe"
            Start-Sleep -Seconds 3
        }
    }
}
catch {
    Write-Host "No se pudo verificar MySQL" -ForegroundColor Red
}

Write-Host ""

# 3. Iniciar Backend FastAPI
Write-Host "[3/4] Iniciando Backend FastAPI..." -ForegroundColor Yellow
$backendPath = "C:\laragon\www\BRAYAN\proyecto_garantias"
if (-not (Test-Path $backendPath)) {
    $backendPath = $PSScriptRoot
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; if (Test-Path 'venv\Scripts\Activate.ps1') { .\venv\Scripts\Activate.ps1 } else { Write-Host 'Venv not found' }; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -WindowStyle Normal
Write-Host "OK Backend iniciado" -ForegroundColor Green
Start-Sleep -Seconds 5

# 4. Iniciar Frontend Next.js
Write-Host "[4/4] Iniciando Frontend Next.js..." -ForegroundColor Yellow
$frontendPath = "$backendPath\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal
Write-Host "OK Frontend iniciado" -ForegroundColor Green
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SERVICIOS REINICIADOS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Abriendo http://localhost:3000 ..."
Start-Process "http://localhost:3000"

Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
